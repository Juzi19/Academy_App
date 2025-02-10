import { api, getUserID } from "../../../../lib/auth"
import Link from "next/link";
export default async function Profile(){
    const user = await getUserID();
    const res = await fetch(api+'/user/settings/personal/', {
        "method": "POST",
        "body": JSON.stringify({user_id: user})
    })
    if(res.ok){
        const {name}=await res.json();
        return(
            <div className="w-full flex-col h-[100vh] flex items-center justify-center">
                <h1 className="font-bold">Hallo {name}</h1>
                <p>Wir freuen uns, dass du Kunde der Academy App bist.</p>
                <div className="mt-2">
                    <Link href='/profile/edit/' className="bg-[#008390] py-2 px-4 text-gray-100 hover:opacity-80 font-bold rounded-xl">Profil bearbeiten</Link>
                </div>
            </div>
        )
    }
    else{
        throw Error("Error when fetching data")
    }

}