import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Afsar | Portfolio",
  description: "Portfolio of Afsar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Droid+Sans:wght@400;700&family=Droid+Sans+Mono&family=Barlow+Condensed:wght@700;800;900&display=swap"
        />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
