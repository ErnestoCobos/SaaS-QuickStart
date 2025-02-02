import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Cobos Dashboard",
  description: "Create a new account to get started with our services",
  keywords: ["sign up", "register", "create account", "join"],
  openGraph: {
    title: "Sign Up | Cobos Dashboard",
    description: "Create a new account to get started with our services",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SignUpLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
