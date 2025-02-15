"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function Login(){
    //using router to redirect client
    const [message, setMessage] = useState('')
    const router = useRouter();
    const [token, setToken] = useState('')
    
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
        const target = e.target as HTMLFormElement;
        const email = (target["email"] as HTMLInputElement).value;
        const password = (target["password"] as HTMLInputElement).value;
        async function sendData() {
            const res = await fetch('login/check', {
                method:'POST',
                headers: {
                    'Content-Type': 'application/json', // json format
                },
                body: JSON.stringify({ email: email, password: password, token:token }) // json data
            })
            //Checks for success
            if (!res.ok) {
                setMessage('Falsche E-Mail / Passwort')
            }
            else
            {
                const data = await res.json(); // converts answer to json
                const success = data.status;
                if(success){
                    //Dirty fix for router problem in production
                    router.refresh();
                    router.push('/start')
                }
                else{
                    setMessage('Falsche E-Mail / Passwort')
                }
            }
            
        }
        // Call sendData to actually send the request
        sendData();
    }
    return(
        <div className="relative w-full h-[100vh] bg-[url('/login-bg.jpg')] bg-cover bg-center flex justify-center items-center flex-col ">
            <form action="POST" onSubmit={handleSubmit} className="flex flex-col p-4 bg-white rounded-sm items-center justify-center shadow-[0_2px_6px_9px_rgba(0,0,0,0.1)]">
                <h2 className="w-full pl-2 text-xl">Login</h2>
                <small className="w-full pl-2">Für die Academy App anmelden</small>
                <p className="text-sm text-red-700 p-1">{message}</p>
                <label htmlFor="email" className="w-full text-left pl-2">Email:</label>
                <input type="email" name="email" id="email" className="m-2 px-1 border-[#008390] border-2 min-w-[25vw]"/>
                <label htmlFor="password" className="w-full text-left pl-2">Passwort:</label>
                <input type="password" name="password" id="password" className="m-2 px-1 border-[#008390] border-2 min-w-[25vw]"/>
                <input type="submit" value="Login" className="bg-[#008390] m-1 p-1 px-3 rounded-xl text-white hover:opacity-80"/>
                <Link href='/forget-password/' className="text-sm font-bold mt-2 hover:opacity-80">Passwort vergessen?</Link>
            </form>
            
        </div>
    )
}