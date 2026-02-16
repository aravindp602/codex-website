import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: '--font-inter' 
});

const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: '--font-playfair' 
});

export const metadata: Metadata = {
  title: "The Codex Suite",
  description: "A professional directory of AI Business Modellers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} bg-neutral-50 text-neutral-900 font-sans`}>
        {children}
      </body>
    </html>
  );
}