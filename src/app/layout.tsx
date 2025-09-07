import type { Metadata } from "next";
import { Geist, Geist_Mono, Vazirmatn } from "next/font/google";
import "./globals.css";
import Layout from "../components/Layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "گیت هید - پلتفرم مدیریت پروژه",
  description: "پلتفرم مدیریت پروژه و همکاری تیمی برای تیم‌های توسعه نرم‌افزار",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className="dark">
      <body
        className={`${vazirmatn.variable} ${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  );
}
