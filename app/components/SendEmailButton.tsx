// File Location: app/components/SendEmailButton.tsx
// Description: Component to handle sending the email.

"use client";

import axios from "axios";
import { useState } from "react";

const SendEmailButton = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSendEmail = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("/api/send-email");
      setMessage(response.data.message || "Email sent successfully!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setMessage(
          error.response?.data?.error ||
            "Failed to send email. Please try again."
        );
      } else {
        setMessage("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleSendEmail} disabled={loading}>
        {loading ? "Sending..." : "Send Email"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SendEmailButton;
