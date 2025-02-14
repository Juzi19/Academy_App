"use client"
import { useState, useEffect } from "react";
import { FormEvent } from "react";

export default function Subscribe(){
    const [token, setToken] = useState('')
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

    function handleSubmit(e:FormEvent<HTMLFormElement>){
        e.preventDefault();
        async function sendData() {
            const res = await fetch('subscribe/check/',{
                method: "POST",
                headers: {
                    'Content-Type': 'application/json', // json format
                },
                body: JSON.stringify({token:token})
            });
            const data = await res.json();
            if (res.ok){
                window.open(data.url, '_blank')
            }
            else{
                setMessage(data.message);
            }
        }
        sendData();
    }

    return(
        <div className="flex w-full h-[90vh] mt-[10vh] justify-center items-center flex-col">
            <form onSubmit={handleSubmit} className="flex items-center justify-center flex-col bg-white rounded-sm p-4 shadow-[0_2px_6px_9px_rgba(0,0,0,0.1)]">
                <h1 className="font-bold">Erhalten Sie Zugang zur Academy App für 2 € pro Monat.</h1>
                <p>{message}</p>
                <input type="submit" value="Weiter zur Zahlung" className="mt-4 bg-[#008390] font-bold text-gray-100 px-4 py-2 rounded-xl hover:opacity-80"/>
            </form>
        </div>
    )
}