import Link from "next/link";
import { api } from "../../lib/auth";

type Product = {
    name: string;
    id: number;
    description: string;
    image_url: string;
  };

export default function ProductCard({ name, id, description, image_url }: Product){
    const url = '/products/' + id;
    image_url = api + image_url;
    console.log("Image url",image_url)
    const desc = description.length > 30 
    ? description.slice(0, description.lastIndexOf(" ", 30)) + "..." 
    : description;
    return(
        <div className="flex w-fit max-w-[25%] p-2">
            <Link href={url} className="flex flex-col p-2 border-gray-400 border-2 rounded-xl justify-center items-center hover:opacity-80">
                <img src={image_url} alt="Bild des Inhalts" className="w-[80%] aspect-square object-cover rounded-xl"/>
                <h1 className="font-bold">{name}</h1>
                <p className="text-gray-700">{desc}</p>
            </Link>
        </div>
        
    )
}