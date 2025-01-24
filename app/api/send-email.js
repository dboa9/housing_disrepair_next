// import { google } from 'googleapis';
// import { NextResponse } from 'next/server';

// const oauth2Client = new google.auth.OAuth2(
//   process.env.GOOGLE_CLIENT_ID,
//   process.env.GOOGLE_CLIENT_SECRET,
//   process.env.GOOGLE_REDIRECT_URI
// );

// export async function POST(request) {
//   const { to, subject, body, attachments } = await request.json();

//   try {
//     // Set credentials from stored tokens (replace with your token storage logic)
//     oauth2Client.setCredentials({
//       access_token: 'YOUR_ACCESS_TOKEN',
//       refresh_token: 'YOUR_REFRESH_TOKEN',
//     });

//     const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

//     const rawEmail = [
//       `To: ${to}`,
//       `Subject: ${subject}`,
//       'MIME-Version: 1.0',
//       'Content-Type: text/plain; charset=utf-8',
//       '',
//       body,
//     ].join('\n');

//     const encodedEmail = Buffer.from(rawEmail).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

//     const response = await gmail.users.messages.send({
//       userId: 'me',
//       requestBody: {
//         raw: encodedEmail,
//       },
//     });

//     return NextResponse.json({ message: 'Email sent successfully', data: response.data });
//   } catch (error) {
//     console.error('Error sending email:', error);
//     return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
//   }
// }