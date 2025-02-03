import Link from "next/link"
export default function LogoutView(){
    return(
        <div  className="flex flex-col w-full h-[100vh] items-center p-4 justify-center">
            <p className="py-2">Logout erfolgreich</p>
            <Link href='/' className="px-4 py-2 bg-[#008390] text-gray-100 font-bold rounded-xl opacity-80">Home</Link>
        </div>
    )
}