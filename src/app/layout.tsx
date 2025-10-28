import { Geist, Geist_Mono, Vazirmatn } from "next/font/google";
import "./globals.css";
import Layout from "../components/Layout";
import { AuthProvider } from "../contexts/AuthContext";
import PermissionDebugger from "../components/PermissionDebugger";

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

// Metadata is now handled by individual pages

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
        <AuthProvider>
          <Layout>
            {children}
          </Layout>
          <PermissionDebugger />
        </AuthProvider>
      </body>
    </html>
  );
}
