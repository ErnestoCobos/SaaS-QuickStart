import type { Metadata } from "next";
import "../../../globals.css";

export const metadata: Metadata = {
  title: "Sign In | Your App Name",
  description: "Sign in to your account to access your dashboard and services",
  keywords: ["sign in", "login", "authentication", "access account"],
  openGraph: {
    title: "Sign In | Your App Name",
    description: "Sign in to your account to access your dashboard and services",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SignInLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
