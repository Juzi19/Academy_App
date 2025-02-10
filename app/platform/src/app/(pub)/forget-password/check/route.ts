import { NextRequest, NextResponse } from "next/server";
import { api, host } from "../../../../../lib/auth";
import { checkCsrfToken } from "../../../../../lib/auth";


//checks login credentials
export async function POST(req:NextRequest){
    const reqdata = await req.json();
    const {email, token} = reqdata;
    if(!await checkCsrfToken(token)){
        //if csrf Token isn't valid
        return NextResponse.json({"Access denied": "error"},{"status": 403} );
    }
    try {
        //Sending email and password as json
        const res = await fetch(api + '/user/settings/password-forget/', {
            method: 'POST', // http method post
            headers: {
                'Content-Type': 'application/json', // json format
            },
            body: JSON.stringify({ email: email}) // json data
        });

        if(!res.ok){
            return NextResponse.json({"Error": "Server error"},{"status": 500} );
        }
        else{
            return NextResponse.redirect(new URL('start/', host))
        }

        
    } catch (error) {
        console.error('Error during fetch:', error);
        throw error;
    }
}
