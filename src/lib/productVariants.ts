import type { ProductVariant } from '@/types';

export const DEFAULT_PRODUCT_GALLERY = [
  '/product1.png',
  '/product2.png',
  '/product3.png',
  '/product4.png',
  '/product5.png',
];

export const DEFAULT_PRODUCT_VARIANTS: ProductVariant[] = [
  { size: '10ml', price: 299, originalPrice: 399, unitCount: 1 },
  { size: '10ml pack of 2', price: 549, originalPrice: 798, image: '/1.png', unitCount: 2 },
  { size: '10ml pack of 3', price: 799, originalPrice: 1197, image: '/2.png', unitCount: 3 },
  { size: '30ml', price: 699, originalPrice: 999, unitCount: 1 },
];

export type VariantCouponType = 'special' | 'holi' | 'sweetsmart';

const THIRTY_ML_COUPON_PRICE: Record<VariantCouponType, number> = {
  special: 699,
  holi: 699,
  sweetsmart: 669,
};

const TEN_ML_COUPON_PRICE: Record<VariantCouponType, number> = {
  special: 249,
  holi: 269,
  sweetsmart: 279,
};

const FIXED_BUNDLE_COUPON_PRICE_BY_TYPE: Partial<Record<VariantCouponType, Record<number, number>>> = {
  special: {
    2: 539,
    3: 769,
  },
  sweetsmart: {
    2: 519,
    3: 679,
  },
};

function normalizeVariantKey(size: string) {
  return size.trim().toLowerCase();
}

export function getBundleUnitCount(variant?: ProductVariant): number {
  if (!variant) {
    return 1;
  }

  if (variant.unitCount && variant.unitCount > 0) {
    return variant.unitCount;
  }

  const packMatch = variant.size.match(/pack of\s+(\d+)/i);
  if (packMatch) {
    const parsedCount = Number.parseInt(packMatch[1], 10);
    if (!Number.isNaN(parsedCount) && parsedCount > 0) {
      return parsedCount;
    }
  }

  return 1;
}

export function normalizeProductVariants(variants?: ProductVariant[]): ProductVariant[] {
  const incomingVariants = Array.isArray(variants) ? variants : [];
  const incomingBySize = new Map(
    incomingVariants.map((variant) => [normalizeVariantKey(variant.size), variant])
  );

  const normalizedDefaults = DEFAULT_PRODUCT_VARIANTS.map((defaultVariant) => ({
    ...defaultVariant,
    ...(incomingBySize.get(normalizeVariantKey(defaultVariant.size)) ?? {}),
  }));

  const extraVariants = incomingVariants.filter(
    (variant) =>
      !DEFAULT_PRODUCT_VARIANTS.some(
        (defaultVariant) =>
          normalizeVariantKey(defaultVariant.size) === normalizeVariantKey(variant.size)
      )
  );

  return [...normalizedDefaults, ...extraVariants];
}

export function findProductVariant(size?: string, variants?: ProductVariant[]) {
  if (!size) {
    return undefined;
  }

  const normalizedSize = normalizeVariantKey(size);
  return normalizeProductVariants(variants).find(
    (variant) => normalizeVariantKey(variant.size) === normalizedSize
  );
}

export function getProductGalleryForVariant(variant?: ProductVariant) {
  if (!variant?.image) {
    return DEFAULT_PRODUCT_GALLERY;
  }

  return [
    variant.image,
    ...DEFAULT_PRODUCT_GALLERY.slice(1).filter((image) => image !== variant.image),
  ];
}

export function getVariantCouponPrice(
  variant: ProductVariant | undefined,
  couponType: VariantCouponType
): number | null {
  if (!variant) {
    return null;
  }

  const normalizedSize = normalizeVariantKey(variant.size);

  if (normalizedSize === '30ml') {
    // Never allow coupon pricing to raise the current selling price.
    return Math.min(variant.price, THIRTY_ML_COUPON_PRICE[couponType]);
  }

  if (!normalizedSize.startsWith('10ml')) {
    return null;
  }

  const bundleUnitCount = getBundleUnitCount(variant);
  const fixedBundlePrice = FIXED_BUNDLE_COUPON_PRICE_BY_TYPE[couponType]?.[bundleUnitCount];

  if (fixedBundlePrice) {
    return Math.min(variant.price, fixedBundlePrice);
  }

  const bundlePrice = TEN_ML_COUPON_PRICE[couponType] * bundleUnitCount;

  // Keep bundle coupons additive without ever raising the current selling price.
  return Math.min(variant.price, bundlePrice);
}
