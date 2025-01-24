// File Location: app/api/send-email/route.ts
// Description: API route to send an email using Gmail API.

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
  try {
    const { to, subject, body } = await request.json();

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    const emailMessage = [
      `To: ${to}`,
      'Content-Type: text/plain; charset=utf-8',
      'MIME-Version: 1.0',
      `Subject: ${subject}`,
      '',
      body,
    ].join('\n');

    const rawMessage = Buffer.from(emailMessage).toString('base64');

    const sentMessage = await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw: rawMessage },
    });

    return NextResponse.json({ message: 'Email sent successfully', data: sentMessage.data });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}