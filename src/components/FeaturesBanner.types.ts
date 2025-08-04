export type IconName = 'Leaf' | 'Award' | 'ShoppingBag' | 'Shield' | 'Users';

export interface Feature {
  title: string;
  description: string;
  icon: IconName;
}

export interface FeaturesBannerProps {
  features: Feature[];
}
