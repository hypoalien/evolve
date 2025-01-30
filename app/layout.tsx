import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/components/session-wrapper";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://evolve.techwithdeep.com"),
  title: "Evolve - Personal Growth & Daily Habit Tracker",
  description:
    "Transform your life through daily discipline, positive thinking, and conscious growth. Track habits, journal entries, and manifestations all in one place.",
  keywords: [
    "personal development",
    "habit tracker",
    "daily journal",
    "manifestation",
    "self improvement",
    "productivity tool",
    "goal tracking",
    "mindfulness",
    "personal growth",
    "daily reflection",
  ],
  openGraph: {
    title: "Evolve - Your Personal Growth Journey",
    description:
      "Track habits, write daily journals, and manifest your goals with our comprehensive personal development platform.",
    type: "website",
    locale: "en_US",
    url: "https://evolve.techwithdeep.com",
    siteName: "Evolve",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Evolve - Personal Growth Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Evolve - Personal Growth & Daily Habit Tracker",
    description:
      "Transform your life through daily discipline, positive thinking, and conscious growth.",
    images: ["/og-image.png"],
  },
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
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
};
// Add this script in your layout.tsx or page.tsx

export const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Evolve",
  applicationCategory: "LifestyleApplication",
  description:
    "A comprehensive personal development platform for tracking habits, journaling, and manifestation",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Daily Habit Tracking",
    "Journal Prompts",
    "Manifestation Tools",
    "Progress Analytics",
    "Personal Growth Templates",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#10B981" />
        <link rel="canonical" href="https://evolve.techwithdeep.com" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionWrapper>
          {children}
          <Toaster />
        </SessionWrapper>
      </body>
    </html>
  );
}
