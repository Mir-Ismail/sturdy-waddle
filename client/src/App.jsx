// App.jsx
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
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Loader from "./components/loader";
import UserProfile from "./pages/UserProfile";
import ProductDetails from "./components/ProductDetails";
import CategoryPage from "./pages/CategoryPage";
import NewArrivals from "./pages/NewArrivals";
import TodayDeals from "./pages/TodayDeals";
import CustomerProducts from "./pages/CustomerProducts";
import NotFound from "./components/NotFound";
import Favorites from "./components/user/Favorites";
import OrderHistory from "./components/user/OrderHistory";
import Cart from "./components/user/Cart";
import Wishlist from "./components/user/Wishlist";
import Wallet from "./components/user/Wallet";
import "./Styles/App.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Compare from './components/Compare';

const Layout = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const showNavbar = !location.pathname.startsWith("/dashboard");

  return (
    <>
      {showNavbar && <Navbar />}
      {children}
      {showNavbar && <Footer />}
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

  if (loading) return <Loader />;

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
        path="/order-history"
        element={
          <Layout>
            <OrderHistory />
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
        path="/wallet"
        element={
          <Layout>
            <Wallet />
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

      {/* Product Routes */}
      <Route
        path="/product/:productId"
        element={
          <Layout>
            <ProductDetails />
          </Layout>
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
  <AuthProvider>
    <CartProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </CartProvider>
  </AuthProvider>
);

export default App;
