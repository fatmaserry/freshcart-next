import { Suspense } from "react";
import type { Metadata } from "next";
import { Exo } from "next/font/google";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config as faConfig } from "@fortawesome/fontawesome-svg-core";
import "./globals.css";
import { Providers } from "@/providers/Providers";
import Script from "next/script";
import { themeScript } from "@/lib/theme/themeScript";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { Footer } from "@/components/layout/Footer";
import { SITE_URL } from "@/lib/site";

// The stylesheet is imported above, so runtime injection would duplicate it.
faConfig.autoAddCss = false;
const exo = Exo({ variable: "--font-exo", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "FreshCart — Shop fresh, live better",
    template: "%s · FreshCart",
  },
  description:
    "FreshCart e-commerce: products, brands, categories, cart, wishlist and secure checkout.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  // themeScript sets data-theme before hydration, so this attribute differs on purpose.
  return (
    <html
      lang="en"
      className={`${exo.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <Script id="theme-script" strategy="beforeInteractive">
          {themeScript}
        </Script>
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <Providers>
          <Suspense fallback={null}>
            <ScrollToTop />
          </Suspense>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
