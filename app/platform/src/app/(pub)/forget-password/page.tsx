"use client"
import { useState, useEffect } from "react";

export default function ForgetPassword(){

    const [token, setToken] = useState('');
    const [message, setMessage] = useState('')
        
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
        const email = e.target["email"].value;
        async function sendData() {
            const res = await fetch('forget-password/check/', {
                method:'POST',
                headers: {
                    'Content-Type': 'application/json', // json format
                },
                body: JSON.stringify({ email: email, token:token }) // json data
            })
            if(!res.ok){
                setMessage('Fehler beim Senden der Email')
            }
            
        }
        // Call sendData to actually send the request
        sendData();
    }


    return(
        <div className="min-h-[90vh] mt-[10vh] w-full flex flex-col items-center justify-center">
            <form onSubmit={handleSubmit} className="flex flex-col my-4 px-[10%] py-4 rounded-xl ring-1 ring-gray-200  shadow-lg shadow-gray-400 w-3/4 text-center">
                <p>Bitte geben Sie Ihre E-Mail Adresse ein, um Informationen zur Passwortwiederherstellung zu erhalten!</p>
                {message}
                <label htmlFor="email" className="mt-2 font-bold">Email:</label>
                <input type="email" name="email" id="email" className="border-2 border-[#008390] px-1 my-2" />
                <button type="submit" className="bg-[#008390] text-gray-100 font-bold rounded-xl px-4 py-2 my-1 hover:opacity-80">Senden!</button>
            </form>
        </div>
    )
}