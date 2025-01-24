"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import EmailForm from "../components/EmailForm";
import GenerateRefreshTokenButton from "../components/GenerateRefreshTokenButton";
import Preview from "../components/Preview";
import SendEmailButton from "../components/SendEmailButton";

const FormPage = () => {
  // State variables for form inputs and UI states
  const [recipientEmail, setRecipientEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [folderName, setFolderName] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedFileNames, setExtractedFileNames] = useState<string[]>([]);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);

  // Handle file drop using react-dropzone
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  // Extract file names from the email body text
  const extractFileNames = (text: string) => {
    const fileRegex = /\b[\w-]+\.[\w-]+\b/g;
    const matches = text.match(fileRegex);
    if (matches) {
      setExtractedFileNames(matches);
    }
  };

  // Handle creating a draft email
  const handleCreateDraft = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("recipientEmail", recipientEmail);
      formData.append("subject", subject);
      formData.append("emailBody", emailBody);
      formData.append("folderName", folderName);
      formData.append("extractedFileNames", JSON.stringify(extractedFileNames));
      files.forEach((file) => formData.append("files", file));

      const response = await fetch("/api/create-draft", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setDraftId(data.draftId);
        setPreviewData(data.previewData);
        setShowPreview(true);
      } else {
        setError(data.error || "Failed to create draft.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sending the draft email
  const handleSendEmail = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/send-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draftId }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Email sent successfully");
        // Reset form fields and state
        setRecipientEmail("");
        setSubject("");
        setEmailBody("");
        setFolderName("");
        setFiles([]);
        setExtractedFileNames([]);
        setDraftId(null);
        setShowPreview(false);
      } else {
        setError(data.error || "Failed to send email.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle editing the draft
  const handleEdit = () => {
    setShowPreview(false);
  };

  return (
    <div
      style={{ display: "flex", padding: "20px", gap: "20px", height: "100vh" }}
    >
      {/* Left Column (Preview) */}
      <div
        style={{
          flex: 1,
          padding: "20px",
          borderRight: "1px solid #ccc",
          overflowY: "auto",
        }}
      >
        <h2>Email Preview</h2>
        {showPreview && previewData ? (
          <Preview
            previewData={previewData}
            handleSendEmail={handleSendEmail}
            handleEdit={handleEdit}
            isLoading={isLoading}
          />
        ) : (
          <div style={{ marginTop: "20px" }}>
            <p>No preview available. Create a draft to see the preview.</p>
          </div>
        )}
      </div>

      {/* Right Column (Form) */}
      <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
        <h1>Email Editor</h1>
        {error && (
          <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
        )}

        <EmailForm
          recipientEmail={recipientEmail}
          setRecipientEmail={setRecipientEmail}
          subject={subject}
          setSubject={setSubject}
          emailBody={emailBody}
          setEmailBody={setEmailBody}
          folderName={folderName}
          setFolderName={setFolderName}
          isLoading={isLoading}
          onDrop={onDrop}
          extractedFileNames={extractedFileNames}
          extractFileNames={extractFileNames}
          getRootProps={getRootProps}
          getInputProps={getInputProps}
          files={files}
          handleCreateDraft={handleCreateDraft}
        />

        <div style={{ marginTop: "20px" }}>
          <GenerateRefreshTokenButton />
        </div>
        <div style={{ marginTop: "20px" }}>
          <SendEmailButton />
        </div>
      </div>
    </div>
  );
};

export default FormPage;
