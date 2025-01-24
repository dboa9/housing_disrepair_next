// File Location: app/components/EmailForm.tsx
// Description: Component for the email form with inputs for recipient email, subject, body, folder name, and file upload.

import React from "react";

type EmailFormProps = {
  recipientEmail: string;
  setRecipientEmail: (value: string) => void;
  subject: string;
  setSubject: (value: string) => void;
  emailBody: string;
  setEmailBody: (value: string) => void;
  folderName: string;
  setFolderName: (value: string) => void;
  isLoading: boolean;
  onDrop: (acceptedFiles: File[]) => void;
  extractedFileNames: string[];
  extractFileNames: (text: string) => void;
  files: File[];
  handleCreateDraft: () => Promise<void>;
  getRootProps: () => any;
  getInputProps: () => any;
};

const EmailForm: React.FC<EmailFormProps> = ({
  recipientEmail,
  setRecipientEmail,
  subject,
  setSubject,
  emailBody,
  setEmailBody,
  folderName,
  setFolderName,
  isLoading,
  onDrop,
  extractedFileNames,
  extractFileNames,
  files,
  handleCreateDraft,
  getRootProps,
  getInputProps,
}) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleCreateDraft();
      }}
    >
      {/* Recipient Email Input */}
      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="recipientEmail">Recipient Email:</label>
        <input
          type="email"
          id="recipientEmail"
          value={recipientEmail}
          onChange={(e) => setRecipientEmail(e.target.value)}
          required
          placeholder="e.g., central.london.civil.filing@justice.gov.uk"
          style={{ color: "black" }}
        />
      </div>

      {/* Subject Input */}
      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="subject">Subject:</label>
        <input
          type="text"
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          placeholder="e.g., N244 Application – Supplementary Evidence & Help with Fees Reference"
          style={{ color: "black" }}
        />
      </div>

      {/* Email Body Input */}
      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="emailBody">Email Body:</label>
        <textarea
          id="emailBody"
          value={emailBody}
          onChange={(e) => setEmailBody(e.target.value)}
          rows={10}
          placeholder="Enter your email body here. You can use Markdown for formatting in the preview."
          style={{ color: "black" }}
        />
      </div>

      {/* File Names Textarea */}
      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="fileNames">Paste Text with File Names:</label>
        <textarea
          id="fileNames"
          onChange={(e) => extractFileNames(e.target.value)}
          rows={5}
          placeholder="Paste text containing file names here. The system will automatically extract them."
          style={{ color: "black" }}
        />
      </div>

      {/* Folder Name Input */}
      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="folderName">
          Temporary Google Drive Folder Name (Optional):
        </label>
        <input
          type="text"
          id="folderName"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          placeholder="e.g., Temp_Email_Attachments"
          style={{ color: "black" }}
        />
      </div>

      {/* File Dropzone */}
      <div
        {...getRootProps()}
        style={{
          marginBottom: "15px",
          border: "2px dashed #ccc",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>

      {/* File List Display */}
      <ul style={{ marginBottom: "10px" }}>
        {files.map((file, index) => (
          <li key={`${file.name}-${index}`}>
            {file.name} - {file.size} bytes
          </li>
        ))}
      </ul>

      {/* Extracted File Names List */}
      <ul style={{ marginBottom: "10px" }}>
        {extractedFileNames.map((fileName, index) => (
          <li key={`fileName-${index}`}>{fileName}</li>
        ))}
      </ul>

      {/* Create Draft Button */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Creating Draft..." : "Create Draft"}
      </button>
    </form>
  );
};

export default EmailForm;
