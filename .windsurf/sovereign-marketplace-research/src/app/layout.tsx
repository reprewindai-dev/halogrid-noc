import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SupportChat from "@/components/SupportChat";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-sans",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Veklom — Sovereign AI Infrastructure Marketplace",
  description: "Controlled backend infrastructure for regulated teams. Self-hostable, compliance-ready, no lock-in. Token-metered API access with audit trails and kill switches.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        {children}
        <SupportChat />
      </body>
    </html>
  );
}
