import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactHelp, ContactInfo } from "@/components/contact/ContactInfo";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the FreshCart team.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-surface-alt/50">
      <PageHeader
        title="Contact Us"
        subtitle="We'd love to hear from you. Get in touch with our team."
        crumbs={[{ label: "Contact Us" }]}
        icon="headset"
      />
      <div className="container-page py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <ContactInfo />
          <div className="lg:col-span-2">
            <ContactForm />
            <ContactHelp />
          </div>
        </div>
      </div>
    </div>
  );
}
