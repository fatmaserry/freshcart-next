import type { Metadata } from "next";
import { PolicyPage } from "@/components/policies/PolicyPage";
import { termsContent } from "@/lib/policies/content";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read the terms that apply when using FreshCart.",
};

export default function TermsPage() {
  return <PolicyPage policy={termsContent} />;
}
