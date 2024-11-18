import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eagle2-app",
  description: "Tu tiempo tambien tiene valor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header></header>
        <main>{children}</main>
        <footer></footer>
      </body>
    </html>
  );
}
