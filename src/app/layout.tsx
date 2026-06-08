import type { Metadata } from "next";
import "./globals.css";
import "./custom.css";
import Navbar from "@/components/Navbar";
import { ReactLenis } from "lenis/react";

export const metadata: Metadata = {
  title: "Hameed Afsar",
  description: "Portfolio of Afsar",
  icons: { icon: "/icon.svg" },
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
        <ReactLenis root>
          <Navbar />
          {children}
        </ReactLenis>
      </body>
    </html>
  );
}
