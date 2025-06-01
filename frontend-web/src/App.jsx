import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navigation from "./components/Navigation.jsx";
import Page1 from "./components/Page1.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import Dashboard from "./components/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx"; // Import ProtectedRoute
import { UserProvider, useUser } from "./context/UserContext.jsx"; // Import UserProvider and useUser
import "./App.css";

// Helper component for public routes like login/signup
function PublicRoute({ children }) {
  const { currentUser, isLoading } = useUser();

  if (isLoading) {
    return <div>Loading...</div>; // Or some loading indicator
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

      {/* Protected Dashboard Route */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Add other protected routes here if needed */}
      </Route>

      {/* Optional: Redirect any unknown paths to home or a 404 page */}
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