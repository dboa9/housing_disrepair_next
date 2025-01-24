// File Location: frontend/components/GenerateRefreshTokenButton.tsx
// Description: A button to initiate the OAuth flow for generating a refresh token.

import axios from "axios";

const GenerateRefreshTokenButton = () => {
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
  );
};

export default GenerateRefreshTokenButton;
