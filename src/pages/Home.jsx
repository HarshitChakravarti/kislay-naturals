import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/slices/productSlice';
import { toast } from 'react-toastify';

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        await dispatch(fetchProducts({ limit: 4 }));
      } catch (err) {
        toast.error(error || 'Failed to load products');
      }
    };

    loadProducts();
  }, [dispatch, error]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-indigo-50 rounded-lg p-8 mb-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Kislay Naturals
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover our premium collection of natural and organic products for a healthier lifestyle.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/products"
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors"
            >
              Shop Now
            </Link>
            {!isAuthenticated && (
              <Link
                to="/register"
                className="px-6 py-3 border border-indigo-600 text-indigo-600 font-medium rounded-md hover:bg-indigo-50 transition-colors"
              >
                Create Account
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
          <Link to="/products" className="text-indigo-600 hover:text-indigo-800">
            View All Products →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="bg-gray-200 h-48 w-full"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product) => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={product.images[0]?.url || '/placeholder-product.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                  <p className="mt-2 font-bold text-gray-900">${product.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="text-center p-6 bg-white rounded-lg shadow">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">100% Natural</h3>
          <p className="text-gray-600">All our products are made from natural ingredients.</p>
        </div>
        <div className="text-center p-6 bg-white rounded-lg shadow">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Fast Delivery</h3>
          <p className="text-gray-600">Quick and reliable shipping to your doorstep.</p>
        </div>
        <div className="text-center p-6 bg-white rounded-lg shadow">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Secure Payment</h3>
          <p className="text-gray-600">Safe and secure payment options.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
