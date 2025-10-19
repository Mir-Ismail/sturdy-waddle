// App.jsx
import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ResponsiveHeader from "./components/ResponsiveHeader";
import ResponsiveFooter from "./components/ResponsiveFooter";
import ResponsiveSidebar from "./components/ResponsiveSidebar";
import LoadingSpinner from "./components/LoadingSpinner";
import UserProfile from "./pages/UserProfile";
import ProductDetails from "./components/ProductDetails";
import CategoryPage from "./pages/CategoryPage";
import NewArrivals from "./pages/NewArrivals";
import TodayDeals from "./pages/TodayDeals";
import CustomerProducts from "./pages/CustomerProducts";
import NotFound from "./components/NotFound";
import Favorites from "./components/user/Favorites";
import Cart from "./components/user/Cart";
import Wishlist from "./components/user/Wishlist";
import "./Styles/App.css";
import "./components/MainContent.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Compare from './components/Compare';
import Checkout from "./pages/Checkout";
import UserOrderHistory from "./pages/userOrders";
import Navbar from "./components/Navbar";

// eslint-disable-next-line react/prop-types
const Layout = ({ children }) => {
  const { loading } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const showNavbar = !location.pathname.startsWith("/dashboard");

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading..." />;
  }

  return (
    <>
      {showNavbar && (
        <>
          <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
          <ResponsiveSidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        </>
      )}
      <main className="main-content">
        {children}
      </main>
      {showNavbar && <ResponsiveFooter />}
    </>
  );
};

// Helper function to get redirect path based on user role
const getRedirectPath = (user) => {
  if (!user) return "/";

  const userRole = user.role;

  if (userRole === "buyer" || !userRole) {
    // Buyers go to home page
    return "/";
  } else if (userRole === "vendor" || userRole === "admin") {
    // Vendors and admins go to dashboard
    return "/dashboard";
  } else {
    // Default fallback to home page
    return "/";
  }
};

const AppRoutes = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <LoadingSpinner fullScreen text="Loading..." />;

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to={getRedirectPath(user)} replace />
          ) : (
            <Layout>
              <Login />
            </Layout>
          )
        }
      />
      <Route
        path="/register"
        element={
          isAuthenticated ? (
            <Navigate to={getRedirectPath(user)} replace />
          ) : (
            <Layout>
              <Register />
            </Layout>
          )
        }
      />
      <Route
        path="/dashboard"
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
      />
      <Route path="/userprofile" element={<UserProfile />} />
      <Route
        path="/edit-profile/:id"
        element={
          isAuthenticated ? (
            <Layout>
              <UserProfile />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* User-specific Routes */}
      <Route
        path="/favorites"
        element={
          <Layout>
            <Favorites />
          </Layout>
        }
      />
      <Route
        path="/cart"
        element={
          <Layout>
            <Cart />
          </Layout>
        }
      />
      <Route
        path="/wishlist"
        element={
          <Layout>
            <Wishlist />
          </Layout>
        }
      />

      <Route
        path="/compare"
        element={
          <Layout>
            <Compare />
          </Layout>
        }
      />
      <Route
        path="/orders"
        element={
          <Layout>
            <UserOrderHistory />
          </Layout>
        }
      />

      {/* Product Routes */}
      <Route
        path="/product/:productId"
        element={
          <Layout>
            <ProductDetails />
          </Layout>
        }
      />

      <Route
        path="/checkout"
        element={
          isAuthenticated ? (
            <Layout>
              <Checkout />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      {/* Customer Products Route */}
      <Route
        path="/products"
        element={
          <Layout>
            <CustomerProducts />
          </Layout>
        }
      />

      {/* Category Routes */}
      <Route
        path="/category/:category"
        element={
          <Layout>
            <CategoryPage />
          </Layout>
        }
      />

      {/* Navigation Routes */}
      <Route
        path="/new-arrivals"
        element={
          <Layout>
            <NewArrivals />
          </Layout>
        }
      />
      <Route
        path="/todays-deal"
        element={
          <Layout>
            <TodayDeals />
          </Layout>
        }
      />

      {/* Specific Category Routes */}
      <Route path="/home-appliances" element={<Navigate to="/category/home-appliances" replace />} />
      <Route path="/audio-video" element={<Navigate to="/category/audio-video" replace />} />
      <Route path="/refrigerator" element={<Navigate to="/category/refrigerator" replace />} />
      <Route path="/gift-cards" element={<Navigate to="/category/gift-cards" replace />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <ErrorBoundary>
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  </ErrorBoundary>
);

// Layout component expects children prop

export default App;
