import Link from "next/link";
import MediaImage from "./MediaImage";
type Product = {
    name: string;
    id: number;
    description: string;
    image_url: string;
  };

export default function ProductCard({ name, id, description, image_url }: Product){
    const url = '/products/' + id;
    const desc = description.length > 30 
    ? description.slice(0, description.lastIndexOf(" ", 30)) + "..." 
    : description;
    return(
        <div className="flex sm:w-fit sm:max-w-[25%] p-2 max-w-[70%] ">
            <Link href={url} className="flex flex-col p-2 border-gray-400 border-2 rounded-xl justify-center items-center hover:opacity-80 text-center">
                <div className="w-[80%]">
                    <MediaImage image_url={image_url}></MediaImage>
                </div>
                <h1 className="font-bold mt-1">{name}</h1>
                <p className="text-gray-700">{desc}</p>
            </Link>
        </div>
        
    )
}