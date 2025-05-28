import logo from "../assets/logo.png";

export default function Navigation() {
  const parentStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(9, 1fr)",
    gridColumnGap: "0px",
    gridRowGap: "0px",
    borderBottom: "1px solid #000000",
  };

  const div1Style = {
    gridArea: "1 / 1 / 2 / 2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    marginRight: "100px",
  };
  const div2Style = {
    gridArea: "1 / 2 / 2 / 3",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
  const div3Style = {
    gridArea: "1 / 3 / 2 / 4",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
  const div4Style = {
    gridArea: "1 / 4 / 2 / 5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
  const div5Style = {
    gridArea: "1 / 5 / 2 / 6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
  const div6Style = {
    gridArea: "1 / 8 / 2 / 9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "50px",
  };
  const div7Style = {
    gridArea: "1 / 9 / 2 / 10",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "100px",
  };

  // Inline styles as fallback
  const linkStyle = {
    color: "#374151", // gray-700
    textDecoration: "none",
    transition: "color 0.2s",
    fontSize: "1.2rem",
  };

  const loginButtonStyle = {
    padding: "12px 24px",
    color: "#374151",
    backgroundColor: "white",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.2s",
    whiteSpace: "nowrap",
    minWidth: "fit-content",
    fontSize: "1rem",
  };

  const signupButtonStyle = {
    padding: "12px 24px",
    color: "white",
    backgroundColor: "#059669",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "background-color 0.2s",
    whiteSpace: "nowrap",
    minWidth: "fit-content",
    fontSize: "1rem",
  };

  const handleLogin = () => {
    window.location.href = "/login";
  };
  const handleSignup = () => {
    window.location.href = "/signup";
  };

  return (
    <nav>
      <div style={parentStyle}>
        <div style={div1Style}>
          <img
            style={{ marginLeft: "100px", width: "79px", height: "79px" }}
            src={logo}
            alt="logo"
          />
          <h2 style={{ fontWeight: "bold" }}>TikTonik</h2>
        </div>
        <div style={div2Style}>
          <a href="#" style={linkStyle}>
            Features
          </a>
        </div>
        <div style={div3Style}>
          <a href="#" style={linkStyle}>
            Pricing
          </a>
        </div>
        <div style={div4Style}>
          <a href="#" style={linkStyle}>
            Sources
          </a>
        </div>
        <div style={div5Style}>
          <a href="#" style={linkStyle}>
            Contact Us
          </a>
        </div>
        <div style={div6Style}>
          <button
            style={loginButtonStyle}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#f9fafb")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "white")}
            onClick={handleLogin}
          >
            Log In
          </button>
        </div>
        <div style={div7Style}>
          <button
            style={signupButtonStyle}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#047857")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#059669")}
            onClick={handleSignup}
          >
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
}
