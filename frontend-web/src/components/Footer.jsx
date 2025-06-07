import React from "react";
import tiktokLogo from "../assets/tik-tok.png";
import instagramLogo from "../assets/instagram.png";
import facebookLogo from "../assets/facebook.png";
import youtubeLogo from "../assets/youtube.png";

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#2a2a2a",
        color: "#ffffff",
        padding: "40px 0 20px",
        marginTop: "auto",
        borderTop: "1px solid #404040",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px",
        }}
      >
        {/* Main Content - Single Row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "40px",
            marginBottom: "40px",
          }}
        >
          {/* Company Info */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            <h3
              style={{
                color: "#00ff88",
                marginBottom: "15px",
                fontSize: "28px",
                fontWeight: "bold",
                textShadow: "0 2px 4px rgba(0, 255, 136, 0.3)",
              }}
            >
              TikTonik
            </h3>
            <p
              style={{
                color: "#e0e0e0",
                lineHeight: "1.7",
                marginBottom: "25px",
                fontSize: "15px",
              }}
            >
              Automate your social media presence across multiple platforms.
              Connect, schedule, and grow your audience with our powerful
              automation tools.
            </p>

            {/* Social Media Links with Real Logos */}
            <div
              style={{
                display: "flex",
                gap: "15px",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  color: "#e0e0e0",
                  fontSize: "15px",
                  fontWeight: "600",
                  marginRight: "10px",
                }}
              >
                Follow us:
              </span>
              <a
                href="#"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  transition: "all 0.3s ease",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "rgba(0, 255, 136, 0.2)";
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                <img
                  src={tiktokLogo}
                  alt="TikTok"
                  style={{ width: "24px", height: "24px" }}
                />
              </a>
              <a
                href="#"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  transition: "all 0.3s ease",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "rgba(0, 255, 136, 0.2)";
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                <img
                  src={instagramLogo}
                  alt="Instagram"
                  style={{ width: "24px", height: "24px" }}
                />
              </a>
              <a
                href="#"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  transition: "all 0.3s ease",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "rgba(0, 255, 136, 0.2)";
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                <img
                  src={facebookLogo}
                  alt="Facebook"
                  style={{ width: "24px", height: "24px" }}
                />
              </a>
              <a
                href="#"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  transition: "all 0.3s ease",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "rgba(0, 255, 136, 0.2)";
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                <img
                  src={youtubeLogo}
                  alt="YouTube"
                  style={{ width: "24px", height: "24px" }}
                />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div style={{ flex: "0 0 140px" }}>
            <h4
              style={{
                color: "#ffffff",
                marginBottom: "20px",
                fontSize: "18px",
                fontWeight: "700",
              }}
            >
              Quick Links
            </h4>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
              }}
            >
              {[
                "Dashboard",
                "Connections",
                "Analytics",
                "Settings",
                "Help",
              ].map((link) => (
                <li key={link} style={{ marginBottom: "12px" }}>
                  <a
                    href="#"
                    style={{
                      color: "#d0d0d0",
                      textDecoration: "none",
                      fontSize: "15px",
                      transition: "color 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.target.style.color = "#00ff88")}
                    onMouseLeave={(e) => (e.target.style.color = "#d0d0d0")}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div style={{ flex: "0 0 140px" }}>
            <h4
              style={{
                color: "#ffffff",
                marginBottom: "20px",
                fontSize: "18px",
                fontWeight: "700",
              }}
            >
              Support
            </h4>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
              }}
            >
              {[
                "Contact Us",
                "FAQ",
                "Privacy Policy",
                "Terms of Service",
                "Documentation",
              ].map((link) => (
                <li key={link} style={{ marginBottom: "12px" }}>
                  <a
                    href="#"
                    style={{
                      color: "#d0d0d0",
                      textDecoration: "none",
                      fontSize: "15px",
                      transition: "color 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.target.style.color = "#00ff88")}
                    onMouseLeave={(e) => (e.target.style.color = "#d0d0d0")}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            <h4
              style={{
                color: "#ffffff",
                marginBottom: "15px",
                fontSize: "18px",
                fontWeight: "700",
              }}
            >
              Stay Updated
            </h4>
            <p
              style={{
                color: "#d0d0d0",
                fontSize: "15px",
                marginBottom: "20px",
                lineHeight: "1.5",
              }}
            >
              Get the latest updates and features delivered to your inbox.
            </p>
            <div style={{ display: "flex", marginBottom: "10px" }}>
              <input
                type="email"
                placeholder="Enter your email"
                style={{
                  flex: "1",
                  padding: "12px 16px",
                  border: "1px solid #333",
                  backgroundColor: "#1a1a1a",
                  color: "#ffffff",
                  borderRadius: "8px 0 0 8px",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
              <button
                style={{
                  padding: "12px 20px",
                  backgroundColor: "#00ff88",
                  color: "#000000",
                  border: "none",
                  borderRadius: "0 8px 8px 0",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "bold",
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#00cc6a")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#00ff88")
                }
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: "1px solid #2a2a2a",
            paddingTop: "25px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "15px",
          }}
        >
          {" "}
          <p
            style={{
              color: "#999999",
              fontSize: "14px",
              margin: 0,
            }}
          >
            © {new Date().getFullYear()} TikTonik. All rights reserved.
          </p>
          <p
            style={{
              color: "#999999",
              fontSize: "14px",
              margin: 0,
            }}
          >
            Made with ❤️ for content creators
          </p>
        </div>
      </div>
    </footer>
  );
}
