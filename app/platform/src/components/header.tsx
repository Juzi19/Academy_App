import Link from "next/link"
export default function Header(){
    return(
        <div className="z-50 bg-white fixed flex w-full h-[10vh] justify-center items-center">
            <div className="flex h-full w-1/2 pl-1 justify-start items-center text-2xl">
            {/* Link-Komponente von Next.js mit einem a-Tag als Wrapper */}
            <Link href="/" className="flex w-fit h-full items-center">
                <img src="/a-icon.png" alt="A Icon" className="h-[60%]" />
            </Link>
            <Link href='/' className="font-bold font-sans pl-1 hover:opacity-80 hidden ml-2 sm:contents">Academy App</Link>
            </div>
            <div className="flex w-1/2 items-center justify-end">
                <Link href='/login/check' className="p-2 font-bold mr-1 hover:opacity-80">Login</Link>
                <Link href='/signup' className="p-2 text-white font-bold bg-black rounded-xl mr-1 hover:opacity-80">Registrieren</Link>
            </div>
        </div>
    )
}