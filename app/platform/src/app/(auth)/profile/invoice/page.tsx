import { api, getUserID } from "../../../../../lib/auth"
import Link from "next/link";

//Information for each invoice submitted by stripe
type Invoice = {
    id:string,
    amount_due: number,
    status:string,
    pdf_url:string,
    created:number
}

export default async function Invoices() {

    //converts Unix Timestamp(used in the invoice) to d.m.yyy
    function formatUnixTimestamp(timestamp: number): string {
        const date = new Date(timestamp * 1000); // Convert to milliseconds
        const day = date.getDate();
        const month = date.getMonth() + 1; // Months are 0-based
        const year = date.getFullYear();
    
        return `${day}.${month}.${year}`;
    }

    //api url to get user invoice data
    const url = api + '/user/invoices/';
    const user = await getUserID();
    //fetching invoices from the api
    const res = await fetch(url, {
        "method": "POST",
        "body": JSON.stringify({user_id:user})
    })
    if(res.ok){
        const {invoices} = await res.json();
        return(
            <div className="w-full min-h-[90vh] mt-[10vh] flex-col px-2">
                <h1 className="font-bold text-xl pb-2">Rechnungen:</h1>
                {/*Create an invoice element for each invoice */}
                {invoices.map((i:Invoice)=>{
                    return(
                        <Link key={i.id} href={i.pdf_url} className="flex flex-row underline sm:no-underline hover:underline">
                            Rechnung vom {formatUnixTimestamp(i.created)} über {i.amount_due}€
                        </Link>
                    )
                })}
            </div>
        )
    }
    else{
        return(
            <div className="w-full min-h-[90vh] mt-[10vh]">
                <h1>Serverfehler beim Laden der Daten</h1>
            </div>
        )
    }
    
}