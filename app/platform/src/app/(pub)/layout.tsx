import type { Metadata } from "next";
import Header from "@/components/header";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Academy App",
  description: "Get acces to programming resources",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div lang="de">
      <div className="w-[100vw]">
        <header>
          <Header></Header>
        </header>
        <main className="relative flex">
          {children}
        </main>
        <footer>
          <Footer></Footer>
        </footer>
        
      </div>
    </div>
  );
}
