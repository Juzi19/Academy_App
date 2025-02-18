import Link from "next/link"
import { logout } from "../../../../../lib/auth"

export default async function SubscribeSuccess(){
    await logout()
    return(
        <div className="flex w-full h-[90vh] mt-[10vh] justify-center items-center flex-col">
            <div className="flex max-w-[60%] items-center text-center justify-center flex-col bg-white rounded-sm p-4 shadow-[0_2px_6px_9px_rgba(0,0,0,0.1)]">
                <h1 className="font-bold text-green-500">Vielen Dank für Ihr Vertrauen! Die Vorgang wurde erfolgreich bearbeitet! Bitte melden Sie sich nun an!</h1>
                <Link href='/start' className="mt-4 bg-[#008390] font-bold text-gray-100 px-4 py-2 rounded-xl hover:opacity-80">Login</Link>
            </div>
        </div>
    )
}