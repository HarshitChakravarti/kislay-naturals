import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/slices/productSlice';
import { toast } from 'react-toastify';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || 'latest',
    page: parseInt(searchParams.get('page')) || 1,
  });

  const dispatch = useDispatch();
  const { products, loading, error, page, pages, count } = useSelector((state) => ({
    products: state.products.products,
    loading: state.products.loading,
    error: state.products.error,
    page: state.products.page || 1,
    pages: state.products.pages || 1,
    count: state.products.count || 0,
  }));

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const params = new URLSearchParams();
        if (filters.category) params.set('category', filters.category);
        if (filters.search) params.set('search', filters.search);
        if (filters.sort) params.set('sort', filters.sort);
        params.set('page', filters.page);
        
        setSearchParams(params);
        await dispatch(fetchProducts(Object.fromEntries(params)));
      } catch (err) {
        toast.error(error || 'Failed to load products');
      }
    };

    loadProducts();
  }, [dispatch, filters, error, setSearchParams]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage,
    }));
    window.scrollTo(0, 0);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
            
            {/* Search */}
            <div className="mb-6">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                id="search"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search products..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Category</h4>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Categories</option>
                <option value="essential-oils">Essential Oils</option>
                <option value="herbs">Herbs</option>
                <option value="supplements">Supplements</option>
                <option value="skincare">Skincare</option>
                <option value="haircare">Haircare</option>
              </select>
            </div>

            {/* Sort */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Sort By</h4>
              <select
                name="sort"
                value={filters.sort}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="latest">Latest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>

            {/* Clear Filters */}
            <button
              onClick={() => setFilters({
                category: '',
                search: '',
                sort: 'latest',
                page: 1,
              })}
              className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {filters.category ? `${filters.category.charAt(0).toUpperCase() + filters.category.slice(1)} Products` : 'All Products'}
            </h2>
            <p className="text-gray-600">{count} products found</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
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
            <div className="text-center py-12">
              <p className="text-red-500 text-lg">{error}</p>
              <button
                onClick={() => dispatch(fetchProducts(filters))}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Retry
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found. Try adjusting your filters.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
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
                      <div className="mt-2 flex justify-between items-center">
                        <span className="font-bold text-gray-900">${product.price.toFixed(2)}</span>
                        {product.stock > 0 ? (
                          <span className="text-sm text-green-600">In Stock</span>
                        ) : (
                          <span className="text-sm text-red-600">Out of Stock</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="mt-8 flex justify-center">
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className={`px-3 py-1 rounded-md ${page === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: pages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1 rounded-md ${page === pageNum 
                          ? 'bg-indigo-600 text-white' 
                          : 'text-gray-700 hover:bg-gray-100'}`}
                      >
                        {pageNum}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === pages}
                      className={`px-3 py-1 rounded-md ${page === pages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
