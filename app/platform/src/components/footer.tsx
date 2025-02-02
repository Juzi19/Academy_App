import Link from "next/link"

export default function Footer(){
    return(
        <div className="relative text-gray-100 bg-[#008390] flex w-full h-[15vh] items-center flex-col justify-center text-center">
            <Link href='/imprint' className="p-1 hover:opacity-80">Impressum</Link>
            <Link href='/contact' className="p-1 hover:opacity-80">Kontakt</Link>
        </div>
    )
}