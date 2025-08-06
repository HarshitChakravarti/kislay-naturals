import HomeClient from '@/components/HomeClient';

export default async function Home() {
  // You would typically fetch this data from your API
  const featuredProducts = [
    {
      id: '1',
      name: 'Monk Fruit Drops',
      price: 299,
      image: '/p1.png',
      description: 'Natural sweetener with zero calories',
      inStock: true
    },
    // Add more featured products as needed
  ];

  return (
    <main>
      <HomeClient products={featuredProducts} />
    </main>
  );
}
