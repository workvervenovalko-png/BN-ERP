import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME || 'BNCET'} | ${process.env.NEXT_PUBLIC_PORTAL_TYPE || 'ERP & SOC Monitoring Portal'}`,
  description: `Advanced Governance & Security Management for ${process.env.NEXT_PUBLIC_COLLEGE_NAME || 'B.N. College Of Engineering And Technology'}`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Toaster position="top-right" />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
