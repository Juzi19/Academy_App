import Link from "next/link"
export default function Start(){
    return(
        <div>
            <h1 className="w-full h-[100vh] flex items-center justify-center">Start</h1>
            <Link href='/profile' className="p-2 font-bold mr-1 hover:opacity-80 h-full flex"><svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    width="60" 
                    height="60" 
                    fill="currentColor"
                    className="mt-[20%] rounded-full p-[6px] bg-gray-300"
                    >
                    <circle cx="12" cy="8" r="4"/>
                    <path d="M4 20c0-4 4-6 8-6s8 2 8 6"/>
            </svg>
            </Link>
        </div>
        
    )
}