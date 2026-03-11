import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hello World 2",
  description: "Hello World 2 application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
