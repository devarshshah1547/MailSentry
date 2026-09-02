import type { AnalysisResult } from "@/types/analysis";

export class AnalysisError extends Error {}

export const EMPTY_INPUT_MESSAGE = "Please paste an email or load a demo before starting analysis.";
export const MALFORMED_MESSAGE = "Unable to analyze email. Please check the email format and try again.";

function looksLikeEmail(raw: string) {
  const text = raw.trim();
  if (text.length < 40) return false;
  const hasHeaderish = /(^|\n)\s*(from|return-path|received|message-id|subject|to)\s*:/i.test(text);
  const hasAddress = /[\w.+-]+@[\w-]+\.[\w.-]+/.test(text);
  return hasHeaderish || hasAddress;
}

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export async function fetchDemoEmails(): Promise<Record<string, string>> {
  try {
    const res = await fetch(`${API_URL}/demo-emails`);
    if (!res.ok) return {};
    return await res.json();
  } catch (e) {
    console.error("Failed to fetch demo emails", e);
    return {};
  }
}

export async function analyzeEmail(emailContent: string, signal?: AbortSignal): Promise<AnalysisResult> {
  if (!emailContent.trim()) throw new AnalysisError(EMPTY_INPUT_MESSAGE);
  if (!looksLikeEmail(emailContent)) throw new AnalysisError(MALFORMED_MESSAGE);

  const res = await fetch(`${API_URL}/analyze-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email_content: emailContent }),
    signal,
  });

  if (!res.ok) {
    throw new AnalysisError(MALFORMED_MESSAGE);
  }
  
  return (await res.json()) as AnalysisResult;
}
