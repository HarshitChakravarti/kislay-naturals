import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import mongoose, { Document, Model } from 'mongoose';

// Define the Product interface
interface IProduct extends Document {
  name: string;
  price: number;
  description?: string;
  category?: string;
}

// Define the Product schema
const productSchema = new mongoose.Schema<IProduct>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  category: { type: String },
});

// Check if the model exists before compiling it
const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);

    const filter: {
      category?: string;
      name?: { $regex: string; $options: string };
    } = {};
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const products = await Product.find(filter).lean();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error in products API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
