import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navigation from "./components/Navigation.jsx";
import Page1 from "./components/Page1.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import Dashboard from "./components/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { UserProvider, useUser } from "./context/UserContext.jsx";
import Connection from "./components/Connection.jsx";
import TikTok from "./components/Tiktok.jsx";
import Instagram from "./components/Instagram.jsx";
import Youtube from "./components/Youtube.jsx";
import Facebook from "./components/Facebook.jsx";
import Loading from "./components/Loading.jsx";
import Footer from "./components/Footer.jsx";
import "./App.css";

function PublicRoute({ children }) {
  const { currentUser, isLoading } = useUser();

  if (isLoading) {
    return <Loading />;
  }

  return currentUser ? <Navigate to="/dashboard" replace /> : children;
}

function AppContent() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <Navigation />
            <Page1 />
            <Footer />
          </>
        }
      />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/connect"
        element={
          <ProtectedRoute>
            <Connection />
          </ProtectedRoute>
        }
      />

      <Route
        path="/connect/tiktok"
        element={
          <ProtectedRoute>
            <TikTok />
          </ProtectedRoute>
        }
      />

      <Route
        path="/connect/instagram"
        element={
          <ProtectedRoute>
            <Instagram />
          </ProtectedRoute>
        }
      />

      <Route
        path="/connect/facebook"
        element={
          <ProtectedRoute>
            <Facebook />
          </ProtectedRoute>
        }
      />

      <Route
        path="/connect/youtube"
        element={
          <ProtectedRoute>
            <Youtube />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <UserProvider>
      <Router>
        <AppContent />
      </Router>
    </UserProvider>
  );
}

export default App;
