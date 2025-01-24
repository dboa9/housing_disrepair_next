// File Location: app/components/InitialScreen.tsx
// Description: Initial screen with a button to generate a refresh token and a link to GitHub Pages.

import axios from "axios";

const InitialScreen = () => {
  const handleGenerateToken = async () => {
    try {
      // Call the backend to get the OAuth URL
      const response = await axios.get("/api/generate-refresh-token");
      console.log("OAuth URL:", response.data.authUrl);

      // Open the OAuth consent screen in a new window
      window.open(response.data.authUrl, "_blank");
    } catch (error) {
      console.error("Error generating refresh token:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Welcome to the App</h1>
      <p>Click the button below to generate a refresh token:</p>
      <button
        onClick={handleGenerateToken}
        style={{
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Generate Refresh Token
      </button>

      {/* Footer with GitHub Pages link */}
      <footer style={{ marginTop: "20px", fontSize: "14px", color: "#666" }}>
        <p>
          Visit the app on GitHub Pages:{" "}
          <a
            href="https://dboa9.github.io/housing_disrepair_next/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#007BFF", textDecoration: "none" }}
          >
            GitHub Pages
          </a>
        </p>
      </footer>
    </div>
  );
};

export default InitialScreen;
