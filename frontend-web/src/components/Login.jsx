import logo from "../assets/logo.png";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // All your existing styles...
  const sectionStyle = {
    display: "flex",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #ffffff 0%, #000000 100%)",
  };

  const leftSideStyle = {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "0 5rem",
    maxWidth: "600px",
  };

  const logoContainerStyle = {
    display: "flex",
    alignItems: "center",
    marginBottom: "2rem",
    gap: "1rem",
  };

  const logoStyle = {
    width: "120px",
    height: "120px",
  };

  const appNameStyle = {
    fontSize: "4rem",
    fontWeight: "bold",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  };

  const taglineStyle = {
    fontSize: "1.75rem",
    color: "#1c1e21",
    fontWeight: "400",
    lineHeight: "1.34",
    maxWidth: "500px",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  };

  const rightSideStyle = {
    flex: "1",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
  };

  const formStyle = {
    backgroundColor: "#fff",
    padding: "2.5rem",
    borderRadius: "12px",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
    width: "400px",
    maxWidth: "100%",
  };

  const titleStyle = {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#1c1e21",
    marginBottom: "1.5rem",
    textAlign: "center",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid #dddfe2",
    fontSize: "16px",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  };

  const buttonStyle = {
    width: "100%",
    padding: "14px",
    backgroundColor: isLoading ? "#a0a0a0" : "#42b883",
    color: "#fff",
    borderRadius: "8px",
    border: "none",
    cursor: isLoading ? "not-allowed" : "pointer",
    fontSize: "16px",
    fontWeight: "600",
    marginTop: "8px",
    transition: "background-color 0.2s",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  };

  const createAccountButtonStyle = {
    padding: "12px 24px",
    backgroundColor: "#1877f2",
    color: "#fff",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    margin: "0 auto",
    display: "block",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  };

  const forgotPasswordStyle = {
    color: "#1877f2",
    textDecoration: "none",
    fontSize: "14px",
    textAlign: "center",
    display: "block",
    marginTop: "16px",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  };

  const separatorStyle = {
    borderTop: "1px solid #dadde1",
    margin: "20px 0",
  };

  // Error message style
  const errorStyle = {
    color: "#e74c3c",
    fontSize: "14px",
    marginTop: "8px",
    textAlign: "center",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("http://your-backend-url/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Login successful - redirect to user page
        localStorage.setItem("token", data.token); // Store auth token if provided
        window.location.href = "/dashboard"; // Or use React Router: navigate("/dashboard")
      } else {
        // Login failed - show error message
        setError(data.message || "Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    window.location.href = "/signup";
  };

  return (
    <section style={sectionStyle}>
      {/* Left Side - Logo and App Info */}
      <div style={leftSideStyle}>
        <div style={logoContainerStyle}>
          <img src={logo} alt="TikTonik Logo" style={logoStyle} />
          <h1 style={appNameStyle}>TikTonik</h1>
        </div>
        <p style={taglineStyle}>
          TikTonik helps you create and share videos automatically on your
          social media.
        </p>
      </div>

      {/* Right Side - Login Form */}
      <div style={rightSideStyle}>
        <form style={formStyle} onSubmit={handleLogin}>
          <h2 style={titleStyle}>Log in to TikTonik</h2>

          <input
            type="email"
            placeholder="Email address or phone number"
            style={inputStyle}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={(e) => (e.target.style.borderColor = "#1877f2")}
            onBlur={(e) => (e.target.style.borderColor = "#dddfe2")}
            required
          />

          <input
            type="password"
            placeholder="Password"
            style={inputStyle}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={(e) => (e.target.style.borderColor = "#1877f2")}
            onBlur={(e) => (e.target.style.borderColor = "#dddfe2")}
            required
          />

          {error && <div style={errorStyle}>{error}</div>}

          <button
            type="submit"
            style={buttonStyle}
            disabled={isLoading}
            onMouseEnter={(e) =>
              !isLoading && (e.target.style.backgroundColor = "#369870")
            }
            onMouseLeave={(e) =>
              !isLoading && (e.target.style.backgroundColor = "#42b883")
            }
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>

          <a href="#" style={forgotPasswordStyle}>
            Forgotten password?
          </a>

          <div style={separatorStyle}></div>

          <button
            type="button"
            style={createAccountButtonStyle}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#166fe5")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#1877f2")}
            onClick={handleSignUp}
          >
            Create New Account
          </button>
        </form>
      </div>
    </section>
  );
}
