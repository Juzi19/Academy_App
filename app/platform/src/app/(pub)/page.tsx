import Link from "next/link";
export default function Home() {
  return (
    <div>
        <div className="w-[100vw] p-2 text-gray-100 items-center text-xl  min-h-[100vh] pt-[10vh] flex flex-col-reverse sm:flex-row relative bg-[#008390] justify-center">
          <div className="sm:w-1/2 w-full text-center">
            <h1>Erhalten Sie Zugriff zu <span>100+</span> verschiedenen Lernmitteln zu <span>Informatik</span>.</h1>
            <h2>Von Algorithmik bis zu IT Security - boosten Sie Ihre Kenntnisse 🚀</h2>
          </div>
          <div className="w-1/2 flex sm:justify-end pr-6 text-4xl font-bold sm:text-start text-center mb-6">
            <h1>Academy App</h1>
          </div>
        </div>
        
        <div className="flex py-16 px-2 sm:flex-row flex-col">
          <p className="sm:w-1/2 w-full flex justify-center items-center text-center">In der Academy App erhalten Sie Zugriff zu mehr als 100 verschieden Papers rund um die Informatik. Von Machine Learning bis hin zu web development oder IT Security. Hier ist garantiert etwas für Sie dabei.</p>
          <div className="sm:w-1/2 w-full flex justify-center sm: mt-6">
            <div className="w-3/4 flex bg-gray-600 rounded-xl flex-col text-gray-100 px-2 py-5 justify-center items-center text-center">
              <h1 className="text-2xl pb-1">Academy App</h1>
              <h2 className="text-xs"><span className="text-3xl font-bold">2€</span> pro monat</h2>
              <p className="py-2">Der Academy Zugang ermöglicht Ihnen uneingeschränkten Zugriff auf alle unsere Lerninhalte.</p>
              <Link href='/signup' className="p-2 bg-[#008390] rounded-xl hover:opacity-80">Registrieren</Link>
            </div>
          </div>
        </div>
        
    </div>
  );
}
