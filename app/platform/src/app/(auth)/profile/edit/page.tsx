"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MouseEventHandler } from "react";

export default function EditProfile(){
    const [token, setToken] = useState('');
    const [message, setMessage] = useState('');

    const router = useRouter();
    
    //next js compiles components so that a regular links would log the user out every time
    const handleLogout: MouseEventHandler<HTMLDivElement> = (event) => {
        event.preventDefault(); 
        router.push('/profile/edit/cancel-subscription/' );
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

    function handleSubmit(e:React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        const username = (target["username"] as HTMLInputElement).value;
        const current_password = (target["current_password"] as HTMLInputElement).value;
        const new_password = (target["new_password"] as HTMLInputElement).value;
        const new_password2 = (target["new_password2"] as HTMLInputElement).value;
        if(new_password!=new_password2){
            setMessage("Passwörter sind nicht gleich");
            return
        }
        if(username == '' && current_password==''){
            setMessage("Bitte entweder username und/oder Passwort Feld ausfüllen")
            return
        }
        if(new_password.length < 8 && new_password.length > 0){
            setMessage("Passwort zu kurz!")
            return
        }

        async function sendData() {
            const res = await fetch('edit/check/', {
                method:'POST',
                headers: {
                    'Content-Type': 'application/json', // json format
                },
                body: JSON.stringify({ username: username, new_password: new_password, token:token, current_password: current_password }) // json data
            })
            //Checks for success
            if (!res.ok) {
                setMessage('Fehler beim Verabeiten der Eingaben. Falsches Passwort')
            }
            else
            {
                setMessage("Daten erfolgreich geändert")
            }
            }
            
        // Call sendData to actually send the request
        sendData();
    }

    return(
        <div className="min-h-[90vh] mt-[10vh] w-full flex flex-col items-center justify-center">
            <form onSubmit={handleSubmit} className="flex flex-col my-4 px-[10%] py-4 rounded-xl ring-1 ring-gray-200  shadow-lg shadow-gray-400">
                <h2 className="font-bold text-gray-500">{message}</h2>
                <h2 className="font-bold my-1">Benutzernamen ändern: </h2>
                <input type="text" name="username" id="username" className="border-2 border-[#008390] my-1 px-1"/>
                <h2 className="font-bold my-1">Passwort ändern:</h2>
                <label htmlFor="current_password">Aktuelles Passwort:</label>
                <input type="password" name="current_password" id="current_password" className="border-2 border-[#008390] my-1 px-1" />
                <label htmlFor="new_passwort">Neues Passwort:</label>
                <input type="password" name="new_password" id="new_password" className="border-2 border-[#008390] my-1 px-1" />
                <label htmlFor="new_password">Neues Passwort wiederholen:</label>
                <input type="password" name="new_password2" id="new_password2" className="border-2 border-[#008390] my-1 px-1" />
                <button type="submit" className="bg-[#008390] text-gray-100 font-bold rounded-xl px-4 py-2 my-1 hover:opacity-80">Senden!</button>
            </form>
            <div onClick={handleLogout}>
                <p className="mt-8 bg-red-500 font-bold text-gray-100 px-4 py-2 rounded-xl hover:opacity-80">Abonnement kündigen</p>
            </div>
        </div>
    )
}