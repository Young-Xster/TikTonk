import sahur from "../assets/tungtung.png";
import { useEffect, useState } from "react";

export default function Page1() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const sectionStyle = {
    display: "flex",
    alignItems: "center",
    minHeight: "50vh",
    maxWidth: "1700px",
    padding: "2rem",
  };

  const textContainerStyle = {
    flex: "1",
    paddingRight: "2rem",
    paddingLeft: "15rem",
    // Animation properties
    transform: isLoaded ? "translateY(0)" : "translateY(50px)",
    opacity: isLoaded ? 1 : 0,
    transition: "transform 0.8s ease-out, opacity 0.8s ease-out",
    transitionDelay: "0.2s",
  };

  const headingStyle = {
    fontSize: "5rem", // Increased from 3rem to 5rem
    fontWeight: "bold",
    lineHeight: "1.1", // Slightly tighter line height for better appearance
    margin: 0,
  };

  const greenTextStyle = {
    color: "#059669", // green color
    display: "block",
  };

  const imageContainerStyle = {
    flex: "1",
    textAlign: "center",
    // Animation properties
    transform: isLoaded ? "translateY(0)" : "translateY(50px)",
    opacity: isLoaded ? 1 : 0,
    transition: "transform 0.8s ease-out, opacity 0.8s ease-out",
    transitionDelay: "0.4s",
  };

  const imageStyle = {
    maxWidth: "1000px",
    height: "auto",
  };
  

  return (
    <section className="intro" style={sectionStyle}>
      <div style={textContainerStyle}>
        <h1 style={headingStyle}>
          start <br />
          <span style={greenTextStyle}>Making Content</span> like never before
        </h1>
      </div>
      <div style={imageContainerStyle}>
        <img src={sahur} alt="Content creation" style={imageStyle} />
      </div>
    </section>
  );
}