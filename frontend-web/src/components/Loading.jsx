import React from "react";

export default function Loading() {
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  };

  const spinnerStyle = {
    width: "48px",
    height: "48px",
    border: "6px solid rgba(0,0,0,0.1)",
    borderTopColor: "#3498db",
    borderRadius: "50%",
    animation: "spin 1s ease-in-out infinite",
    marginBottom: "12px",
  };

  const textStyle = {
    fontSize: "1rem",
    color: "#333",
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>

      <div style={containerStyle}>
        <div style={spinnerStyle} />
        <p style={textStyle}>Loading...</p>
      </div>
    </>
  );
}
