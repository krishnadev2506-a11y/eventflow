import type { Metadata } from "next";
import { Inter, Syne, Orbitron } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { auth } from "@/lib/auth";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EventFlow - Your Universe of Events Awaits",
  description: "A cosmic luxury event booking & management platform.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html
      lang="en"
      className={`${inter.variable} ${syne.variable} ${orbitron.variable} dark`}
      suppressHydrationWarning
    >
      <body 
        className="min-h-screen bg-background text-foreground bg-aurora overflow-x-hidden antialiased"
        suppressHydrationWarning
      >
        <Navbar session={session} />
        <main className="pt-20">
          {children}
        </main>
      </body>
    </html>
  );
}
