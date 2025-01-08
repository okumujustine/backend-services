import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TanstackProvider } from "@/components/providers/tanstack-provider";


export const metadata: Metadata = {
  title: "Backend Services",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TanstackProvider>
              {children}
            </TanstackProvider>
          </ThemeProvider>
        </body>
    </html>
  );
}
