import type { Metadata, Viewport } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: `${APP_NAME} | ${APP_TAGLINE}`, template: `%s | ${APP_NAME}` },
  description: `${APP_NAME} is a Nigerian online store for phones, laptops, electronics, fashion and home essentials, priced in Naira.`,
};

export const viewport: Viewport = { themeColor: "#15803d", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG" data-theme="nairamart">
      <body className={`flex min-h-screen flex-col bg-base-200/40 text-base-content`}>
        <Navbar />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
