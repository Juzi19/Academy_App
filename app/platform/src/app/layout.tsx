import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Academy App",
  description: "Get acces to programming resources",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
