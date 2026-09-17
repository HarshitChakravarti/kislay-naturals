import { supabaseAdmin } from '@/lib/supabaseAdmin';

type CouponConfig = {
  products: {
    keyword: string; // e.g., 'drops', 'erythritol', 'allulose'
    prices: Record<string, number>; // Maps normalized size (e.g., '10ml', '200g') to target price
  }[];
};

// Declarative coupon rules — much cleaner to maintain!
const COUPON_REGISTRY: Record<string, CouponConfig> = {
  special: {
    products: [
      {
        keyword: 'drops',
        prices: {
          '10ml': 249,
          '10ml pack of 2': 539,
          '10ml pack of 3': 769,
          '30ml': 699,
        }
      }
    ]
  },
  holi: {
    products: [
      {
        keyword: 'drops',
        prices: {
          '10ml': 269,
          '30ml': 699,
        }
      }
    ]
  },
  sweetsmart: {
    products: [
      {
        keyword: 'drops',
        prices: {
          '10ml': 279,
          '10ml pack of 2': 549,
          '10ml pack of 3': 779,
          '30ml': 679,
        }
      },
      {
        keyword: 'erythritol',
        prices: {
          '200g': 299,
          '200gm': 299,
          '400g': 529,
          '400gm': 529,
        }
      },
      {
        keyword: 'allulose',
        prices: {
          '200g': 479,
          '200gm': 479,
          '400g': 879,
          '400gm': 879,
        }
      }
    ]
  }
};

const VALID_COUPON_CODES: Record<string, string> = {
  SPECIAL:    'special',
  HOLI26:     'holi',
  SWEETSMART: 'sweetsmart',
};

function normalizeSize(size: string): string {
  return size.trim().toLowerCase();
}

function getCouponPriceForVariant(
  variant: { size: string; price: number },
  couponType: string,
  productName: string
): number | null {
  const config = COUPON_REGISTRY[couponType];
  if (!config) return null;

  const nameLower = productName.toLowerCase();
  const sizeNormalized = normalizeSize(variant.size);

  for (const productRule of config.products) {
    if (nameLower.includes(productRule.keyword)) {
      const targetPrice = productRule.prices[sizeNormalized];
      if (targetPrice != null) {
        // Never allow a coupon to accidentally increase the price
        return Math.min(variant.price, targetPrice);
      }
    }
  }

  return null;
}

export type ValidateCouponResult = {
  valid: boolean;
  message?: string;
  couponType?: string;
  finalTotal?: number;
  couponDiscount?: number;
};

export async function validateCouponData(
  couponCode: string | undefined | null,
  productId?: string,
  variantSize?: string,
  quantity?: number | string,
  cartItems?: { productId: string; variantSize?: string; quantity: number }[]
): Promise<ValidateCouponResult> {
  if (!couponCode) {
    return { valid: false, message: 'Coupon code is required' };
  }

  const upperCode = String(couponCode).trim().toUpperCase();
  const couponType = VALID_COUPON_CODES[upperCode];

  if (!couponType) {
    return { valid: false, message: 'Invalid coupon code' };
  }

  // --- Cart checkout ---
  if (cartItems && Array.isArray(cartItems) && cartItems.length > 0) {
    const productIds: string[] = [...new Set(cartItems.map((i: any) => String(i.productId)))];
    const { data: products, error } = await supabaseAdmin
      .from('products')
      .select('id, name, variants, price')
      .in('id', productIds);

    if (error || !products) {
      return { valid: false, message: 'Could not verify products' };
    }

    const productMap = new Map(products.map((p) => [p.id, p]));

    let baseTotal = 0;
    let finalTotal = 0;
    let couponApplicable = false;

    for (const item of cartItems) {
      const prod = productMap.get(String(item.productId));
      if (!prod) continue;

      const variants: any[] = prod.variants || [];
      const variant = variants.find((v: any) => v.size?.trim().toLowerCase() === (item.variantSize || '').trim().toLowerCase())
        || { size: item.variantSize || '', price: prod.price };

      const itemBaseTotal = variant.price * item.quantity;
      baseTotal += itemBaseTotal;

      const couponPrice = getCouponPriceForVariant(variant, couponType, prod.name);
      
      if (couponPrice !== null) {
        couponApplicable = true;
        finalTotal += couponPrice * item.quantity;
      } else {
        finalTotal += itemBaseTotal;
      }
    }

    if (!couponApplicable) {
      return { valid: false, message: 'This coupon does not apply to your cart items' };
    }

    return {
      valid: true,
      couponType,
      finalTotal: Math.round(finalTotal * 100) / 100,
      couponDiscount: Math.round((baseTotal - finalTotal) * 100) / 100,
    };
  }

  // --- Single product checkout ---
  if (!productId) {
    return { valid: false, message: 'productId is required' };
  }

  const qty = typeof quantity === 'string' ? parseInt(quantity, 10) : (quantity || 1);

  const { data: product, error } = await supabaseAdmin
    .from('products')
    .select('id, name, variants, price')
    .eq('id', productId)
    .single();

  if (error || !product) {
    return { valid: false, message: 'Product not found' };
  }

  const variants: any[] = product.variants || [];
  const variant = variants.find((v: any) => v.size?.trim().toLowerCase() === (variantSize || '').trim().toLowerCase())
    || { size: variantSize || '', price: product.price };

  const couponPrice = getCouponPriceForVariant(variant, couponType, product.name);

  if (couponPrice === null) {
    return { valid: false, message: 'This coupon does not apply to this product/size' };
  }

  const baseTotal = variant.price * qty;
  const finalTotal = couponPrice * qty;

  return {
    valid: true,
    couponType,
    finalTotal: Math.round(finalTotal * 100) / 100,
    couponDiscount: Math.round((baseTotal - finalTotal) * 100) / 100,
  };
}
