// File Location: frontend/app/api/generate-refresh-token/route.ts
// Description: API route to generate the OAuth URL for refreshing the token.

import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

export async function GET() {
    try {
        // Define the path to the credentials file
        const credentialsPath = path.join(process.cwd(), '..', 'backend', 'credentials.json');

        // Load client secrets from the credentials file
        const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

        // Create an OAuth2 client
        const { client_secret, client_id, redirect_uris } = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

        // Generate the authorization URL
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline', // Ensures a refresh token is returned
            scope: ['https://www.googleapis.com/auth/gmail.send'],
        });

        // Return the authorization URL to the frontend
        return NextResponse.json({ authUrl });
    } catch (error) {
        console.error('Error generating OAuth URL:', error);
        return NextResponse.json({ error: 'Failed to generate OAuth URL' }, { status: 500 });
    }
}