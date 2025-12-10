import type { Metadata } from "next";
import "./globals.css";
import Head from "next/head";


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
    <html lang="de">
      <Head>
        <link rel="icon" href="/a-icon.png" type="image/png" />
      </Head>
      <body>
        <div className="relative flex">
          {children}
        </div>        
      </body>
    </html>
  );
}
