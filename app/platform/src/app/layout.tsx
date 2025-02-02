import type { Metadata } from "next";
import "./globals.css";
import Head from "next/head";
import Header from "@/components/header";
import Footer from "@/components/footer";

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
        <header>
          <Header></Header>
        </header>
        <main className="relative flex">
          {children}
        </main>
        <footer>
          <Footer></Footer>
        </footer>
        
      </body>
    </html>
  );
}
