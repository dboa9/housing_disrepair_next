// File Location: app/api/upload-file/route.ts
// Description: API route to upload a file to Google Drive.

import { google } from 'googleapis';
import { NextResponse } from 'next/server';

const oauth2Client = new google.auth.OAuth2(
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
  process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

export async function POST(request: Request) {
  const { file } = await request.json();

  try {
    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    const response = await drive.files.create({
      requestBody: {
        name: file.name,
        mimeType: file.type,
      },
      media: {
        mimeType: file.type,
        body: file,
      },
    });

    return NextResponse.json({ message: 'File uploaded successfully', data: response.data });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}