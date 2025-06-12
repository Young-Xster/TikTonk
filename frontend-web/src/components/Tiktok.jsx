import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext.jsx";
import tiktokLogo from "../assets/tik-tok.png";

export default function TikTok() {
  const { currentUser, userDoc } = useUser();
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchConnectedAccounts();
  }, [currentUser]);

  const fetchConnectedAccounts = async () => {
    if (!currentUser) return;

    try {
      // Fetch user's connected TikTok accounts from your database
      const accounts = await getConnectedAccounts(currentUser.$id, "tiktok");
      setConnectedAccounts(accounts);
    } catch (error) {
      console.error("Failed to fetch connected accounts:", error);
    }
  };

  const handleConnectTikTok = () => {
    if (!userDoc?.Premium && connectedAccounts.length >= 1) {
      alert("Premium required to connect multiple accounts");
      return;
    }

    if (connectedAccounts.length >= 5) {
      alert("Maximum 5 accounts allowed per platform");
      return;
    }

    // Redirect to TikTok OAuth
    const clientId = import.meta.env.VITE_TIKTOK_CLIENT_ID;
    const redirectUri = encodeURIComponent(
      `${window.location.origin}/auth/tiktok/callback`
    );
    const scope = encodeURIComponent("user.info.basic,video.upload");
    const state = encodeURIComponent(
      JSON.stringify({ userId: currentUser.$id })
    );

    const authUrl = `https://www.tiktok.com/auth/authorize/?client_key=${clientId}&scope=${scope}&response_type=code&redirect_uri=${redirectUri}&state=${state}`;

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

  // ... styles remain the same ...

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>
            <img
              src={tiktokLogo}
              alt="TikTok"
              style={{ width: "40px", height: "40px" }}
            />
            Connect TikTok
          </h1>
          <p style={subtitleStyle}>
            Connect your TikTok accounts to start automating your content
          </p>
          <div style={statusBadgeStyle}>
            {userDoc?.Premium
              ? "Premium Member"
              : "Premium Required for multiple accounts"}
          </div>
        </div>

        {/* Connected Accounts */}
        <div style={{ marginBottom: "2rem" }}>
          <h3>Connected Accounts ({connectedAccounts.length}/5)</h3>
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
                  <strong>{account.accountName}</strong>
                  <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
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
                    cursor: "pointer",
                  }}
                >
                  Disconnect
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Connect New Account Button */}
        <button
          onClick={handleConnectTikTok}
          disabled={
            isLoading ||
            (!userDoc?.Premium && connectedAccounts.length >= 1) ||
            connectedAccounts.length >= 5
          }
          style={connectButtonStyle}
        >
          {connectedAccounts.length >= 5
            ? "Maximum accounts reached (5/5)"
            : !userDoc?.Premium && connectedAccounts.length >= 1
            ? "Premium required for more accounts"
            : `+ Connect TikTok Account (${connectedAccounts.length}/5)`}
        </button>
      </div>
    </div>
  );
}
