import { isAdmin } from "../../../../../lib/auth";
import AddProduct from "@/components/AddProduct";

export default async function ProductAdmin(){
    if(!await isAdmin()){
        return(
            <div className="h-[90vh] mt-[10vh]">
                Zugang verweigert, du bist kein Admin
            </div>
        )
    }
    //if user is an admin
    else{
        return(
            <div className="min-h-[90vh] mt-[10vh] flex flex-col px-2 w-full items-center justify-center">
                <h1 className="text-xl font-bold">AdminPage</h1>
                <AddProduct></AddProduct>
            </div>
        )
    }
    
}