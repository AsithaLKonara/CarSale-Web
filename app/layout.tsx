import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UltraDrive | Premium Supercar Sales",
  description: "Experience the pinnacle of automotive engineering. Curated selection of Koenigsegg, Lamborghini, McLaren and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
