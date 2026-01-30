import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Healthcare Compliance Tracker | Regulatory Deadline Management",
  description: "Track HIPAA, CMS, and state licensing compliance deadlines for healthcare practices. Stay ahead of regulatory requirements with automated deadline monitoring.",
  keywords: ["healthcare compliance", "HIPAA", "CMS", "medical licensing", "regulatory deadlines", "healthcare practice management"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.variable} font-sans antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
