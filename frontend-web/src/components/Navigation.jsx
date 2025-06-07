import React, { useEffect, useRef } from "react";
import logo from "../assets/logo.png";
import { useUser } from "../context/UserContext.jsx";
import userIcon from "../assets/user.png";

export default function Navigation() {
  const navRef = useRef(null);
  const { currentUser, isLoading } = useUser();

  const parentStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(9, 1fr)",
    gridColumnGap: 0,
    gridRowGap: 0,
    borderBottom: "1px solid #000",
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    backgroundColor: "#fff",
    zIndex: 1000,
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

  const linkStyle = {
    color: "#374151",
    textDecoration: "none",
    transition: "color 0.2s",
    fontSize: "1.2rem",
    cursor: "pointer",
  };
  const loginButtonStyle = {
    padding: "12px 24px",
    color: "#374151",
    backgroundColor: "#fff",
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
    color: "#fff",
    backgroundColor: "#059669",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 500,
    transition: "background-color 0.2s",
    whiteSpace: "nowrap",
    minWidth: "fit-content",
    fontSize: "1rem",
  };
  const iconButtonStyle = {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "1.5rem",
    color: "#374151",
  };

  const userIconStyle = {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    objectFit: "cover",
  };

  useEffect(() => {
    const navElement = navRef.current;
    if (!navElement) return;
    const setBodyPadding = () => {
      const h = navElement.offsetHeight;
      if (h > 0) document.body.style.paddingTop = `${h}px`;
    };
    setBodyPadding();
    window.addEventListener("resize", setBodyPadding);
    return () => {
      document.body.style.paddingTop = "0";
      window.removeEventListener("resize", setBodyPadding);
    };
  }, []);

  const handleSmoothScroll = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el || !navRef.current) return;
    const top =
      el.getBoundingClientRect().top +
      window.pageYOffset -
      navRef.current.offsetHeight;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <nav ref={navRef}>
      <div style={parentStyle}>
        <div style={div1Style}>
          <img
            style={{ marginLeft: "100px", width: 79, height: 79 }}
            src={logo}
            alt="logo"
          />
          <h2 style={{ fontWeight: "bold" }}>TikTonik</h2>
        </div>
        <div style={div2Style}>
          <a
            href="#explanation"
            style={linkStyle}
            onClick={(e) => handleSmoothScroll(e, "explanation")}
          >
            Features
          </a>
        </div>
        <div style={div3Style}>
          <a
            href="#pricing"
            style={linkStyle}
            onClick={(e) => handleSmoothScroll(e, "pricing")}
          >
            Pricing
          </a>
        </div>
        <div style={div4Style}>
          <a
            href="#sources"
            style={linkStyle}
            onClick={(e) => handleSmoothScroll(e, "sources")}
          >
            Sources
          </a>
        </div>
        <div style={div5Style}>
          <a
            href="#contact"
            style={linkStyle}
            onClick={(e) => handleSmoothScroll(e, "contact")}
          >
            Contact Us
          </a>
        </div>

        {!isLoading && !currentUser && (
          <>
            <div style={div6Style}>
              <button
                style={loginButtonStyle}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#f9fafb")
                }
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#fff")}
                onClick={() => (window.location.href = "/login")}
              >
                Log In
              </button>
            </div>
            <div style={div7Style}>
              <button
                style={signupButtonStyle}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#047857")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#059669")
                }
                onClick={() => (window.location.href = "/signup")}
              >
                Sign Up
              </button>
            </div>
          </>
        )}

        {!isLoading && currentUser && (
          <div style={div7Style}>
            <button
              style={iconButtonStyle}
              title="Profile"
              onClick={() => (window.location.href = "/dashboard")}
            >
              <img src={userIcon} alt="User Icon" style={userIconStyle} />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
