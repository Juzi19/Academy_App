import ProductCard from "@/components/productcard";
import { api, getUserID } from "../../../../../lib/auth";
export default async function SearchPage({searchParams}:{searchParams:{searchname?: string}}) {
    //getting the search parameter
    const params = await searchParams;
    const searchname = params.searchname;
    const url = api + '/products/search/'
    const user_id = await getUserID();
    //message displayed to the user
    let message = '';
    const res = await fetch(url, {
        "method": "POST",
        "body": JSON.stringify({user_id:user_id, search_name: searchname})
    });
    if(!res.ok){
        return(
            <div className="flex w-full h-[90vh] mt-[10vh] items-center justify-center">
                <h1 className="text-red-500 font-bold text-xl">Serverfehler</h1>
            </div>
        )
    }
    else{
        const {products}:{products: [string, number, string, string][]} = await res.json();
        if(products.length === 0){
            message = 'Keine Ergebnisse gefunden!'
        }
        return (
            <div className="w-full mt-[10vh] min-h-[90vh] flex items-center flex-col">
                <h1 className="my-2 text-xl">Suchergebnisse für: <span className="font-bold">{searchname}</span></h1>
                <div className="w-full flex justify-start">
                    <p className="w-full text-center text-l text-gray-500"> {message}</p>
                    {products.map((product:[string, number, string, string])=>{
                        return <ProductCard key={product[1]} name={product[0]} id={product[1]} image_url={product[2]} description={product[3]}/>
                    })}
                </div>
            </div>
        )
    }
    
}