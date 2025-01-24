// File Location: app/api/auth/init/route.ts
// Description: API route to initialize OAuth2 authentication.

import { google } from 'googleapis';
import { NextResponse } from 'next/server';

const oauth2Client = new google.auth.OAuth2(
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
  process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI
);

export async function GET() {
  try {
    // Generate the authorization URL
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/gmail.send', 'https://www.googleapis.com/auth/drive'],
      prompt: 'consent',
    });

    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error('Error generating auth URL:', error);
    return NextResponse.json({ error: 'Failed to initialize authentication' }, { status: 500 });
  }
}