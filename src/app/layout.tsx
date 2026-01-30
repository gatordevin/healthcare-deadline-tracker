import type { Metadata } from "next";
import { Inter } from "next/font/google";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
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
          <header className="flex justify-end items-center p-4 gap-4 h-16 bg-white border-b border-gray-200">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
