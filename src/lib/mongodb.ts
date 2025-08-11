import { MongoClient, Db, MongoClientOptions } from 'mongodb';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // Check for environment variables at runtime
  if (!process.env.MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  if (!process.env.MONGODB_DB) {
    throw new Error('Please define the MONGODB_DB environment variable');
  }

  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB;

  const options: MongoClientOptions = {
    // Disable SSL validation in development
    tls: process.env.NODE_ENV === 'production',
    tlsInsecure: process.env.NODE_ENV !== 'production',
    retryWrites: true,
    w: 'majority',
  };

  try {
    const client = new MongoClient(uri, options);
    
    // Connect to MongoDB
    await client.connect();
    const db = client.db(dbName);
    
    // Test the connection
    await db.command({ ping: 1 });
    console.log('Successfully connected to MongoDB');
    
    cachedClient = client;
    cachedDb = db;
    
    return { client, db };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Handle application termination
process.on('SIGINT', async () => {
  if (cachedClient) {
    await cachedClient.close();
    console.log('MongoDB connection closed due to app termination');
    process.exit(0);
  }
});
