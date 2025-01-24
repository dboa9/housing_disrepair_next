// File Location: app/components/Preview.tsx
// Description: Component to display the email preview, including recipient, subject, body, and attachments.

import React from "react";
import ReactMarkdown from "react-markdown";

type PreviewProps = {
  previewData: {
    recipientEmail: string;
    subject: string;
    emailBody: string;
    attachments: { name: string; mimeType: string }[];
  };
  handleSendEmail: () => Promise<void>;
  handleEdit: () => void;
  isLoading: boolean;
};

const Preview: React.FC<PreviewProps> = ({
  previewData,
  handleSendEmail,
  handleEdit,
  isLoading,
}) => {
  return (
    <div>
      <h2>Email Preview:</h2>
      <p>
        <strong>Recipient:</strong> {previewData.recipientEmail}
      </p>
      <p>
        <strong>Subject:</strong> {previewData.subject}
      </p>
      <div>
        <strong>Body:</strong>
        <ReactMarkdown>{previewData.emailBody}</ReactMarkdown>
      </div>
      <div>
        <strong>Attachments:</strong>
        <ul>
          {previewData.attachments.map((file) => (
            <li key={file.name}>{file.name}</li>
          ))}
        </ul>
      </div>
      <button onClick={handleSendEmail} disabled={isLoading}>
        {isLoading ? "Sending..." : "Send Email"}
      </button>
      <button onClick={handleEdit}>Edit</button>
    </div>
  );
};

export default Preview;
