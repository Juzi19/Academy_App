import { getUserID, isAdmin } from "../../../../../lib/auth"
import { api } from "../../../../../lib/auth";
import DownloadButton from "@/components/DownloadButton";
import SaveButton from "@/components/SaveButton";
import DeleteButton from "@/components/DeleteButton";
import MediaImage from "@/components/MediaImage";

export default async function SingleProduct({params}:{params:Promise<{id:string}>}){
    const {id} = await params;
    const url = api + '/products/'+id+'/';
    const userid = await getUserID();
    const res = await fetch(url, {
        "method": "POST",
        "body": JSON.stringify({user_id:userid})
    })
    const isadmin = await isAdmin();
    //return Error page, if necessary
    if(!res.ok){
        return(<div className="min-h-[90vh] w-full mt-[10vh]">
            <p>Serverfehler</p>
        </div>)
    }
    const data = await res.json();
    const {name, description, saved, image_url} = data;
    let {file_url}  =data;
    //specifying url paths
    file_url = file_url;
    


    return(
        <div className="w-full mt-[10vh] flex flex-col items-center justify-center p-2">
            <div className="flex items-center w-full min-h-[50vh]">
                <h1 className="w-1/2 text-2xl font-bold">{name}</h1>
                <div className="w-1/2 p-2">
                    <MediaImage image_url={image_url}></MediaImage>
                </div>
            </div>
            <hr className="h-1 bg-[#008390] p-[2px] w-full"/>
            <div className="mt-4 min-h-[40vh] flex flex-col items-center justify-center">
                <p className="text-center">{description}</p>
                <div className="mt-4">
                    <DownloadButton fileUrl={file_url} />
                </div>
            </div>
            <SaveButton def_state={saved} id={id} ></SaveButton>
            <div className={`${isadmin?'contents':'hidden'}`}>
            <DeleteButton id={id}></DeleteButton>
            </div>
            

            
        </div>
    )
}