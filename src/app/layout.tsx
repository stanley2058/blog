import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const berkeleyMono = localFont({
  src: "./Berkeley-Mono-Variable.woff2",
  variable: "--font-berkeley-mono",
});

export const metadata: Metadata = {
  title: "Stanley Wang - Blog",
  description: "My personal blog, tech, travel, and random thoughts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={berkeleyMono.variable} suppressHydrationWarning>
      <body className="relative font-mono antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
