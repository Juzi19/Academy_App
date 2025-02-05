import Link from "next/link"
export default function Success(){
    return(
        <div className="w-full flex h-[100vh] pt-[10vh] text-center items-center justify-center">
            <div className="flex flex-col p-4 w-1/2 bg-white rounded-sm items-center justify-center shadow-[0_2px_6px_9px_rgba(0,0,0,0.1)]">
                <h1 className="my-2 font-bold text-green-500">Email erfolgreich bestätigt!</h1>
                <p>Um die Einrichtung abschließen zu können, schließen Sie bitte die Zahlung ab</p>
                <Link href='/subscribe' className="bg-[#008390] px-4 mt-2 py-2 rounded-xl text-gray-100 font-bold hover:opacity-80">Weiter</Link>
            </div>
        </div>
    )
}