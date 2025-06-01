import { useState } from "react";
import { logout as appwriteLogout } from "../lib/appwrite.js";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogout = async () => {
    setError("");
    setIsLoading(true);
    try {
      await appwriteLogout();
      console.log("Logout successful");
      // Redirect to the login page or homepage after logout
      window.location.href = "/login"; // Or "/" for homepage
    } catch (err) {
      console.error("Logout failed:", err);
      setError(err.message || "Failed to logout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const logoutButtonStyle = {
    padding: "10px 20px",
    fontSize: "16px",
    color: "white",
    backgroundColor: "#e74c3c", // A red color for logout
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.2s ease-out",
    margin: "20px",
  };

  const errorStyle = {
    color: "red",
    marginTop: "10px",
  };

  return (
    <>
      {/* Your Dashboard Content Here */}
      <h1>Welcome to your Dashboard!</h1>
      <p>This is where your amazing content will be managed.</p>

      <button
        style={logoutButtonStyle}
        onClick={handleLogout}
        disabled={isLoading}
        onMouseEnter={(e) => (e.target.style.backgroundColor = "#c0392b")}
        onMouseLeave={(e) => (e.target.style.backgroundColor = "#e74c3c")}
      >
        {isLoading ? "Logging out..." : "Logout"}
      </button>
      {error && <div style={errorStyle}>{error}</div>}
    </>
  );
}
