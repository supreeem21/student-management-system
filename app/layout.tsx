import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/common/Navbar";
import ThemeUpdater from "./components/ThemeUpdater";
import { StoreHydrationProvider } from "./StoreHydrationProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Darbar Tech — Free Nepali & English Typing Practice",
    template: "%s | Darbar Tech",
  },
  description:
    "Practice and test your typing speed for free in English and Nepali (Preeti & Unicode). Built for Nepali students, job-seekers preparing for Lok Sewa/typing exams, and anyone learning to type.",
  // TODO: replace with the real production domain before launch.
  metadataBase: new URL("https://your-production-domain.com"),
  openGraph: {
    title: "Darbar Tech — Free Nepali & English Typing Practice",
    description:
      "Improve your WPM with real-time Preeti and Unicode Nepali typing drills.",
    url: "https://your-production-domain.com",
    siteName: "Darbar Tech",
    images: ["/og-image.png"],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Darbar Tech — Free Nepali & English Typing Practice",
    description:
      "Improve your WPM with real-time Preeti and Unicode Nepali typing drills.",
  },
  alternates: {
    canonical: "https://your-production-domain.com",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col overflow-x-hidden relative">
        <StoreHydrationProvider>
          <ThemeUpdater />

          <header className="w-full h-24 sticky top-0 z-50">
            <Navbar />
          </header>

          <main className="py-3 px-3 sm:py-5 sm:px-5 md:px-8 w-full flex-1">
            {children}
          </main>
        </StoreHydrationProvider>
      </body>
    </html>
  );
}
