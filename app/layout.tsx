import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import Sidebar from "./(ui)/sidebar.module";

config.autoAddCss = false;
const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s - Lyric Kit",
    default: "Lyric Kit",
  },
  description: "A one-stop-shop for everything lyrics!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} antialiased`}>
        <Sidebar />
        <main className="flex-1 ml-10">
          {children}
        </main>
      </body>
    </html>
  );
}
