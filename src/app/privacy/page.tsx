import type { Metadata } from "next";
import { PolicyPage } from "@/components/policies/PolicyPage";
import { privacyContent } from "@/lib/policies/content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how FreshCart collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return <PolicyPage policy={privacyContent} />;
}
