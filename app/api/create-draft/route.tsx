// File Location: app/api/create-draft/route.ts
// Description: API route to create an email draft using the Gmail API.

import { spawn } from 'child_process';
import { NextResponse, NextRequest } from 'next/server';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { google, Auth } from 'googleapis';

let oAuth2Client: Auth.OAuth2Client | null = null;

async function getOAuth2Client(): Promise<Auth.OAuth2Client> {
    if (oAuth2Client) {
        return oAuth2Client;
    }

    const credentialsFilePath = path.join(process.cwd(), '..', 'backend', 'credentials.json');
    let credentials;
    try {
        const credentialsFileContent = fs.readFileSync(credentialsFilePath, 'utf8');
        credentials = JSON.parse(credentialsFileContent);
    } catch (error) {
        console.error('Error loading credentials:', error);
        throw new Error('Failed to load credentials. Ensure credentials.json is correctly configured and located in the backend directory.');
    }

    oAuth2Client = new google.auth.OAuth2(
        credentials.installed.client_id,
        credentials.installed.client_secret,
        credentials.installed.redirect_uris[0]
    );

    oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

    return oAuth2Client;
}

async function getDraftPreview(draftId: string, auth: Auth.OAuth2Client) {
    const gmail = google.gmail({ version: 'v1', auth });

    try {
        const response = await gmail.users.drafts.get({
            userId: 'me',
            id: draftId,
            format: 'full',
        });

        const message = response.data.message;

        if (!message || !message.payload) {
            throw new Error('Invalid message payload');
        }

        let emailBody = '';
        let attachments: { name: string; mimeType: string }[] = [];

        if (message.payload.mimeType === 'text/plain' && message.payload.body?.data) {
            emailBody = Buffer.from(message.payload.body.data, 'base64').toString('utf-8');
        } else if (message.payload.parts) {
            for (const part of message.payload.parts) {
                if (part.mimeType === 'text/plain' && part.body?.data) {
                    emailBody = Buffer.from(part.body.data, 'base64').toString('utf-8');
                } else if (part.filename && part.filename.length > 0) {
                    attachments.push({
                        name: part.filename,
                        mimeType: part.mimeType || 'application/octet-stream',
                    });
                }
            }
        }

        const recipientEmail = message.payload.headers?.find((header) => header.name === 'To')?.value || '';
        const subject = message.payload.headers?.find((header) => header.name === 'Subject')?.value || '';

        return {
            recipientEmail,
            subject,
            emailBody,
            attachments,
        };
    } catch (error) {
        console.error('Error fetching draft:', error);
        throw error;
    }
}

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const recipientEmail = formData.get('recipientEmail') as string;
    const subject = formData.get('subject') as string;
    const emailBody = formData.get('emailBody') as string;
    const folderName = formData.get('folderName') as string || 'Temp_Email_Attachments';
    const files = formData.getAll('files') as File[];
    const extractedFileNames = formData.get('extractedFileNames') as string;

    console.log('Form Data Received:', { recipientEmail, subject, emailBody, folderName, extractedFileNames });

    const fileNamesArray = JSON.parse(extractedFileNames || '[]');

    try {
        const pythonArgs = [
            path.join(process.cwd(), '..', 'backend', 'gmail_automation_new_Scopes.py'),
            '--recipientEmail', recipientEmail,
            '--subject', subject,
            '--emailBody', emailBody,
            '--folderName', folderName,
            '--extractedFileNames', ...(fileNamesArray || []),
        ];

        if (files.length > 0) {
            pythonArgs.push('--files');
            files.forEach(file => {
                console.log('File to be attached:', file.name);
                pythonArgs.push(file.name);
            });
        }

        console.log("Constructed Python Arguments:", pythonArgs);

        const pythonProcess = spawn('/home/mrdbo/miniconda3/envs/dataset_test_deploy_ec2/bin/python', pythonArgs);

        let scriptOutput = '';
        let scriptError = '';

        pythonProcess.stdout.on('data', (data) => {
            scriptOutput += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            scriptError += data.toString();
        });

        return new Promise((resolve) => {
            pythonProcess.on('close', async (code) => {
                console.log('Python process closed with code:', code);
                console.log('Python script output:', scriptOutput);
                console.log('Python script error:', scriptError);
    
                if (code === 0) {
                    const draftIdMatch = scriptOutput.match(/Draft email created with ID: (.+)/);
                    if (!draftIdMatch) {
                        console.error('Draft ID not found in Python script output');
                        resolve(NextResponse.json({ error: 'Failed to create draft' }, { status: 500 }));
                        return;
                    }
                    const draftId = draftIdMatch[1].trim();
                    console.log('Draft ID found:', draftId);
    
                    try {
                        const oAuth2Client = await getOAuth2Client();
                        const draftPreview = await getDraftPreview(draftId, oAuth2Client);
                        console.log('Draft preview:', draftPreview);
                        resolve(NextResponse.json({
                            message: "Draft created successfully",
                            draftId: draftId,
                            previewData: draftPreview,
                        }));
                    } catch (previewError) {
                        console.error('Error fetching draft preview:', previewError);
                        resolve(NextResponse.json({ error: 'Failed to fetch draft preview' }, { status: 500 }));
                    }
                } else {
                    console.error('Python script error:', scriptError);
                    resolve(NextResponse.json(
                        { error: "Failed to create draft", output: scriptError },
                        { status: 500 }
                    ));
                }
            });
        });
    } catch (error) {
        console.error('Error creating draft:', error);
        return NextResponse.json({ error: 'Failed to create draft' }, { status: 500 });
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
};