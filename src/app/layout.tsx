import type { Metadata } from "next";
import { Teko } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const teko = Teko({
  variable: "--font-teko",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

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
    <html lang="en" className={teko.variable}>
      <body className={teko.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
