import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Avalanche Atlas",
  description: "Report and view recent avalanche incidents",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
