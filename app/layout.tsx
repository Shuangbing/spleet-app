import { WalletIcon } from "@/components/icons/WalletIcon";
import "./globals.css";
import { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import Link from "next/link";
import { LangueageSelect } from "@/components/ui/langueageSelect";

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
    <html lang={locale}>
      <body className="bg-gray-100 dark:bg-gray-950">
        <header className="flex h-16 w-full items-center justify-between px-4 shadow-sm bg-white dark:bg-gray-900">
          <Link className="flex items-center gap-2" href="/">
            <span className="text-lg font-semibold">Spleet!</span>
          </Link>
          <div className="rounded-full">
            <LangueageSelect locale={locale} />
          </div>
        </header>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
