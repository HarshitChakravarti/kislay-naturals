import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Store
import { store } from './store/store';

// Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import PrivateRoute from './components/routing/PrivateRoute';
import AdminRoute from './components/routing/AdminRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/user/Profile';
import ProductList from './pages/products/ProductList';
import ProductDetails from './pages/products/ProductDetails';
import Cart from './pages/cart/Cart';
import Shipping from './pages/order/Shipping';
import Payment from './pages/order/Payment';
import PlaceOrder from './pages/order/PlaceOrder';
import OrderDetails from './pages/order/OrderDetails';
import OrderList from './pages/admin/OrderList';
import ProductListAdmin from './pages/admin/ProductList';
import ProductEdit from './pages/admin/ProductEdit';
import UserList from './pages/admin/UserList';
import UserEdit from './pages/admin/UserEdit';
import NotFound from './pages/error/NotFound';

// Utils
import { loadUser } from './store/slices/authSlice';

function App() {
  useEffect(() => {
    // Try to load user on app mount
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/cart/:id" element={<Cart />} />

              {/* Protected Routes */}
              <Route path="/shipping" element={<PrivateRoute><Shipping /></PrivateRoute>} />
              <Route path="/payment" element={<PrivateRoute><Payment /></PrivateRoute>} />
              <Route path="/placeorder" element={<PrivateRoute><PlaceOrder /></PrivateRoute>} />
              <Route path="/order/:id" element={<PrivateRoute><OrderDetails /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

              {/* Admin Routes */}
              <Route path="/admin/orderlist" element={
                <AdminRoute><OrderList /></AdminRoute>
              } />
              <Route path="/admin/productlist" element={
                <AdminRoute><ProductListAdmin /></AdminRoute>
              } />
              <Route path="/admin/product/:id/edit" element={
                <AdminRoute><ProductEdit /></AdminRoute>
              } />
              <Route path="/admin/userlist" element={
                <AdminRoute><UserList /></AdminRoute>
              } />
              <Route path="/admin/user/:id/edit" element={
                <AdminRoute><UserEdit /></AdminRoute>
              } />

              {/* 404 - Keep this last */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
      <ToastContainer position="bottom-right" />
    </Provider>
  );
}

export default App;
