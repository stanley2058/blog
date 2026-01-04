import { Ubuntu_Mono } from "next/font/google";
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const berkeleyMono = localFont({
  src: "./Berkeley-Mono-Variable.woff2",
  variable: "--font-berkeley-mono",
});
const ubuntuMono = Ubuntu_Mono({
  weight: ["400", "700"],
  style: "normal",
  subsets: ["latin"],
  variable: "--font-ubuntu-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${berkeleyMono.variable} ${ubuntuMono.variable}`}
      suppressHydrationWarning
    >
      <body className="relative font-mono antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
