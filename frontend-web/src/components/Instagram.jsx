import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext.jsx";
import instagramLogo from "../assets/instagram.png";

export default function Instagram() {
  const { currentUser, userDoc } = useUser();
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Instagram OAuth configuration
  const INSTAGRAM_CLIENT_ID = import.meta.env.VITE_INSTAGRAM_CLIENT_ID; // Use the App ID from your Meta dashboard
  const REDIRECT_URI = `${window.location.origin}/auth/instagram/callback`;
  const SCOPE = "user_profile,user_media,instagram_content_publish";

  useEffect(() => {
    fetchConnectedAccounts();
  }, [currentUser]);

  const fetchConnectedAccounts = async () => {
    if (!currentUser) return;

    try {
      // Fetch user's connected Instagram accounts from your database
      const accounts = await getConnectedAccounts(currentUser.$id, "instagram");
      setConnectedAccounts(accounts);
    } catch (error) {
      console.error("Failed to fetch connected accounts:", error);
    }
  };

  const handleConnectInstagram = () => {
    if (!userDoc?.Premium && connectedAccounts.length >= 1) {
      alert("Premium required to connect multiple Instagram accounts");
      return;
    }

    if (connectedAccounts.length >= 5) {
      alert("Maximum 5 Instagram accounts allowed per platform");
      return;
    }

    // Create state parameter for security
    const state = encodeURIComponent(
      JSON.stringify({
        userId: currentUser.$id,
        platform: "instagram",
        timestamp: Date.now(),
      })
    );

    // Instagram OAuth URL - using the App ID from your Meta dashboard (1227240252211915)
    const authUrl =
      `https://api.instagram.com/oauth/authorize` +
      `?client_id=${INSTAGRAM_CLIENT_ID || "1227240252211915"}` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
      `&scope=${SCOPE}` +
      `&response_type=code` +
      `&state=${state}`;

    console.log("Redirecting to Instagram OAuth:", authUrl);
    window.location.href = authUrl;
  };

  const handleDisconnectAccount = async (accountId) => {
    try {
      setIsLoading(true);
      await disconnectAccount(accountId);
      await fetchConnectedAccounts();
    } catch (error) {
      console.error("Failed to disconnect account:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Styles
  const containerStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
    padding: "2rem",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  };

  const cardStyle = {
    maxWidth: "600px",
    margin: "0 auto",
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    padding: "3rem",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
  };

  const headerStyle = {
    textAlign: "center",
    marginBottom: "2.5rem",
  };

  const titleStyle = {
    fontSize: "2.5rem",
    fontWeight: "700",
    background: "linear-gradient(135deg, #E1306C 0%, #F56040 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    marginBottom: "0.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
  };

  const subtitleStyle = {
    color: "#64748b",
    fontSize: "1.1rem",
    marginBottom: "0.5rem",
  };

  const statusBadgeStyle = {
    display: "inline-block",
    padding: "0.5rem 1rem",
    borderRadius: "20px",
    fontSize: "0.875rem",
    fontWeight: "600",
    background: userDoc?.Premium
      ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
      : "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    color: "#ffffff",
    marginTop: "0.5rem",
  };

  const accountCardStyle = {
    background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
    border: "2px solid #e5e7eb",
    borderRadius: "16px",
    padding: "1.5rem",
    marginBottom: "1rem",
    position: "relative",
  };

  const accountNumberStyle = {
    position: "absolute",
    top: "-12px",
    left: "20px",
    background: "linear-gradient(135deg, #E1306C 0%, #F56040 100%)",
    color: "#ffffff",
    padding: "0.25rem 0.75rem",
    borderRadius: "12px",
    fontSize: "0.75rem",
    fontWeight: "700",
  };

  const connectButtonStyle = {
    width: "100%",
    padding: "1rem 1.5rem",
    borderRadius: "12px",
    border: "none",
    fontSize: "1rem",
    fontWeight: "600",
    cursor:
      !isLoading &&
      (userDoc?.Premium || connectedAccounts.length === 0) &&
      connectedAccounts.length < 5
        ? "pointer"
        : "not-allowed",
    transition: "all 0.3s ease",
    marginTop: "2rem",
    background:
      !isLoading &&
      (userDoc?.Premium || connectedAccounts.length === 0) &&
      connectedAccounts.length < 5
        ? "linear-gradient(135deg, #E1306C 0%, #F56040 100%)"
        : "#9ca3af",
    color: "#ffffff",
    transform: "translateY(0)",
    opacity: isLoading ? 0.7 : 1,
  };

  const configInfoStyle = {
    background: "#f0f9ff",
    border: "1px solid #0ea5e9",
    borderRadius: "8px",
    padding: "1rem",
    marginBottom: "1.5rem",
    fontSize: "0.9rem",
    color: "#0c4a6e",
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>
            <img
              src={instagramLogo}
              alt="Instagram"
              style={{ width: "40px", height: "40px" }}
            />
            Connect Instagram
          </h1>
          <p style={subtitleStyle}>
            Connect your Instagram accounts to start automating your content
          </p>
          <div style={statusBadgeStyle}>
            {userDoc?.Premium
              ? "Premium Member"
              : "Premium Required for multiple accounts"}
          </div>
        </div>

        {/* Configuration Info */}
        <div style={configInfoStyle}>
          <strong>Setup Status:</strong>
          <br />
          App ID: {INSTAGRAM_CLIENT_ID || "1227240252211915"} (from Meta
          Dashboard)
          <br />
          Redirect URI: {REDIRECT_URI}
          <br />
          <small>
            Make sure this redirect URI is added to your Meta app settings.
          </small>
        </div>

        {/* Connected Accounts */}
        {connectedAccounts.length > 0 && (
          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ marginBottom: "1rem", color: "#374151" }}>
              Connected Accounts ({connectedAccounts.length}/5)
            </h3>
            {connectedAccounts.map((account, index) => (
              <div key={account.id} style={accountCardStyle}>
                <div style={accountNumberStyle}>Account {index + 1}</div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <strong style={{ color: "#374151" }}>
                      {account.accountName || account.username}
                    </strong>
                    <p
                      style={{
                        color: "#64748b",
                        fontSize: "0.9rem",
                        margin: "0.25rem 0 0 0",
                      }}
                    >
                      Connected:{" "}
                      {new Date(account.connectedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDisconnectAccount(account.id)}
                    disabled={isLoading}
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: isLoading ? "not-allowed" : "pointer",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      opacity: isLoading ? 0.7 : 1,
                    }}
                  >
                    {isLoading ? "..." : "Disconnect"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Instructions */}
        <div
          style={{
            background: "#f0f9ff",
            border: "1px solid #0ea5e9",
            borderRadius: "8px",
            padding: "1rem",
            marginBottom: "1.5rem",
            fontSize: "0.9rem",
            color: "#0c4a6e",
          }}
        >
          <strong>How it works:</strong>
          <ul style={{ margin: "0.5rem 0 0 1rem", paddingLeft: "1rem" }}>
            <li>Click "Connect" to authenticate with Instagram</li>
            <li>You'll be redirected to Instagram's secure login</li>
            <li>Grant permissions to manage your content</li>
            <li>Your account will be securely linked for auto-posting</li>
            <li>
              {userDoc?.Premium
                ? "Premium users can connect up to 5 accounts"
                : "Free users can connect 1 account"}
            </li>
          </ul>
        </div>

        {/* Connect New Account Button */}
        <button
          onClick={handleConnectInstagram}
          disabled={
            isLoading ||
            (!userDoc?.Premium && connectedAccounts.length >= 1) ||
            connectedAccounts.length >= 5
          }
          style={connectButtonStyle}
          onMouseEnter={(e) => {
            if (e.target.style.cursor === "pointer") {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 10px 20px rgba(225, 48, 108, 0.3)";
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "none";
          }}
        >
          {connectedAccounts.length >= 5
            ? "Maximum accounts reached (5/5)"
            : !userDoc?.Premium && connectedAccounts.length >= 1
            ? "Premium required for more accounts"
            : isLoading
            ? "Connecting..."
            : `+ Connect Instagram Account (${connectedAccounts.length}/5)`}
        </button>

        {/* Setup Instructions */}
        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
            background: "#f9fafb",
            borderRadius: "8px",
            fontSize: "0.875rem",
            color: "#374151",
          }}
        >
          <strong>Meta Developer Setup Checklist:</strong>
          <ol style={{ margin: "0.5rem 0 0 1rem", paddingLeft: "1rem" }}>
            <li>✅ App created in Meta for Developers</li>
            <li>✅ Instagram product added to your app</li>
            <li>
              📝 Add redirect URI:{" "}
              <code
                style={{
                  background: "#e5e7eb",
                  padding: "0.125rem 0.25rem",
                  borderRadius: "4px",
                }}
              >
                {REDIRECT_URI}
              </code>
            </li>
            <li>
              📝 Set environment variable:
              VITE_INSTAGRAM_CLIENT_ID=1227240252211915
            </li>
            <li>📝 Complete app review process for production</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

// Helper functions (implement these based on your database structure)
async function getConnectedAccounts(userId, platform) {
  try {
    // Replace with your actual database call
    // Example with Appwrite:
    // const response = await databases.listDocuments(
    //   "your_database_id",
    //   "connected_accounts_collection_id",
    //   [Query.equal("userId", userId), Query.equal("platform", platform)]
    // );
    // return response.documents;

    return []; // Placeholder - return array of connected accounts
  } catch (error) {
    console.error("Failed to get connected accounts:", error);
    return [];
  }
}

async function disconnectAccount(accountId) {
  try {
    // Replace with your actual database call to remove/deactivate account
    // Example with Appwrite:
    // await databases.deleteDocument(
    //   "your_database_id",
    //   "connected_accounts_collection_id",
    //   accountId
    // );

    console.log("Disconnecting account:", accountId);
  } catch (error) {
    console.error("Failed to disconnect account:", error);
    throw error;
  }
}
