import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "getwild - Prime Care",
  description: "Single point of contact for all health needs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

