// File Location: app/page.tsx
// Description: Main page that handles OAuth2 authentication and redirects the user to the Google OAuth consent screen.

"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleAuth = () => {
    // Construct the OAuth2 authorization URL
    const authUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(
        process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || ""
      )}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent(
        "https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/drive.file"
      )}` +
      `&access_type=offline` +
      `&prompt=consent`;

    // Redirect the user to the authorization URL
    window.location.href = authUrl;
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Authentication Required</h1>
      <p>Please authenticate to access the email form.</p>
      <button
        onClick={handleAuth}
        style={{
          padding: "10px 20px",
          backgroundColor: "#4285F4",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Authenticate with Google
      </button>
    </div>
  );
}
