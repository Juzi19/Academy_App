"use client"
import { useState } from "react"
import Link from "next/link";
export default function DeleteButton({id}:{id:string|number}){
    const [link_visible, setLink_visible]=useState(false)
    function handleClick(){
        setLink_visible(true);
    }
    const url = '/products/'+id.toString()+'/delete/'
    return(
        <div className="fixed bottom-3 left-4 w-fit p-4 rounded-xl bg-red-400 flex flex-col items-center z-30">
            <button onClick={handleClick} className="bg-gray-100 rounded-xl font-bold px-3 py-1 hover:bg-gray-200">Löschen</button>
            <Link href={url} className={`${link_visible?'flex':'hidden'} px-3 py-1 my-1 mx-1 mb-0 bg-gray-100 rounded-xl font-bold hover:bg-gray-200`}>Bestätigen</Link>
        </div>
    )
}