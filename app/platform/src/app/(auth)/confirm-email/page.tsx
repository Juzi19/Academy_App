"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ConfirmEmail(){
    const [token, setToken] = useState('');
        const [message, setMessage] = useState('');
        const router = useRouter();
    
        useEffect(()=>{
            async function getToken() {
                const req = await fetch('/csrfToken');
                const data = await req.json();
                const token = data.token;
                setToken(token);
            }
            getToken();
        },[])

        function handleSubmit(e:React.FormEvent<HTMLFormElement>){
            e.preventDefault();
    
            const form = e.currentTarget;
    
            const pin = form["pin"].value;
        
            async function sendData() {
                const res = await fetch('confirm-email/check',{
                    method:'POST',
                    headers: {
                        'Content-Type': 'application/json', // json format
                    },
                    body: JSON.stringify({pin:pin, token:token})
                })
                if(res.status==403){
                    setMessage('Pin falsch')
                }
                else if(res.status==200){
                    router.push('/confirm-email/success')
                }
                else if(!res.ok){
                    setMessage('Serverfehler')
                }
            }
            sendData();
    }
    return(
        <div className="flex w-full mt-[10vh] pt-4 h-[90vh] items-center justify-center">
            <form action="POST" onSubmit={handleSubmit} className="flex flex-col p-4 bg-white rounded-sm items-center justify-center shadow-[0_2px_6px_9px_rgba(0,0,0,0.1)]">
                <h1 className="my-2">Bitte geben Sie Ihren Bestätigungspin ein, welche Sie per Email erhalten haben:</h1>
                <p className="text-red-500">{message}</p>
                <input type="number" name="pin" id="pin" className="my-2 px-1 border-[#008390] border-2" required/>
                <button type="submit" className="bg-[#008390] px-4 py-2 text-gray-100 font-bold rounded-xl hover:opacity-80 m-2">Email bestätigen!</button>
            </form>
        </div>
    )
}