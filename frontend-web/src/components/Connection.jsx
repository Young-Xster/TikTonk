import { useState } from "react";
import tiktokLogo from "../assets/tik-tok.png";
import instagramLogo from "../assets/instagram.png";
import facebookLogo from "../assets/facebook.png";
import youtubeLogo from "../assets/youtube.png";

export default function Connection() {
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigate = (path) => {
    setIsLoading(true);
    window.location.href = path;
  };
  const containerStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
    padding: "4rem 2rem",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    position: "relative",
    overflow: "hidden",
  };

  const overlayStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%)",
    pointerEvents: "none",
  };

  const contentStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    textAlign: "center",
    position: "relative",
    zIndex: 1,
  };

  const titleStyle = {
    fontSize: "3.5rem",
    fontWeight: "700",
    background: "linear-gradient(135deg, #1e293b 0%, #475569 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    marginBottom: "1.5rem",
    letterSpacing: "-0.02em",
    lineHeight: "1.2",
  };

  const subtitleStyle = {
    fontSize: "1.125rem",
    color: "#64748b",
    marginBottom: "4rem",
    fontWeight: "400",
    maxWidth: "600px",
    margin: "0 auto 4rem auto",
    lineHeight: "1.6",
  };
  const gridStyle = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: "2rem",
    maxWidth: "1200px",
    margin: "0 auto",
    flexWrap: "wrap",
  };

  const buttonBaseStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
    padding: "2rem 1.5rem",
    borderRadius: "20px",
    border: "1px solid rgba(255,255,255,0.2)",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "600",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
    transform: "translateY(0)",
    background: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(10px)",
    color: "#374151",
    minWidth: "200px",
    minHeight: "240px",
  };

  const logoStyle = {
    width: "64px",
    height: "64px",
    objectFit: "contain",
  };

  const hoverTransform = {
    transform: "translateY(-8px)",
    boxShadow: "0 16px 48px rgba(0,0,0,0.15)",
    background: "rgba(255,255,255,1)",
  };
  return (
    <div style={containerStyle}>
      <div style={overlayStyle}></div>
      <div style={contentStyle}>
        <h1 style={titleStyle}>Connect Your Accounts</h1>
        <p style={subtitleStyle}>
          Link your social media accounts to start automating your content
          across platforms
        </p>

        <div style={gridStyle}>
          <button
            onClick={() => handleNavigate("/connect/tiktok")}
            style={buttonBaseStyle}
            disabled={isLoading}
            onMouseEnter={(e) => Object.assign(e.target.style, hoverTransform)}
            onMouseLeave={(e) =>
              Object.assign(e.target.style, {
                transform: "translateY(0)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                background: "rgba(255,255,255,0.95)",
              })
            }
          >
            <img src={tiktokLogo} alt="TikTok" style={logoStyle} />
            <span>{isLoading ? "Connecting..." : "TikTok"}</span>
          </button>

          <button
            onClick={() => handleNavigate("/connect/instagram")}
            style={buttonBaseStyle}
            disabled={isLoading}
            onMouseEnter={(e) => Object.assign(e.target.style, hoverTransform)}
            onMouseLeave={(e) =>
              Object.assign(e.target.style, {
                transform: "translateY(0)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                background: "rgba(255,255,255,0.95)",
              })
            }
          >
            <img src={instagramLogo} alt="Instagram" style={logoStyle} />
            <span>{isLoading ? "Connecting..." : "Instagram"}</span>
          </button>

          <button
            onClick={() => handleNavigate("/connect/facebook")}
            style={buttonBaseStyle}
            disabled={isLoading}
            onMouseEnter={(e) => Object.assign(e.target.style, hoverTransform)}
            onMouseLeave={(e) =>
              Object.assign(e.target.style, {
                transform: "translateY(0)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                background: "rgba(255,255,255,0.95)",
              })
            }
          >
            <img src={facebookLogo} alt="Facebook" style={logoStyle} />
            <span>{isLoading ? "Connecting..." : "Facebook"}</span>
          </button>

          <button
            onClick={() => handleNavigate("/connect/youtube")}
            style={buttonBaseStyle}
            disabled={isLoading}
            onMouseEnter={(e) => Object.assign(e.target.style, hoverTransform)}
            onMouseLeave={(e) =>
              Object.assign(e.target.style, {
                transform: "translateY(0)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                background: "rgba(255,255,255,0.95)",
              })
            }
          >
            <img src={youtubeLogo} alt="YouTube" style={logoStyle} />
            <span>{isLoading ? "Connecting..." : "YouTube"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
