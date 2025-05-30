import sahur from "../assets/tungtung.png";
import Reddit from "../assets/reddit.png";
import Podcast from "../assets/podcast.png";
import Novels from "../assets/novels.png";
import Anime from "../assets/anime.png";
import More from "../assets/more.png";
import Movies from "../assets/Movies.png";

import { useEffect, useState, useRef } from "react";

export default function Page1() {
  const [introVisible, setIntroVisible] = useState(false);
  const [explanationVisible, setExplanationVisible] = useState(false);
  const [sourcesVisible, setSourcesVisible] = useState(false);
  const [pricingVisible, setPricingVisible] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [hoveredPlan, setHoveredPlan] = useState(null);

  const introRef = useRef(null);
  const explanationRef = useRef(null);
  const sourcesRef = useRef(null);
  const pricingRef = useRef(null);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observeSection = (ref, setVisible) => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      if (ref.current) {
        observer.observe(ref.current);
      }
      return () => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      };
    };

    observeSection(introRef, setIntroVisible);
    observeSection(explanationRef, setExplanationVisible);
    observeSection(sourcesRef, setSourcesVisible);
    observeSection(pricingRef, setPricingVisible);
  }, []);

  const sectionStyle = {
    display: "flex",
    alignItems: "center",
    minHeight: "50vh",
    maxWidth: "1700px",
    padding: "2rem",
    margin: "0 auto",
    overflowX: "hidden",
    marginTop: "6rem",
  };

  const textContainerStyle = {
    flex: "1",
    paddingRight: "2rem",
    paddingLeft: "5rem",
    transform: introVisible ? "translateY(0)" : "translateY(50px)",
    opacity: introVisible ? 1 : 0,
    transition: "transform 0.8s ease-out, opacity 0.8s ease-out",
    transitionDelay: "0.2s",
  };

  const headingStyle = {
    fontSize: "5rem",
    fontWeight: "bold",
    lineHeight: "1.1",
    margin: 0,
    fontFamily: "'Inter', sans-serif",
  };

  const greenTextStyle = {
    color: "#059669",
    display: "block",
  };

  const imageContainerStyle = {
    flex: "1",
    textAlign: "center",
    transform: introVisible ? "translateY(0)" : "translateY(50px)",
    opacity: introVisible ? 1 : 0,
    transition: "transform 0.8s ease-out, opacity 0.8s ease-out",
    transitionDelay: "0.4s",
  };

  const imageStyle = {
    maxWidth: "800px",
    height: "auto",
  };

  const explanationSectionStyle = {
    padding: "4rem 2rem",
    backgroundColor: "#f9fafb",
    textAlign: "center",
    transform: explanationVisible ? "translateY(0)" : "translateY(50px)",
    opacity: explanationVisible ? 1 : 0,
    transition: "transform 0.8s ease-out, opacity 0.8s ease-out",
    transitionDelay: "0.1s",
    overflowX: "hidden",
  };

  const explanationHeadingStyle = {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: "1rem",
    fontFamily: "'Inter', sans-serif",
  };

  const explanationParagraphStyle = {
    fontSize: "1.125rem",
    color: "#4b5563",
    maxWidth: "800px",
    margin: "0 auto 3rem auto",
    lineHeight: "1.6",
    fontFamily: "'Inter', sans-serif",
  };

  const featureListStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "2rem",
    listStyle: "none",
    padding: 0,
    maxWidth: "1200px",
    margin: "0 auto",
  };

  const featureItemBaseStyle = {
    backgroundColor: "#ffffff",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    transition: "transform 0.3s ease-out, box-shadow 0.3s ease-out",
    textAlign: "left",
  };

  const featureTitleStyle = {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#059669",
    marginBottom: "0.75rem",
    fontFamily: "'Inter', sans-serif",
  };

  const featureDescriptionStyle = {
    fontSize: "1rem",
    color: "#374151",
    lineHeight: "1.5",
    fontFamily: "'Inter', sans-serif",
  };

  const features = [
    {
      title: "Automated Video Creation",
      description:
        "Effortlessly generate engaging video content from various sources like articles, scripts, or existing footage. Our AI handles editing, voiceovers, and music.",
    },
    {
      title: "Real-Time Trend Analysis",
      description:
        "Stay ahead of the curve by identifying viral trends, popular topics, and optimal posting times across social media platforms, tailored to your niche.",
    },
    {
      title: "Performance Tracking",
      description:
        "Monitor key metrics like views, engagement, and audience growth with our comprehensive analytics dashboard. Gain actionable insights to refine your strategy.",
    },
    {
      title: "User Customization",
      description:
        "Tailor your content with customizable templates, branding options, and style preferences. Ensure your videos align perfectly with your unique brand identity.",
    },
  ];

  const sourcesSectionStyle = {
    padding: "4rem 2rem",
    backgroundColor: "#ffffff",
    textAlign: "center",
    transform: sourcesVisible ? "translateX(0)" : "translateX(-100px)",
    opacity: sourcesVisible ? 1 : 0,
    transition: "transform 1s ease-out, opacity 1s ease-out",
    transitionDelay: "0.1s",
    overflowX: "hidden",
  };

  const sourcesHeadingStyle = {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: "3rem",
    fontFamily: "'Inter', sans-serif",
  };

  const sourcesGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "2.5rem",
    listStyle: "none",
    padding: 0,
    maxWidth: "1000px",
    margin: "0 auto",
  };

  const sourceItemStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  };

  const sourceImageStyle = {
    width: "100px",
    height: "100px",
    objectFit: "contain",
    marginBottom: "1rem",
    borderRadius: "8px",
  };

  const sourceTitleStyle = {
    fontSize: "1.3rem",
    fontWeight: "600",
    color: "#2d3748",
    marginBottom: "0.5rem",
    fontFamily: "'Inter', sans-serif",
  };

  const sourceDescriptionStyle = {
    fontSize: "0.95rem",
    color: "#718096",
    lineHeight: "1.4",
    fontFamily: "'Inter', sans-serif",
  };

  const sourcesData = [
    {
      img: Reddit,
      title: "Reddit",
      description: "Engaging stories and discussions from various subreddits.",
    },
    {
      img: Movies,
      title: "Movies & Series",
      description:
        "Iconic scenes and memorable clips from popular films and shows.",
    },
    {
      img: Podcast,
      title: "Podcasts",
      description:
        "Insightful segments and highlights from diverse podcast episodes.",
    },
    {
      img: Anime,
      title: "Anime",
      description:
        "Epic moments and captivating clips from your favorite anime series.",
    },
    {
      img: Novels,
      title: "Novels & Stories",
      description:
        "Bringing great narratives and literary excerpts to visual life.",
    },
    {
      img: More,
      title: "Much More",
      description:
        "Explore an ever-expanding library of content sources and types.",
    },
  ];

  const pricingSectionStyle = {
    padding: "4rem 2rem",
    backgroundColor: "#f0fdfa",
    textAlign: "center",
    transform: pricingVisible ? "translateX(0)" : "translateX(100px)",
    opacity: pricingVisible ? 1 : 0,
    transition: "transform 1s ease-out, opacity 1s ease-out",
    transitionDelay: "0.1s",
    overflowX: "hidden",
  };

  const pricingHeadingStyle = {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#0f766e",
    marginBottom: "3rem",
    fontFamily: "'Inter', sans-serif",
  };

  const pricingGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "2rem",
    maxWidth: "1200px",
    margin: "0 auto",
  };

  const pricingBoxBaseStyle = {
    backgroundColor: "#ffffff",
    padding: "2.5rem 2rem",
    borderRadius: "12px",
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.04)",
    border: "1px solid #ccfbf1",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.3s ease-out, box-shadow 0.3s ease-out",
  };

  const pricingBoxTitleStyle = {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#134e4a",
    marginBottom: "0.5rem",
    fontFamily: "'Inter', sans-serif",
  };

  const pricingBoxPriceStyle = {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#059669", // Main green color
    marginBottom: "0.25rem",
    fontFamily: "'Inter', sans-serif",
  };

  const pricingBoxDurationStyle = {
    fontSize: "0.9rem",
    color: "#52525b", // Neutral gray (Tailwind zinc-600)
    marginBottom: "1.5rem",
    fontFamily: "'Inter', sans-serif",
  };

  const pricingBoxFeaturesListStyle = {
    listStyle: "none",
    padding: 0,
    margin: "0 0 2rem 0",
    textAlign: "left",
    flexGrow: 1, // Makes sure features list takes available space
  };

  const pricingBoxFeatureItemStyle = {
    fontSize: "1rem",
    color: "#3f3f46", // Darker neutral gray (Tailwind zinc-700)
    marginBottom: "0.75rem",
    display: "flex",
    alignItems: "center",
    fontFamily: "'Inter', sans-serif",
  };

  const checkIconStyle = {
    // Simple checkmark
    color: "#059669",
    marginRight: "0.5rem",
    fontWeight: "bold",
  };

  const pricingBoxButtonStyle = {
    backgroundColor: "#059669",
    color: "#ffffff",
    padding: "0.75rem 1.5rem",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "600",
    textDecoration: "none",
    display: "inline-block",
    marginTop: "auto", // Pushes button to the bottom if box heights vary
    transition: "background-color 0.2s ease-out",
  };

  const popularPlanStyle = {
    // Style for the "popular" plan
    borderColor: "#059669",
    borderWidth: "2px",
    transform: "scale(1.05)", // Slightly larger
  };

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      duration: "Always Free",
      features: [
        "10 Video Exports/Month",
        "Basic Trend Analysis",
        "Limited Source Access",
        "Community Support",
      ],
      buttonText: "Get Started",
      isPopular: false,
    },
    {
      name: "Monthly",
      price: "$9.99",
      duration: "per month",
      features: [
        "50 Video Exports/Month",
        "Standard Trend Analysis",
        "All Core Sources",
        "Email Support",
        "HD Quality Exports",
      ],
      buttonText: "Choose Plan",
      isPopular: true,
    },
    {
      name: "Quarterly",
      price: "$24.99",
      duration: "per 3 months",
      features: [
        "180 Video Exports/3 Months",
        "Advanced Trend Analysis",
        "All Sources + Early Access",
        "Priority Email Support",
        "4K Quality Exports",
      ],
      buttonText: "Choose Plan",
      isPopular: false,
    },
    {
      name: "Yearly",
      price: "$69.99",
      duration: "per year",
      features: [
        "Unlimited Video Exports",
        "Premium Trend Analysis",
        "All Sources + Custom Requests",
        "Dedicated Support Manager",
        "4K & Commercial License",
      ],
      buttonText: "Choose Plan",
      isPopular: false,
    },
  ];

  return (
    <>
      <section className="intro" ref={introRef} style={sectionStyle}>
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

      <section
        id="explanation"
        className="explanation"
        ref={explanationRef}
        style={explanationSectionStyle}
      >
        <h2 style={explanationHeadingStyle}>What TikTonik Does</h2>
        <p style={explanationParagraphStyle}>
          TikTonik automates the end-to-end process of social media content
          management, offering the following key features to supercharge your
          online presence:
        </p>
        <ul style={featureListStyle}>
          {features.map((feature, index) => (
            <li
              key={index}
              style={{
                ...featureItemBaseStyle,
                transform:
                  hoveredFeature === index
                    ? "translateY(-10px)"
                    : "translateY(0)",
                boxShadow:
                  hoveredFeature === index
                    ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                    : featureItemBaseStyle.boxShadow,
              }}
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <h3 style={featureTitleStyle}>{feature.title}</h3>
              <p style={featureDescriptionStyle}>{feature.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section
        id="sources"
        className="sources"
        ref={sourcesRef}
        style={sourcesSectionStyle}
      >
        <h2 style={sourcesHeadingStyle}>Diverse Video Content Sources</h2>
        <ul style={sourcesGridStyle}>
          {sourcesData.map((source, index) => (
            <li key={index} style={sourceItemStyle}>
              <img
                src={source.img}
                alt={source.title}
                style={sourceImageStyle}
              />
              <h3 style={sourceTitleStyle}>{source.title}</h3>
              <p style={sourceDescriptionStyle}>{source.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section
        id="pricing"
        className="pricing"
        ref={pricingRef}
        style={pricingSectionStyle}
      >
        <h2 style={pricingHeadingStyle}>Flexible Pricing Plans</h2>
        <div style={pricingGridStyle}>
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              style={{
                ...pricingBoxBaseStyle,
                ...(plan.isPopular ? popularPlanStyle : {}),
                transform:
                  hoveredPlan === index && !plan.isPopular
                    ? "translateY(-10px)"
                    : plan.isPopular
                    ? popularPlanStyle.transform
                    : "translateY(0)",
                boxShadow:
                  hoveredPlan === index && !plan.isPopular
                    ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                    : pricingBoxBaseStyle.boxShadow,
              }}
              onMouseEnter={() => setHoveredPlan(index)}
              onMouseLeave={() => setHoveredPlan(null)}
            >
              <h3 style={pricingBoxTitleStyle}>{plan.name}</h3>
              <p style={pricingBoxPriceStyle}>{plan.price}</p>
              <p style={pricingBoxDurationStyle}>{plan.duration}</p>
              <ul style={pricingBoxFeaturesListStyle}>
                {plan.features.map((item, i) => (
                  <li key={i} style={pricingBoxFeatureItemStyle}>
                    <span style={checkIconStyle}>✓</span> {item}
                  </li>
                ))}
              </ul>
              <a
                href="#"
                style={{
                  ...pricingBoxButtonStyle,
                  backgroundColor: plan.isPopular
                    ? "#047857"
                    : pricingBoxButtonStyle.backgroundColor,
                }}
                onMouseEnter={(e) => {
                  if (!plan.isPopular)
                    e.target.style.backgroundColor = "#047857";
                }}
                onMouseLeave={(e) => {
                  if (!plan.isPopular)
                    e.target.style.backgroundColor = "#059669";
                }}
              >
                {plan.buttonText}
              </a>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
