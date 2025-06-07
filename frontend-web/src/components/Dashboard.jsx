import { useState, useEffect } from "react";
import { logout as appwriteLogout } from "../lib/appwrite.js";
import { useUser } from "../context/UserContext.jsx";
import UserPfp from "../assets/User.png";

export default function Dashboard() {
  const { currentUser, userDoc, userStats } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogout = async () => {
    setError("");
    setIsLoading(true);
    try {
      await appwriteLogout();
      console.log("Logout successful");
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed:", err);
      setError(err.message || "Failed to logout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnection = () => {
    setError("");
    setIsLoading(true);
    try {
      window.location.href = "/connect";
    } catch (err) {
      console.error("Connection failed:", err);
      setError(err.message || "Failed to connect. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("Current User:", currentUser);
    console.log("User Document:", userDoc);
    console.log("User Stats:", userStats);
  }, []);

  const containerStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)", // Light gradient
    color: "#212529", // Dark text
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    position: "relative",
  };

  const topBarStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    borderBottom: "1px solid #dee2e6", // Light border
    background: "rgba(255, 255, 255, 0.8)", // Light translucent background
    backdropFilter: "blur(10px)",
  };

  const logoStyle = {
    fontSize: "1.5rem",
    fontWeight: "bold",
    background: "linear-gradient(135deg, #ff0050 0%, #ff6b35 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  };

  const buttonGroupStyle = {
    display: "flex",
    gap: "1rem",
  };

  const buttonStyle = {
    padding: "0.75rem 1.5rem",
    fontSize: "0.9rem",
    fontWeight: "600",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    transform: "translateY(0)",
  };

  const connectButtonStyle = {
    ...buttonStyle,
    background: "linear-gradient(135deg, #ff0050 0%, #ff6b35 100%)",
    color: "#ffffff",
  };

  const logoutButtonStyle = {
    ...buttonStyle,
    background: "transparent",
    color: "#495057", // Dark text
    border: "2px solid #adb5bd", // Light border
  };

  const profileSectionStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "3rem 2rem 2rem",
    maxWidth: "600px",
    margin: "0 auto",
  };

  const profileImageStyle = {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    border: "3px solid #ff0050",
    marginBottom: "1.5rem",
    objectFit: "cover",
  };

  const usernameStyle = {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
    textAlign: "center",
    color: "#212529", // Dark text
  };

  const emailStyle = {
    fontSize: "1rem",
    color: "#6c757d", // Medium gray text
    marginBottom: "2rem",
    textAlign: "center",
  };

  const statsContainerStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "3rem",
    marginBottom: "3rem",
    flexWrap: "wrap",
  };

  const statItemStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  };

  const statNumberStyle = {
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: "#212529", // Dark text
    marginBottom: "0.25rem",
  };

  const statLabelStyle = {
    fontSize: "0.9rem",
    color: "#6c757d", // Medium gray text
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  const videosSectionStyle = {
    padding: "2rem",
    borderTop: "1px solid #dee2e6", // Light border
  };

  const sectionTitleStyle = {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "2rem",
    textAlign: "center",
    color: "#212529", // Dark text
  };

  const videosGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "1rem",
    maxWidth: "1200px",
    margin: "0 auto",
  };

  const videoPlaceholderStyle = {
    aspectRatio: "9/16",
    background: "linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%)", // Light gradient
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#6c757d", // Medium gray text
    fontSize: "0.9rem",
    border: "2px dashed #adb5bd", // Light dashed border
    transition: "all 0.3s ease",
  };

  const premiumBadgeStyle = {
    display: "inline-block",
    padding: "0.25rem 0.75rem",
    background: "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)",
    color: "#000",
    borderRadius: "20px",
    fontSize: "0.75rem",
    fontWeight: "bold",
    marginBottom: "1rem",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  const formatNumber = (num) => {
    if (!num) return "0";
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  // Create placeholder video items
  const videoPlaceholders = Array.from({ length: 6 }, (_, i) => (
    <div
      key={i}
      style={videoPlaceholderStyle}
      onMouseEnter={(e) => {
        e.target.style.borderColor = "#ff0050";
        e.target.style.transform = "scale(1.02)";
      }}
      onMouseLeave={(e) => {
        e.target.style.borderColor = "#adb5bd";
        e.target.style.transform = "scale(1)";
      }}
    >
      Video {i + 1}
      <br />
      Coming Soon
    </div>
  ));

  return (
    <div style={containerStyle}>
      {/* Top Navigation Bar */}
      <div style={topBarStyle}>
        <div style={logoStyle}>TikTonik</div>
        <div style={buttonGroupStyle}>
          <button
            style={connectButtonStyle}
            onClick={handleConnection}
            disabled={isLoading}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 8px 20px rgba(255, 0, 80, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "none";
            }}
          >
            {isLoading ? "Connecting..." : "Connect Accounts"}
          </button>
          <button
            style={logoutButtonStyle}
            onClick={handleLogout}
            disabled={isLoading}
            onMouseEnter={(e) => {
              e.target.style.borderColor = "#ff0050";
              e.target.style.color = "#ff0050";
              e.target.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = "#adb5bd";
              e.target.style.color = "#495057";
              e.target.style.transform = "translateY(0)";
            }}
          >
            {isLoading ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>

      {/* Profile Section */}
      <div style={profileSectionStyle}>
        <img src={UserPfp} alt="User Profile" style={profileImageStyle} />

        {userDoc?.Premium && (
          <div style={premiumBadgeStyle}>Premium Member</div>
        )}

        <h1 style={usernameStyle}>
          {userDoc?.Name || currentUser?.name || "TikTonik User"}
        </h1>
        <p style={emailStyle}>{currentUser?.email}</p>

        {/* Stats Section */}
        <div style={statsContainerStyle}>
          <div style={statItemStyle}>
            <div style={statNumberStyle}>{formatNumber(userStats?.Views)}</div>
            <div style={statLabelStyle}>Views</div>
          </div>
          <div style={statItemStyle}>
            <div style={statNumberStyle}>{formatNumber(userStats?.Likes)}</div>
            <div style={statLabelStyle}>Likes</div>
          </div>
          <div style={statItemStyle}>
            <div style={statNumberStyle}>
              {formatNumber(userStats?.Comments)}
            </div>
            <div style={statLabelStyle}>Comments</div>
          </div>
          <div style={statItemStyle}>
            <div style={statNumberStyle}>
              {userStats?.WatchTime ? `${userStats.WatchTime}h` : "0h"}
            </div>
            <div style={statLabelStyle}>Watch Time</div>
          </div>
        </div>
      </div>

      {/* Videos Section */}
      <div style={videosSectionStyle}>
        <h2 style={sectionTitleStyle}>Your Videos</h2>
        <div style={videosGridStyle}>{videoPlaceholders}</div>
      </div>

      {error && (
        <div
          style={{
            position: "fixed",
            bottom: "2rem",
            right: "2rem",
            background: "#ff3333",
            color: "#ffffff",
            padding: "1rem",
            borderRadius: "8px",
            zIndex: 1000,
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
