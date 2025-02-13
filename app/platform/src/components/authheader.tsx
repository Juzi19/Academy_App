"use client"
import Link from "next/link"
import { useRouter } from "next/navigation";

export default function Authheader(){
    const router = useRouter();

    //redirecting user to the proper get url
    function handleSubmit(e:any){
        e.preventDefault();
        const searchparams = e.target.elements.search.value;
        router.push('/products/search?searchname='+searchparams)
    }

    return(
        <div className="z-50 bg-white fixed flex w-full h-[10vh] justify-center items-center">
            <div className="flex h-full w-1/2 pl-1 justify-start items-center text-2xl">
                <a href="/start" className="flex w-fit h-full items-center"><img src="/a-icon.png" alt="A Icon" className="h-[60%]"/></a>
                <Link href='/start/' className="font-bold font-sans pl-1 hover:opacity-80 hidden ml-2 sm:contents ml-1">Academy App</Link>
            </div>
            <div className="flex flex-row h-full ">
                <form action="POST" onSubmit={handleSubmit} className="flex h-full items-center justify-center">
                    {/*need to add csrf token*/}
                    <input type="text" name="search" id="search" placeholder='Inhalt suchen...' className="px-2 py-1 border-2 border-[#008390] rounded-sm"/>
                    <input type="submit" className="ml-2 bg-[#008390] text-gray-100 px-2 py-1 rounded-xl "  value="Los" />
                </form>
            </div>
            <div className="flex w-1/2 items-center justify-end">
            <Link href='/logout' className="px-4 hover:opacity-80">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            </Link>
            

            </div>
        </div>
    )
}