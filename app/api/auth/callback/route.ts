// File Location: app/api/auth/callback/route.ts
// Description: API route to handle the OAuth callback, save the refresh token, and redirect the user.

import { NextResponse } from "next/server";
import { google } from "googleapis";
import fs from "fs";
import path from "path";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Authorization code is missing" }, { status: 400 });
  }

  try {
    // Define the path to the credentials file
    const credentialsPath = path.join(process.cwd(), "..", "backend", "credentials.json");

    // Load client secrets from the credentials file
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf8"));

    // Create an OAuth2 client
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    // Exchange the authorization code for tokens
    const { tokens } = await oAuth2Client.getToken(code);

    // Save the refresh token to the .env file
    if (tokens.refresh_token) {
      const envPath = path.join(process.cwd(), ".env.local");
      fs.appendFileSync(envPath, `\nREFRESH_TOKEN=${tokens.refresh_token}\n`);
      console.log("Refresh token saved to .env.local file.");
    }

    // Redirect the user back to the app's main screen
    return NextResponse.redirect("http://localhost:3000"); // Replace with your app's URL
  } catch (error) {
    console.error("Error handling OAuth callback:", error);
    return NextResponse.json({ error: "Failed to handle OAuth callback" }, { status: 500 });
  }
}