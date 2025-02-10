"use client"

import { useEffect, useState } from "react";

export default function SaveButton({ def_state, id }: { def_state: boolean, id: string }) {    
    const [token, setToken] = useState('')
    const [state, setState] = useState(['Lädt', false])
    
    useEffect(()=>{
        async function getToken() {
            const req = await fetch('/csrfToken');
            const data = await req.json();
            const mytoken = data.token;
            setToken(mytoken);
        }
        if(def_state==true){
            setState(['Gespeichert', true])
        }
        else{
            setState(['Speichern!', false])
        }
        getToken();
    },[])

    function handleSubmit(e:any){
        e.preventDefault();
        async function sendData() {
            const res = await fetch('/products/save/',{
                "method": "POST",
                "body": JSON.stringify({token:token, id:id, state: state[1]})
            })
            if(!res.ok){
                throw Error("Error when fetching the data");
            }
            else{
                if(state[1]){
                    setState(['Speichern!', false])
                }
                else{
                    setState(['Gespeichert', true])
                    
                }
            }
        }
        sendData();
    }
    return(
        <form onSubmit={handleSubmit} className="flex z-30 fixed bottom-3 right-4 min-w-[10%] justify-center items-center text-center max-w-fit px-4 py-2 rounded-xl bg-[#008390] font-bold text-white hover:opacity-80">
            <button type="submit">{state[0]}</button>
        </form>
    )
}