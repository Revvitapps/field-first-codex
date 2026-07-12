import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { PwaRegister } from "@/components/pwa-register";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FieldFirst",
  description: "Field-first construction operating system prototype",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "FieldFirst",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[var(--ink-950)] text-[var(--sand-50)]">
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
