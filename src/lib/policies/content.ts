import { CONTACT_EMAIL } from "@/lib/site";
import type { IconRef } from "@/components/ui/icons";

export interface PolicyItem {
  number?: string;
  lead?: string;
  email?: string;
  text: string;
}

export interface PolicyArticle {
  title: string;
  items: readonly PolicyItem[];
}

export interface PolicyContent {
  title: string;
  icon: IconRef;
  introTitle: string;
  intro: string;
  articles: readonly PolicyArticle[];
}

export const termsContent: PolicyContent = {
  title: "Terms of Service",
  icon: "clipboard-list",
  introTitle: "Please Read These Terms Carefully",
  intro:
    "These Terms govern your access to and use of FreshCart's services. By using our service, you agree to comply with these Terms.",
  articles: [
    {
      title: "Acceptance of Terms",
      items: [
        {
          number: "1.1",
          text: "By accessing or using the Service, you acknowledge that you have read, understood, and agree to be bound by these Terms.",
        },
        {
          number: "1.2",
          text: "If you do not agree to these Terms, you must not access or use the Service.",
        },
        {
          number: "1.3",
          text: "We reserve the right to modify these Terms at any time, and such modifications shall be effective immediately upon posting.",
        },
      ],
    },
    {
      title: "User Eligibility",
      items: [
        {
          number: "2.1",
          text: "The Service is intended for users who are at least eighteen (18) years of age.",
        },
        {
          number: "2.2",
          text: "By using the Service, you represent and warrant that you are of legal age to form a binding contract.",
        },
        {
          number: "2.3",
          text: "If you are accessing the Service on behalf of a legal entity, you represent that you have the authority to bind such entity.",
        },
      ],
    },
    {
      title: "Account Registration",
      items: [
        {
          number: "3.1",
          text: "You may be required to create an account to access certain features of the Service.",
        },
        {
          number: "3.2",
          text: "You agree to provide accurate, current, and complete information during registration.",
        },
        {
          number: "3.3",
          text: "You are solely responsible for maintaining the confidentiality of your account credentials.",
        },
        {
          number: "3.4",
          text: "You agree to notify us immediately of any unauthorized use of your account.",
        },
      ],
    },
    {
      title: "Orders and Payments",
      items: [
        {
          number: "4.1",
          text: "All orders placed through the Service are subject to acceptance and availability.",
        },
        {
          number: "4.2",
          text: "Prices are subject to change without notice prior to order confirmation.",
        },
        {
          number: "4.3",
          text: "Payment must be made in full at the time of purchase through approved payment methods.",
        },
        {
          number: "4.4",
          text: "We reserve the right to refuse or cancel any order at our sole discretion.",
        },
      ],
    },
    {
      title: "Shipping and Delivery",
      items: [
        {
          number: "5.1",
          text: "Shipping times are estimates only and are not guaranteed.",
        },
        {
          number: "5.2",
          text: "Risk of loss and title for items purchased pass to you upon delivery to the carrier.",
        },
        {
          number: "5.3",
          text: "We are not responsible for delays caused by carriers, customs, or other factors beyond our control.",
        },
      ],
    },
    {
      title: "Returns and Refunds",
      items: [
        {
          number: "6.1",
          text: "Our return policy allows returns within 14 days of delivery for most items.",
        },
        {
          number: "6.2",
          text: "Products must be unused and in original packaging.",
        },
        {
          number: "6.3",
          text: "Refunds will be processed within 5-7 business days after receiving the returned item.",
        },
      ],
    },
    {
      title: "Limitation of Liability",
      items: [
        {
          text: "To the maximum extent permitted by applicable law, FreshCart shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.",
        },
      ],
    },
    {
      title: "Contact Us",
      items: [
        {
          text: "If you have any questions about these Terms, please contact us at",
          email: CONTACT_EMAIL,
        },
      ],
    },
  ],
};

export const privacyContent: PolicyContent = {
  title: "Privacy Policy",
  icon: "shield-check",
  introTitle: "Your Privacy Matters",
  intro:
    "This Privacy Policy describes how FreshCart collects, uses, and protects your personal information when you use our services. We are committed to ensuring that your privacy is protected.",
  articles: [
    {
      title: "Information We Collect",
      items: [
        {
          number: "1.1",
          lead: "Personal Data:",
          text: "Name, email address, phone number, and shipping address.",
        },
        {
          number: "1.2",
          lead: "Payment Data:",
          text: "Credit card information processed securely through our payment providers.",
        },
        {
          number: "1.3",
          lead: "Technical Data:",
          text: "IP address, browser type, device information, and access times.",
        },
        {
          number: "1.4",
          lead: "Usage Data:",
          text: "Pages viewed, products browsed, and actions taken within our platform.",
        },
      ],
    },
    {
      title: "How We Use Your Information",
      items: [
        { number: "2.1", text: "To process and fulfill your orders." },
        {
          number: "2.2",
          text: "To send order confirmations and shipping updates.",
        },
        {
          number: "2.3",
          text: "To provide customer support and respond to inquiries.",
        },
        {
          number: "2.4",
          text: "To improve our products, services, and user experience.",
        },
        {
          number: "2.5",
          text: "To send promotional communications (with your consent).",
        },
      ],
    },
    {
      title: "Data Protection",
      items: [
        {
          number: "3.1",
          text: "We implement industry-standard encryption (SSL/TLS) for all data transfers.",
        },
        {
          number: "3.2",
          text: "Payment information is processed by PCI-compliant payment providers.",
        },
        {
          number: "3.3",
          text: "We conduct regular security audits and vulnerability assessments.",
        },
        {
          number: "3.4",
          text: "Access to personal data is restricted to authorized personnel only.",
        },
      ],
    },
    {
      title: "Information Sharing",
      items: [
        {
          number: "4.1",
          text: "We do not sell, trade, or rent your personal information to third parties.",
        },
        {
          number: "4.2",
          text: "We may share data with trusted service providers who assist in our operations.",
        },
        {
          number: "4.3",
          text: "We may disclose information when required by law or to protect our rights.",
        },
      ],
    },
    {
      title: "Your Rights",
      items: [
        {
          number: "5.1",
          lead: "Access:",
          text: "Request a copy of your personal data.",
        },
        {
          number: "5.2",
          lead: "Rectification:",
          text: "Request correction of inaccurate data.",
        },
        {
          number: "5.3",
          lead: "Erasure:",
          text: "Request deletion of your personal data.",
        },
        {
          number: "5.4",
          lead: "Portability:",
          text: "Request your data in a portable format.",
        },
        {
          number: "5.5",
          lead: "Opt-out:",
          text: "Unsubscribe from marketing communications at any time.",
        },
      ],
    },
    {
      title: "Cookies",
      items: [
        {
          number: "6.1",
          text: "We use cookies to enhance your browsing experience and remember preferences.",
        },
        {
          number: "6.2",
          text: "You can control cookie settings through your browser preferences.",
        },
        {
          number: "6.3",
          text: "Disabling cookies may affect the functionality of certain features.",
        },
      ],
    },
    {
      title: "Data Retention",
      items: [
        {
          text: "We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, or as required by law. Account data is deleted within 30 days of account closure upon request.",
        },
      ],
    },
    {
      title: "Contact Us",
      items: [
        {
          text: "For questions about this Privacy Policy or to exercise your rights, contact our Data Protection Officer at",
          email: "privacy@freshcart.com",
        },
      ],
    },
  ],
};
