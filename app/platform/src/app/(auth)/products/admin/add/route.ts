import { NextRequest, NextResponse } from "next/server";
import { api, checkCsrfToken, getUserID } from "../../../../../../lib/auth";


export async function POST(req:NextRequest) {
    try {
        const formData = await req.formData();

        const token = formData.get("token") as string;
        formData.delete("token")
        const user = await getUserID();
        if (user) {
            formData.append("user_id", user.toString());  
        } else {
            throw new Error("User-ID konnte nicht abgerufen werden.");
        }

        if (!await checkCsrfToken(token)){
            throw new Error("falscher csrf token")
        }
        const res = await fetch(api+'/products/new/', {
            "method": "POST",
            "body": formData
        })
        if(res.ok){
            return NextResponse.json({message: "Produkt erstellt" }, {status:200});
        }
        else{
            return NextResponse.json({message: "Fehler beim Erstellen des Produkts" }, {status:500});

        }


    } catch (error) {
        console.error("Fehler beim Verarbeiten der Anfrage:", error);
        return NextResponse.json({ success: false, message: "Fehler beim Verarbeiten der Anfrage" }, { status: 500 });
    }
    
}