import { WalletIcon } from "@/components/icons/WalletIcon";
import "./globals.css";
import { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import Link from "next/link";
import { LangueageSelect } from "@/components/ui/langueageSelect";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export const metadata: Metadata = {
  title: "Spleet!",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between px-4 bg-background/80 backdrop-blur-md border-b border-border/40 shadow-sm">
            <Link 
              className="flex items-center gap-2 transition-all duration-300 hover:scale-105" 
              href="/"
            >
              <WalletIcon className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Spleet!
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <LangueageSelect locale={locale} />
              <ThemeToggle />
            </div>
          </header>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-background to-muted/20">
              {children}
            </div>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
