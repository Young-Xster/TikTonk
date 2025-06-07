import { useState } from "react";
import { useUser } from "../context/UserContext.jsx";
import youtubeLogo from "../assets/youtube.png";

export default function Youtube() {
  const { currentUser, isLoading, userDoc } = useUser();
  const [accounts, setAccounts] = useState([]);
  const [primaryAccount, setPrimaryAccount] = useState({
    email: "",
    password: "",
  });
  const handleAdd = () => {
    if (!userDoc?.Premium || accounts.length >= 4) return;
    setAccounts((prev) => [...prev, { email: "", password: "" }]);
  };

  const handleAccountChange = (index, field) => (e) => {
    const updated = [...accounts];
    updated[index][field] = e.target.value;
    setAccounts(updated);
  };

  const handlePrimaryAccountChange = (field) => (e) => {
    setPrimaryAccount((prev) => ({ ...prev, [field]: e.target.value }));
  };

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
    background: "black",
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

  const formGroupStyle = {
    marginBottom: "2rem",
  };

  const labelStyle = {
    display: "block",
    fontSize: "1rem",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "0.5rem",
  };

  const inputStyle = {
    width: "100%",
    padding: "0.875rem 1rem",
    border: "2px solid #e5e7eb",
    borderRadius: "12px",
    fontSize: "1rem",
    transition: "all 0.3s ease",
    background: "#ffffff",
    outline: "none",
    boxSizing: "border-box",
  };

  const inputFocusStyle = {
    borderColor: "#667eea",
    boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
  };

  const accountCardStyle = {
    background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
    border: "2px solid #e5e7eb",
    borderRadius: "16px",
    padding: "1.5rem",
    marginTop: "1rem",
    position: "relative",
  };

  const accountNumberStyle = {
    position: "absolute",
    top: "-12px",
    left: "20px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#ffffff",
    padding: "0.25rem 0.75rem",
    borderRadius: "12px",
    fontSize: "0.75rem",
    fontWeight: "700",
  };

  const buttonStyle = {
    width: "100%",
    padding: "1rem 1.5rem",
    borderRadius: "12px",
    border: "none",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: userDoc?.Premium && accounts.length < 4 ? "pointer" : "not-allowed",
    transition: "all 0.3s ease",
    marginTop: "1.5rem",
    background:
      userDoc?.Premium && accounts.length < 4
        ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        : "#9ca3af",
    color: "#ffffff",
    transform: "translateY(0)",
  };

  const connectButtonStyle = {
    width: "100%",
    padding: "1rem 1.5rem",
    borderRadius: "12px",
    border: "none",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginTop: "2rem",
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    color: "#ffffff",
    transform: "translateY(0)",
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>
            <img
              src={youtubeLogo}
              alt="YouTube"
              style={{ width: "40px", height: "40px" }}
            />
            Connect YouTube
          </h1>
          <p style={subtitleStyle}>
            Connect your YouTube account to start automating your content
          </p>{" "}
          <div style={statusBadgeStyle}>
            {userDoc?.Premium
              ? "Premium Member"
              : "Premium Required to add more accounts"}
          </div>
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Primary Account Email</label>
          <input
            type="email"
            placeholder="Enter your YouTube email"
            value={primaryAccount.email}
            onChange={handlePrimaryAccountChange("email")}
            style={inputStyle}
            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
            onBlur={(e) =>
              Object.assign(e.target.style, {
                borderColor: "#e5e7eb",
                boxShadow: "none",
              })
            }
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Primary Account Password</label>
          <input
            type="password"
            placeholder="Enter your YouTube password"
            value={primaryAccount.password}
            onChange={handlePrimaryAccountChange("password")}
            style={inputStyle}
            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
            onBlur={(e) =>
              Object.assign(e.target.style, {
                borderColor: "#e5e7eb",
                boxShadow: "none",
              })
            }
          />
        </div>

        {accounts.map((acc, idx) => (
          <div key={idx} style={accountCardStyle}>
            <div style={accountNumberStyle}>Account {idx + 2}</div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                placeholder="Enter email for additional account"
                value={acc.email}
                onChange={handleAccountChange(idx, "email")}
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) =>
                  Object.assign(e.target.style, {
                    borderColor: "#e5e7eb",
                    boxShadow: "none",
                  })
                }
              />
            </div>

            <div>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                placeholder="Enter password for additional account"
                value={acc.password}
                onChange={handleAccountChange(idx, "password")}
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) =>
                  Object.assign(e.target.style, {
                    borderColor: "#e5e7eb",
                    boxShadow: "none",
                  })
                }
              />
            </div>
          </div>
        ))}

        <button
          onClick={handleAdd}
          disabled={isLoading || !userDoc?.Premium || accounts.length >= 4}
          style={buttonStyle}
          onMouseEnter={(e) => {
            if (userDoc?.Premium && accounts.length < 4) {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 10px 20px rgba(102, 126, 234, 0.3)";
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "none";
          }}
        >
          {userDoc?.Premium
            ? accounts.length < 4
              ? `+ Add Account ${accounts.length + 2} (${
                  4 - accounts.length
                } remaining)`
              : "Maximum accounts reached (4/4)"
            : "Add more accounts"}
        </button>

        <button
          style={connectButtonStyle}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 10px 20px rgba(16, 185, 129, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "none";
          }}
        >
          Connect All Accounts
        </button>
      </div>
    </div>
  );
}
