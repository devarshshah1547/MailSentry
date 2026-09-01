import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/components/cybertrace/Dashboard";

const title = "CYBERTRACE — AI Email Threat Detection & Forensic Intelligence";
const description =
  "Investigate suspicious emails: threat scoring, SPF/DKIM/DMARC analysis, relay path tracing, probable origin geolocation and forensic assessment.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});
