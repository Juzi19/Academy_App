import { api, getUserID, isAdmin } from "../../../../../../lib/auth";

export default async function DeleteProduct({params}:{params:{id:string}}){
    const {id} = await params;
    const url = api+'/products/'+id.toString()+'/';
    if(await isAdmin()){
        const user = await getUserID();
        const res = await fetch(url, {
            "method": "DELETE",
            "body": JSON.stringify({user_id:user})
        })
        if(res.ok){
            return (
                <div className="min-h-[90vh] w-full flex mt-[10vh]">
                    <h1 className="p-2 font-bold text-green-500">Produkt erfolgreich gelöscht!</h1>
                </div>
            )
        }
        else if(res.status == 404){
            return (
                <div className="min-h-[90vh] w-full flex mt-[10vh]">
                    <h1 className="p-2 font-bold text-yellow-500">Produkt nicht gefunden!</h1>
                </div>
            )
        }
        else{
            return (
                <div className="min-h-[90vh] w-full flex mt-[10vh]">
                    <h1 className="p-2 font-bold text-red-500">Serverfehler</h1>
                </div>
            )
        }
    }
    else
    {
        return (
            <div className="min-h-[90vh] w-full flex mt-[10vh]">
                <h1>Access denied - du bist kein Admin!</h1>
            </div>
        )
    }
}