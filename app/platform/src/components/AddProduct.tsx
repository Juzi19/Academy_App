"use client"
import { useState, useEffect, useRef } from "react";
export default function AddProduct(){
    const [token, setToken] = useState('')
    const [message, setMessage] = useState('')
    const formRef = useRef<HTMLFormElement>(null); 
    
    const resetForm = () => {
        formRef.current?.reset(); // Resets the form
    };

    useEffect(()=>{
        async function getToken() {
            const req = await fetch('/csrfToken');
            const data = await req.json();
            const token = data.token;
            setToken(token);
        }
        getToken();
    },[])

    function handleSubmit(e:any){
        e.preventDefault();

        const formData = new FormData();
        formData.append("token", token);
        formData.append("name", e.target["name"].value);
        formData.append("description", e.target["description"].value);
        formData.append("img", e.target["img"].files[0]);
        formData.append("file", e.target["file"].files[0]);

        async function sendData() {
            const res = await fetch('/products/admin/add', {
                method:'POST',
                body: formData
            })
            //Checks for success
            if (!res.ok) {
                setMessage('Fehler')
            }
            else
            {
                setMessage('Produkt erfolgreich erstellt');
                resetForm();
            }
        }
        // Call sendData to actually send the request
        sendData();

    }
    return (
        <div className="py-4 items-center justify-center w-full flex">
            <form onSubmit={handleSubmit} className="flex flex-col p-4 bg-white rounded-sm items-center justify-center shadow-[0_2px_6px_9px_rgba(0,0,0,0.1)] w-fit" ref={formRef}>
                {message}
                <label htmlFor="name">Name:</label>
                <input type="text" name="name" id="name" className="m-2 px-1 border-[#008390] border-2 min-w-[25vw]" required/>
                <label htmlFor="description">Beschreibung:</label>
                <textarea name="description" id="description" className="m-2 px-1 border-[#008390] border-2 min-w-[25vw]" required></textarea>
                <input type="file" name="img" id="img" accept="image/png, image/jpeg, image/svg+xml" className="mt-2" required/>
                <input type="file" name="file" id="file" className="m-2" required/>
                <input type="submit" value="Produkt erstellen!" className="bg-[#008390] m-1 p-1 px-3 rounded-xl text-white hover:opacity-80"/>
            </form>
        </div>
    )
}