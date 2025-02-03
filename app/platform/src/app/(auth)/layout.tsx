import Authheader from "@/components/authheader";
import Footer from "@/components/footer";
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div className="w-[100vw] flex flex-col">
        <header>
          <Authheader></Authheader>
        </header>
        <main className="relative flex">
          {children}
        </main>
        <footer className="w-full">
          <Footer></Footer>
        </footer>
        
      </div>
    </div>
  );
}
