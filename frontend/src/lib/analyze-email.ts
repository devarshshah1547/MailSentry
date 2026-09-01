import type { AnalysisResult } from "@/types/analysis";
import { pickMockResult } from "@/data/mockAnalysis";

/**
 * Single integration point for email analysis.
 *
 * TODAY: returns synthetic data after a simulated investigation delay.
 *
 * LATER (FastAPI): replace the body of `analyzeEmail` with:
 *
 *   const res = await fetch(`${import.meta.env.VITE_API_URL}/analyze-email`, {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify({ email_content: emailContent }),
 *   });
 *   if (!res.ok) throw new AnalysisError("Unable to analyze email. Please check the email format and try again.");
 *   return (await res.json()) as AnalysisResult;
 *
 * Nothing else in the UI needs to change as long as the API response matches
 * the `AnalysisResult` type in `src/types/analysis.ts`.
 */

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

export async function analyzeEmail(emailContent: string, signal?: AbortSignal): Promise<AnalysisResult> {
  if (!emailContent.trim()) throw new AnalysisError(EMPTY_INPUT_MESSAGE);
  if (!looksLikeEmail(emailContent)) throw new AnalysisError(MALFORMED_MESSAGE);

  await new Promise<void>((resolve, reject) => {
    const t = setTimeout(resolve, 400);
    signal?.addEventListener("abort", () => {
      clearTimeout(t);
      reject(new DOMException("aborted", "AbortError"));
    });
  });

  return { ...pickMockResult(emailContent), analyzed_at: new Date().toISOString(), source: "synthetic" };
}
