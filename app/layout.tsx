import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Cormorant_Garamond, JetBrains_Mono, Inter } from "next/font/google";
import { I18nProvider } from "best-time-ui";
import { translations } from "@/lib/i18n";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bestshowertime.com"),
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Best Shower Time",
  },
  icons: {
    apple: "/icons/icon-192.png",
  },
  title: {
    default: "Best Shower Time | הזמן הטוב למקלחת",
    template: "%s | Best Shower Time",
  },
  description:
    "Real-time safety app for Israelis — analyzes Pikud HaOref rocket alert data to recommend the safest times to shower, cook, or do everyday activities. Stay informed, stay safe.",
  keywords: [
    "rocket alerts",
    "Israel safety",
    "Pikud HaOref",
    "פיקוד העורף",
    "best shower time",
    "הזמן הטוב למקלחת",
    "real-time alerts",
    "צבע אדום",
    "alert analysis",
    "safe time to shower",
    "Iron Dome",
    "כיפת ברזל",
  ],
  authors: [
    {
      name: "Ben Greenberg",
      url: "https://www.hummusonrails.com/",
    },
  ],
  creator: "Ben Greenberg",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Best Shower Time | הזמן הטוב למקלחת",
    description:
      "Is it safe to shower right now? Real-time rocket alert analysis for Israelis — powered by Pikud HaOref data.",
    siteName: "Best Shower Time",
    locale: "en_US",
    type: "website",
    url: "https://bestshowertime.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Shower Time | הזמן הטוב למקלחת",
    description:
      "Is it safe to shower right now? Real-time rocket alert analysis for Israelis.",
  },
  alternates: {
    languages: {
      "en": "/",
      "he": "/",
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#1E1E1C",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body
        className={`${cormorant.variable} ${jetbrains.variable} ${inter.variable} antialiased`}
      >
        <I18nProvider translations={translations} storageKey="bst-lang">
          {children}
        </I18nProvider>
        <ServiceWorkerRegistration />
        <Script
          data-goatcounter="https://bestshowertime.goatcounter.com/count"
          src="//gc.zgo.at/count.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
