import { Resend } from "resend";

// Create the client at runtime to avoid build-time env access issues on Vercel
export function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set");
  }
  return new Resend(apiKey);
}
