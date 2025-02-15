"use client"

import { useEffect, useState } from "react";

export default function MediaImage({image_url}:{image_url:string}){
    const [src, setSrc] = useState(' ')
    
    useEffect(()=>{
        async function getImage() {
            const apiUrl = `/products/download?url=${encodeURIComponent(image_url)}`;
            const response = await fetch(apiUrl);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            setSrc(blobUrl)
        }
        getImage();
    },[])
    
    return(
        <img src={src} alt="Bild des Inhalts" className="aspect-square object-cover rounded-xl"/>
    )

}