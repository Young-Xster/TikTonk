import { useState } from "react";
import Minecraft from "../assets/Minecraft.png";
import Satisfying from "../assets/Satisfying.jpg";
import Subway from "../assets/SubwaySurfers.jpg";
import Tiktok from "../assets/tik-tok.png";
import Youtube from "../assets/youtube.png";
import Instagram from "../assets/instagram.png";
import facebook from "../assets/facebook.png";
import Anime from "../assets/anime.png";
import Movies from "../assets/Movies.png";
import Novels from "../assets/Novels.png";
import Podcast from "../assets/podcast.png";
import Reddit from "../assets/reddit.png";
import Logo from "../assets/logo.png";
import UserLogo from "../assets/user.png";
import Scheduler from "./Scheduler.jsx";
import { useUser } from "../context/UserContext.jsx";

export default function Create() {
  const [selectedBackground, setSelectedBackground] = useState(null);
  const [selectedSource, setSelectedSource] = useState(null);
  const [selectedQuality, setSelectedQuality] = useState("720p");
  const [selectedDuration, setSelectedDuration] = useState(3);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [backgroundScrollIndex, setBackgroundScrollIndex] = useState(0);
  const [sourceScrollIndex, setSourceScrollIndex] = useState(0);
  const [errors, setErrors] = useState({});
  const [selectedDates, setSelectedDates] = useState([]);
  const { currentUser, isLoading, userDoc } = useUser();

  const answers = {
    selectedBg: selectedBackground,
    selectedSource: selectedSource,
    selectedQuality: selectedQuality,
    selectedDuration: selectedDuration,
    selectedPlatforms: selectedPlatforms,
    selectedDates: selectedDates,
    backgroundScrollIndex: backgroundScrollIndex,
    sourceScrollIndex: sourceScrollIndex,
  };

  const backgroundOptions = [
    {
      id: "minecraft",
      image: Minecraft,
      label: "Minecraft",
      description: "High-energy Minecraft content",
    },
    {
      id: "subway",
      image: Subway,
      label: "Subway Surfers",
      description: "Calming subway surfers gameplay",
    },
    {
      id: "satisfying",
      image: Satisfying,
      label: "Satisfying",
      description: "Oddly satisfying visuals",
    },
  ];

  const sourceOptions = [
    {
      id: "anime",
      image: Anime,
      label: "Anime",
      description: "Anime stories and content",
    },
    {
      id: "movies",
      image: Movies,
      label: "Movies",
      description: "Movie reviews and scenes",
    },
    {
      id: "novels",
      image: Novels,
      label: "Novels",
      description: "Book summaries and stories",
    },
    {
      id: "podcast",
      image: Podcast,
      label: "Podcast",
      description: "Podcast highlights",
    },
    {
      id: "reddit",
      image: Reddit,
      label: "Reddit",
      description: "Reddit stories and threads",
    },
  ];

  const qualityOptions = [
    { value: "360p", label: "360p", premium: false },
    { value: "480p", label: "480p", premium: false },
    { value: "720p", label: "720p", premium: false },
    { value: "1080p", label: "1080p", premium: true },
  ];

  const platforms = [
    { id: "tiktok", image: Tiktok, label: "TikTok" },
    { id: "instagram", image: Instagram, label: "Instagram" },
    { id: "youtube", image: Youtube, label: "YouTube" },
    { id: "facebook", image: facebook, label: "Facebook" },
  ];

  const togglePlatform = (platformId) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((id) => id !== platformId)
        : [...prev, platformId]
    );
    if (errors.platforms) {
      setErrors((prev) => ({ ...prev, platforms: null }));
    }
  };

  const validateSelections = () => {
    const newErrors = {};
    if (!selectedBackground)
      newErrors.background = "Please select a background";
    if (!selectedSource) newErrors.source = "Please select a source";
    if (selectedPlatforms.length === 0)
      newErrors.platforms = "Please select at least one platform";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerate = () => {
    if (validateSelections()) {
      const userSelections = {
        background: selectedBackground,
        source: selectedSource,
        quality: selectedQuality,
        duration: selectedDuration,
        platforms: selectedPlatforms,
        scheduledDates: selectedDates,
        timestamp: new Date().toISOString(),
      };

      console.log("User Selections:", userSelections);
      console.log("Answers Object:", answers);

      // Here you can send userSelections to your backend
      // Example: await sendToBackend(userSelections);

      alert("Content generation started! Check console for selections.");
    }
  };

  const scrollCarousel = (direction, type) => {
    if (type === "background") {
      const newIndex =
        direction === "left"
          ? Math.max(0, backgroundScrollIndex - 1)
          : Math.min(backgroundOptions.length - 1, backgroundScrollIndex + 1);
      setBackgroundScrollIndex(newIndex);
    } else {
      const newIndex =
        direction === "left"
          ? Math.max(0, sourceScrollIndex - 1)
          : Math.min(sourceOptions.length - 1, sourceScrollIndex + 1);
      setSourceScrollIndex(newIndex);
    }
  };

  // Styles
  const containerStyle = {
    minHeight: "100vh",
    background: "#ffffff",
    color: "#333333",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    padding: "0", // Removed padding to avoid double padding with nav
  };

  const navigationStyle = {
    background: "#ffffff",
    borderBottom: "1px solid #e9ecef",
    padding: "1rem 0",
    marginBottom: "3rem",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  };

  const navContentStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 2rem",
  };

  const logoSectionStyle = {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    cursor: "pointer",
  };

  const logoStyle = {
    width: "40px",
    height: "40px",
    borderRadius: "8px",
    objectFit: "contain",
  };

  const titleStyle = {
    fontSize: "1.8rem",
    fontWeight: "700",
    background: "linear-gradient(135deg, #ff0050 0%, #ff6b35 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    margin: 0,
  };

  const navActionsStyle = {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  };

  const backButtonStyle = {
    background: "#f8f9fa",
    border: "1px solid #e9ecef",
    borderRadius: "8px",
    padding: "0.5rem 1rem",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#374151",
    transition: "all 0.2s ease",
  };

  const userLogoStyle = {
    width: "36px",
    height: "36px",
    cursor: "pointer",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #e9ecef",
  };

  const contentStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 2rem",
  };

  const sectionStyle = {
    marginBottom: "3rem",
  };

  const sectionTitleStyle = (hasError) => ({
    fontSize: "1.5rem",
    fontWeight: "600",
    color: hasError ? "#ff0050" : "#333333",
    marginBottom: "1rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  });

  const requiredIndicatorStyle = {
    color: "#ff0050",
    fontSize: "1.2rem",
    fontWeight: "bold",
  };

  const errorMessageStyle = {
    color: "#ff0050",
    fontSize: "0.875rem",
    marginBottom: "1rem",
    fontWeight: "500",
  };

  const carouselContainerStyle = {
    position: "relative",
    overflow: "hidden",
    borderRadius: "20px",
    background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
    padding: "2rem",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    margin: "0 auto",
  };

  const carouselWrapperStyle = {
    display: "flex",
    alignItems: "center",
    gap: "2rem",
    justifyContent: "center",
  };

  const carouselContentStyle = {
    flex: 1,
    overflow: "hidden",
    position: "relative",
    display: "flex",
    justifyContent: "center",
  };
  const carouselTrackStyle = (index, total) => ({
    display: "flex",
    transform: `translateX(calc(-${index * 320}px + 50%))`,
    transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
    width: `${total * 320}px`,
    justifyContent: "flex-start",
    marginLeft: "-150px", // Half of item width to center
  });

  const carouselItemStyle = (isSelected, index, currentIndex, total) => {
    const distance = Math.abs(index - currentIndex);
    const isCenter = index === currentIndex;
    const opacity = isCenter ? 1 : distance === 1 ? 0.6 : 0.3;
    const scale = isCenter ? 1 : distance === 1 ? 0.8 : 0.6;

    return {
      width: "300px",
      margin: "0 10px",
      transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
      opacity,
      transform: `scale(${scale})`,
      zIndex: isCenter ? 10 : distance === 1 ? 5 : 1,
    };
  };

  const cardStyle = (isSelected) => ({
    background: "#ffffff",
    borderRadius: "16px",
    overflow: "hidden",
    cursor: "pointer",
    border: isSelected ? "3px solid #ff0050" : "3px solid transparent",
    transition: "all 0.3s ease",
    boxShadow: isSelected
      ? "0 15px 40px rgba(255, 0, 80, 0.3)"
      : "0 8px 25px rgba(0, 0, 0, 0.1)",
    position: "relative",
    height: "300px",
    display: "flex",
    flexDirection: "column",
    width: "100%",
  });

  const cardImageStyle = {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    objectPosition: "center",
    backgroundColor: "#f8f9fa",
    imageRendering: "crisp-edges",
    WebkitImageRendering: "crisp-edges",
    MozImageRendering: "crisp-edges",
  };

  const cardContentStyle = {
    padding: "1rem",
    textAlign: "center",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  };

  const cardTitleStyle = {
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "#333333",
    marginBottom: "0.5rem",
    lineHeight: "1.3",
  };

  const cardDescriptionStyle = {
    fontSize: "0.85rem",
    color: "#666666",
    lineHeight: "1.4",
    margin: "0",
  };

  const selectedBadgeStyle = {
    position: "absolute",
    top: "1rem",
    right: "1rem",
    background: "linear-gradient(135deg, #ff0050 0%, #ff6b35 100%)",
    color: "#ffffff",
    padding: "0.5rem",
    borderRadius: "50%",
    width: "2rem",
    height: "2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1rem",
    fontWeight: "bold",
    zIndex: 20,
  };

  const navigationButtonStyle = (disabled) => ({
    background: disabled
      ? "rgba(0, 0, 0, 0.1)"
      : "linear-gradient(135deg, #ff0050 0%, #ff6b35 100%)",
    color: disabled ? "#999999" : "#ffffff",
    border: "none",
    borderRadius: "50%",
    width: "3rem",
    height: "3rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: disabled ? "not-allowed" : "pointer",
    fontSize: "1.2rem",
    fontWeight: "bold",
    transition: "all 0.3s ease",
    opacity: disabled ? 0.5 : 1,
    flexShrink: 0,
  });

  const qualityContainerStyle = {
    display: "flex",
    gap: "1rem",
    flexWrap: "wrap",
    justifyContent: "center",
  };

  const qualityButtonStyle = (isSelected, isPremium) => ({
    padding: "1rem 2rem",
    borderRadius: "25px",
    border: isSelected ? "2px solid #ff0050" : "2px solid #e0e0e0",
    background: isSelected ? "#ff0050" : "#ffffff",
    color: isSelected ? "#ffffff" : isPremium ? "#ffa500" : "#333333",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "600",
    transition: "all 0.3s ease",
    position: "relative",
    minWidth: "100px",
  });

  const premiumBadgeStyle = {
    position: "absolute",
    top: "-8px",
    right: "-8px",
    background: "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)",
    color: "#000000",
    fontSize: "0.6rem",
    padding: "0.2rem 0.4rem",
    borderRadius: "10px",
    fontWeight: "bold",
  };

  const durationContainerStyle = {
    background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
    borderRadius: "20px",
    padding: "2rem",
    textAlign: "center",
    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
  };

  const durationSliderStyle = {
    width: "100%",
    height: "8px",
    borderRadius: "4px",
    background: "#e0e0e0",
    outline: "none",
    WebkitAppearance: "none",
    cursor: "pointer",
    margin: "1rem 0",
  };

  const durationValueStyle = {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#ff0050",
    marginBottom: "1rem",
  };

  const platformsContainerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "1.5rem",
    maxWidth: "700px",
    margin: "0 auto",
  };

  const platformItemStyle = (isSelected) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "2rem 1rem",
    borderRadius: "20px",
    border: isSelected ? "3px solid #ff0050" : "3px solid #e0e0e0",
    background: isSelected ? "rgba(255, 0, 80, 0.05)" : "#ffffff",
    cursor: "pointer",
    transition: "all 0.3s ease",
    transform: isSelected ? "scale(1.05)" : "scale(1)",
    boxShadow: isSelected
      ? "0 10px 30px rgba(255, 0, 80, 0.2)"
      : "0 5px 15px rgba(0, 0, 0, 0.1)",
  });

  const platformImageStyle = {
    width: "56px",
    height: "56px",
    marginBottom: "1rem",
    objectFit: "contain",
    imageRendering: "crisp-edges",
    WebkitImageRendering: "crisp-edges",
    MozImageRendering: "crisp-edges",
  };

  const platformLabelStyle = {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#333333",
  };

  const generateButtonStyle = {
    width: "100%",
    maxWidth: "400px",
    margin: "4rem auto 0",
    display: "block",
    padding: "1.5rem 2rem",
    borderRadius: "25px",
    border: "none",
    background: "linear-gradient(135deg, #ff0050 0%, #ff6b35 100%)",
    color: "#ffffff",
    fontSize: "1.2rem",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s ease",
    transform: "translateY(0)",
    boxShadow: "0 8px 25px rgba(255, 0, 80, 0.3)",
  };

  return (
    <div style={containerStyle}>
      {/* Navigation */}
      <nav style={navigationStyle}>
        <div style={navContentStyle}>
          <div
            style={logoSectionStyle}
            onClick={() => (window.location.href = "/dashboard")}
          >
            <img src={Logo} alt="TikTonik" style={logoStyle} />
            <h1 style={titleStyle}>TikTonik</h1>
          </div>

          <div style={navActionsStyle}>
            <button
              style={backButtonStyle}
              onClick={() => (window.location.href = "/dashboard")}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#e9ecef";
                e.target.style.borderColor = "#dee2e6";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#f8f9fa";
                e.target.style.borderColor = "#e9ecef";
              }}
            >
              ← Back to Dashboard
            </button>
            <img
              src={UserLogo}
              alt="User"
              style={userLogoStyle}
              onClick={() => (window.location.href = "/dashboard")}
            />
          </div>
        </div>
      </nav>

      <section style={contentStyle}>
        {/* Background Section */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle(errors.background)}>
            Background <span style={requiredIndicatorStyle}>*</span>
          </h2>
          {errors.background && (
            <div style={errorMessageStyle}>{errors.background}</div>
          )}

          <div style={carouselContainerStyle}>
            <div style={carouselWrapperStyle}>
              <button
                style={navigationButtonStyle(backgroundScrollIndex === 0)}
                onClick={() => scrollCarousel("left", "background")}
                disabled={backgroundScrollIndex === 0}
              >
                ‹
              </button>

              <div style={carouselContentStyle}>
                <div
                  style={carouselTrackStyle(
                    backgroundScrollIndex,
                    backgroundOptions.length
                  )}
                >
                  {backgroundOptions.map((option, index) => (
                    <div
                      key={option.id}
                      style={carouselItemStyle(
                        selectedBackground === option.id,
                        index,
                        backgroundScrollIndex,
                        backgroundOptions.length
                      )}
                    >
                      <div
                        style={cardStyle(selectedBackground === option.id)}
                        onClick={() => {
                          setSelectedBackground(option.id);
                          if (errors.background) {
                            setErrors((prev) => ({
                              ...prev,
                              background: null,
                            }));
                          }
                        }}
                      >
                        {selectedBackground === option.id && (
                          <div style={selectedBadgeStyle}>✓</div>
                        )}
                        <img
                          src={option.image}
                          alt={option.label}
                          style={cardImageStyle}
                        />
                        <div style={cardContentStyle}>
                          <h3 style={cardTitleStyle}>{option.label}</h3>
                          <p style={cardDescriptionStyle}>
                            {option.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                style={navigationButtonStyle(
                  backgroundScrollIndex === backgroundOptions.length - 1
                )}
                onClick={() => scrollCarousel("right", "background")}
                disabled={
                  backgroundScrollIndex === backgroundOptions.length - 1
                }
              >
                ›
              </button>
            </div>
          </div>
        </div>
        {/* Source Section */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle(errors.source)}>
            Source <span style={requiredIndicatorStyle}>*</span>
          </h2>
          {errors.source && (
            <div style={errorMessageStyle}>{errors.source}</div>
          )}

          <div style={carouselContainerStyle}>
            <div style={carouselWrapperStyle}>
              <button
                style={navigationButtonStyle(sourceScrollIndex === 0)}
                onClick={() => scrollCarousel("left", "source")}
                disabled={sourceScrollIndex === 0}
              >
                ‹
              </button>

              <div style={carouselContentStyle}>
                <div
                  style={carouselTrackStyle(
                    sourceScrollIndex,
                    sourceOptions.length
                  )}
                >
                  {sourceOptions.map((option, index) => (
                    <div
                      key={option.id}
                      style={carouselItemStyle(
                        selectedSource === option.id,
                        index,
                        sourceScrollIndex,
                        sourceOptions.length
                      )}
                    >
                      <div
                        style={cardStyle(selectedSource === option.id)}
                        onClick={() => {
                          setSelectedSource(option.id);
                          if (errors.source) {
                            setErrors((prev) => ({ ...prev, source: null }));
                          }
                        }}
                      >
                        {selectedSource === option.id && (
                          <div style={selectedBadgeStyle}>✓</div>
                        )}
                        <img
                          src={option.image}
                          alt={option.label}
                          style={cardImageStyle}
                        />
                        <div style={cardContentStyle}>
                          <h3 style={cardTitleStyle}>{option.label}</h3>
                          <p style={cardDescriptionStyle}>
                            {option.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                style={navigationButtonStyle(
                  sourceScrollIndex === sourceOptions.length - 1
                )}
                onClick={() => scrollCarousel("right", "source")}
                disabled={sourceScrollIndex === sourceOptions.length - 1}
              >
                ›
              </button>
            </div>
          </div>
        </div>
        {/* Quality Section */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle()}>Quality</h2>
          <div style={qualityContainerStyle}>
            {qualityOptions.map((option) => {
              const isDisabled = option.premium && !userDoc?.Premium;
              return (
                <button
                  key={option.value}
                  style={qualityButtonStyle(
                    selectedQuality === option.value,
                    option.premium,
                    isDisabled
                  )}
                  disabled={isDisabled}
                  onClick={() => {
                    if (!isDisabled) {
                      setSelectedQuality(option.value);
                    } else {
                      alert(
                        "This quality is only available for Premium users. Upgrade to unlock!"
                      );
                    }
                  }}
                  onMouseEnter={(e) => {
                    if (selectedQuality !== option.value && !isDisabled) {
                      e.target.style.borderColor = "#ff0050";
                      e.target.style.transform = "translateY(-2px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedQuality !== option.value && !isDisabled) {
                      e.target.style.borderColor = "#e0e0e0";
                      e.target.style.transform = "translateY(0)";
                    }
                  }}
                >
                  {option.label}
                  {option.premium && (
                    <div style={premiumBadgeStyle}>Premium</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        {/* Duration Section */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle()}>Duration</h2>
          <div style={durationContainerStyle}>
            <div style={durationValueStyle}>
              {selectedDuration} minute{selectedDuration > 1 ? "s" : ""}
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(parseInt(e.target.value))}
              style={durationSliderStyle}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "#666666",
                fontSize: "0.875rem",
              }}
            >
              <span>1 min</span>
              <span>5 min</span>
            </div>
          </div>
        </div>
        {/* Platforms Section */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle(errors.platforms)}>
            Platforms <span style={requiredIndicatorStyle}>*</span>
          </h2>
          {errors.platforms && (
            <div style={errorMessageStyle}>{errors.platforms}</div>
          )}
          <div style={platformsContainerStyle}>
            {platforms.map((platform) => (
              <div
                key={platform.id}
                style={platformItemStyle(
                  selectedPlatforms.includes(platform.id)
                )}
                onClick={() => togglePlatform(platform.id)}
                onMouseEnter={(e) => {
                  if (!selectedPlatforms.includes(platform.id)) {
                    e.target.style.transform = "scale(1.02)";
                    e.target.style.borderColor = "#ff0050";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!selectedPlatforms.includes(platform.id)) {
                    e.target.style.transform = "scale(1)";
                    e.target.style.borderColor = "#e0e0e0";
                  }
                }}
              >
                <img
                  src={platform.image}
                  alt={platform.label}
                  style={platformImageStyle}
                />
                <span style={platformLabelStyle}>{platform.label}</span>
              </div>
            ))}
          </div>
        </div>{" "}
        {/* Schedule Section */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle()}>Schedule</h2>
          <Scheduler
            selectedDates={selectedDates}
            setSelectedDates={setSelectedDates}
            isPremium={userDoc?.Premium}
          />
        </div>
        {/* Generate Button */}
        <button
          style={generateButtonStyle}
          onClick={handleGenerate}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-3px)";
            e.target.style.boxShadow = "0 15px 35px rgba(255, 0, 80, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 8px 25px rgba(255, 0, 80, 0.3)";
          }}
        >
          Generate Content
        </button>
      </section>
    </div>
  );
}
