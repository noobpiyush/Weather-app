import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Weather app for Mumbai"
  description: "Weather forecasts, nowcasts and history in a fast and elegant way",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <html lang="en">
      
      <body className={inter.className}>
        <Providers >
          {children}
        </Providers>

      </body>
    </html>
  );
}
