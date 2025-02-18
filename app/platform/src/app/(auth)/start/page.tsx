import Link from "next/link"
import { api } from "../../../../lib/auth"
import { getUserID } from "../../../../lib/auth"
import ProductCard from "@/components/productcard";
export default async function Start(){
    const url = api + '/products/start/';
    const userid = await getUserID();
    const res = await fetch(url, {
        "method": "POST",
        "body": JSON.stringify({"user_id": userid})
    })
    //If errors occur
    if (res.status == 400 || res.status == 405){
        return(
            <div className="w-full h-[100vh] pt-[10vh] justify-center items-center">
                <h1>Fehler, evtl. sind Sie nicht subscribed!</h1>
            </div>
        )
    }
    else{
        try{
            
            const data = await res.json();                
            

            const { products = [], username, email, subscribed} = data;
            

            //if there's no information available
            if (!Array.isArray(products) || products.length === 0) {
                console.log("rückgabe")
                return(
                    <div className="w-full flex h-[90vh] mt-[10vh] flex-col">
                        <div className="flex flex-row items-center">
                            <h1 className="p-2 font-bold text-2xl">Hallo {username}!</h1>
                            <Link href='/profile' className="p-2 font-bold ml-auto mr-1 hover:opacity-80 flex"><svg 
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
                        <div className="flex flex-col  mt-[30vh] font-bold justify-center w-full items-center">
                            <p className="mb-2 text-center">Starte deine Suche nach Produkten, um loszulegen!</p>
                            <Link href='/products/' className="bg-[#008390] px-4 py-2 text-gray-100 font-bold rounded-xl hover:opacity-80">Alle Produkte</Link>
                        </div>
                    </div>
                )
            }

            //previously viewed is first element in list
            const prev_viewed = products.shift();
            
            let saved = 'Gepeichert:';
            if (products.length===0){
                saved='';
            }

        return(
            <div className="w-full flex min-h-[90vh] mb-8 mt-[10vh] flex-col">
                <div className="flex flex-col w-full">
                    <div className="flex items-center">
                        <h1 className="px-2 font-bold text-xl">Hallo {username}</h1>
                        <Link href='/profile' className="p-2 font-bold ml-auto mr-1 hover:opacity-80 flex"><svg 
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

                    <div>
                        {!email?<div><Link href='confirm-email'>Email bestätigen</Link></div>:''}
                        {!subscribed?<div><Link href='subscribe'>Abonnieren</Link></div>:''}
                    </div>
                    <div className="sm:text-start text-center w-full">
                        <h2 className="px-2 font-bold">Zuletzt angesehen:</h2>
                    </div>
                    <div className="max-w-full min-w-full flex flex-col sm:flex-row items-center">
                        <ProductCard name={prev_viewed[0]} id={prev_viewed[1]} image_url={prev_viewed[2]} description={prev_viewed[3]}></ProductCard>
                    </div>
                    <div className="sm:text-start text-center w-full">
                        <h2 className="px-2 font-bold">{saved}</h2>
                    </div>
                    <div className="max-w-full min-w-full flex flex-col sm:flex-row items-center">
                        {/*Maping a product card for each product */}
                        {products.map((product:[string, number, string, string])=>{
                            return(
                                <ProductCard key={product[1]} name={product[0]} id={product[1]} image_url={product[2]} description={product[3]} />
                            )
                        })}

                    </div>
                    <div className="w-full flex mt-[6vh] justify-center text-center">
                        <Link href='/products/' className="bg-[#008390] min-w-[25%] max-w-fit px-4 py-2 text-gray-100 font-bold rounded-xl hover:opacity-80">Alle Produkte</Link>
                    </div>

                </div>
                
            </div>
            )
        }
        catch (e){
            if(e){
                return(
                    <div className="min-h-[90vh] mt-[10vh] flex items-center justify-center w-full p-2 flex-col">
                        <Link href='confirm-email' className="bg-[#008390] min-w-[25%] max-w-fit px-4 py-2 text-gray-100 font-bold rounded-xl hover:opacity-80 text-center mb-1">Email bestätigen</Link>
                        <Link href='subscribe' className="bg-[#008390] min-w-[25%] max-w-fit px-4 py-2 text-gray-100 font-bold rounded-xl hover:opacity-80 text-center mt-1">Abonnieren</Link>
                    </div>
                )
            }
            
        }
    
    }
    
}