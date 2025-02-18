"use client"

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function SignUp(){
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

    //submitting the form
    function handleSubmit(e:React.FormEvent<HTMLFormElement>){
        e.preventDefault();

        const form = e.currentTarget;

        const username = form["username"].value;
        const email = form["email"].value;
        const birthday = form["birthday"].value;
        const password = form["password"].value;
        const passwordRepeat = form["password-repeat"].value;
        const billingName = form["billing_name"].value;
        const billingStreetNumber = form["billing_street_number"].value;
        const billingCity = form["billing_city"].value;
        const billingZIP = form["billing_ZIP"].value;
        const billingCountry = form["billing_country"].value;


        

        async function sendData() {
            const res = await fetch('signup/check',{
                method:'POST',
                headers: {
                    'Content-Type': 'application/json', // json format
                },
                body: JSON.stringify({username:username, email: email,birthday, password: password, token:token, billing_name: billingName, billing_street_number:billingStreetNumber, billing_city: billingCity, billing_ZIP: billingZIP, billing_country: billingCountry })
            })
            if(res.status==400){
                setMessage('Email ungültig')
            }
            else if(res.status==200){
                router.push('/confirm-email')
            }
            else if(!res.ok){
                setMessage('Serverfehler')
            }
        }

        if(password!=passwordRepeat){
            setMessage('Passwörter sind nicht gleich!')
        }
        else if(password.length < 8){
            setMessage('Passwort muss länger als 8 Zeichen sein')
        }
        else{
            sendData();
        }
        
    }

    return(
        <div className="flex mt-[10vh] w-full min-h-[100vh] flex-col items-center justify-center py-4">
            <form onSubmit={handleSubmit} className="flex flex-col my-4 px-[10%] py-4 rounded-xl ring-1 ring-gray-200  shadow-lg shadow-gray-400">
                <h1 className="mb-4 font-bold">Neues Profil erstellen:</h1>
                <p className="text-red-500">{message}</p>
                <label htmlFor="username">Benutzername:</label>
                <input type="text" name="username" id="username" className="border-2 border-[#008390] my-1 px-1" required/>
                <label htmlFor="email">Email:</label>
                <input type="email" name="email" id="email" className="border-2 border-[#008390] my-1 px-1" required/>
                <label htmlFor="birthday">Geburtstag</label>
                <input type="date" name="birthday" id="birthday" className="border-2 border-[#008390] my-1 px-1" required/>
                <label htmlFor="password">Passwort:</label>
                <input type="password" name="password" id="password" className="border-2 border-[#008390] my-1 px-1" required/>
                <label htmlFor="password-repeat">Passwort wiederholen:</label>
                <input type="password" name="password-repeat" id="password-repeat" className="border-2 border-[#008390] my-1 px-1" required/>
                <h2 className="my-1 font-bold">Rechnungsinformationen</h2>
                <label htmlFor="billing_name">Name:</label>
                <input type="text" name="billing_name" id="billing_name" className="border-2 border-[#008390] my-1 px-1" required/>
                <label htmlFor="billing_street_number">Straße und Hausnummer</label>
                <input type="text" name="billing_street_number" id="billing_name_number" className="border-2 border-[#008390] my-1 px-1" required/>
                <label htmlFor="billing_city">Ort:</label>
                <input type="text" name="billing_city" id="billing_city" className="border-2 border-[#008390] my-1 px-1" required/>
                <label htmlFor="billing_ZIP">Postleitzahl:</label>
                <input type="text" name="billing_ZIP" id="billing_ZIP" className="border-2 border-[#008390] my-1 px-1" required/>
                <label htmlFor="billing_country">Land:</label>
                <input type="text" name="billing_country" id="billing_country" className="border-2 border-[#008390] my-1 px-1" required/>
                <input type="submit" value="Konto erstellen" className="my-1 mt-2 px-2 py-1 bg-[#008390] text-gray-100 font-bold rounded-xl hover:opacity-80" required/>
            </form>
        </div>
    )
}