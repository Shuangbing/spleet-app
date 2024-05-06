import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WalletIcon } from "@/components/icons/WalletIcon";
import { MenuIcon } from "@/components/icons/MenuIcon";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Spleet!",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-100 dark:bg-gray-950">
        <div className="flex w-full flex-col">
          <header className="flex h-16 w-full items-center justify-between bg-white px-4 shadow-sm dark:bg-gray-900">
            <Link className="flex items-center gap-2" href="#">
              <WalletIcon className="h-6 w-6" />
              <span className="text-lg font-semibold">Spleet!</span>
            </Link>
            <Button size="icon" variant="ghost">
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
