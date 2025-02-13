import { api, getUserID } from "../../../../lib/auth"
import ProductCard from "@/components/productcard";

export default async function AllProducts(){
    const url = api + '/products/all/';
    const user = await getUserID();
    const res = await fetch(url, {
        "method": "POST",
        "body": JSON.stringify({user_id:user})
    });
    if(!res.ok){
        return(
            <div className="w-full h-[90vh] mt-[10vh]">
                <h1>Serverfehler</h1>
            </div>
        )
    }
    const {products} = await res.json();

    return(
        <div className="w-full min-h-[90vh] mt-[10vh] flex items-center flex-col my-4">
            {/*Maping a product card for each product */}
            {products.map((product:[string, number, string, string])=>{
                return(
                    <ProductCard key={product[1]}  name={product[0]} id={product[1]} image_url={product[2]} description={product[3]} />
                )
            })}
        </div>
    )
}