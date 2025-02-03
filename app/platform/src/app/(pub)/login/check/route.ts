import { NextRequest, NextResponse } from "next/server";
import { api } from "../../../../../lib/auth";
import { signin } from "../../../../../lib/auth";
import { isloggedIn } from "../../../../../lib/auth";
import { host } from "../../../../../lib/auth";
import { checkCsrfToken } from "../../../../../lib/auth";


//checks login credentials
export async function POST(req:NextRequest){
    const reqdata = await req.json();
    const {email, password, token} = reqdata;
    const requesturl:string = api+'/user/check-credentials/';
    if(!checkCsrfToken){
        //if csrf Token isn't valid
        return NextResponse.error();
    }
    try {
        //Sending email and password as json
        const res = await fetch(requesturl, {
            method: 'POST', // http method post
            headers: {
                'Content-Type': 'application/json', // json format
            },
            body: JSON.stringify({ email: email, password: password }) // json data
        });

        //Checks for success
        if(res.status == 404){
            return NextResponse.json({status:false});
        }
        else if (!res.ok) {
            throw new Error('Failed to check credentials');
        }

        const data = await res.json(); // converts answer to json
        const success = data.login;
        const id = data.id;
        const isadmin = data.admin;
        if(success){
            //saves status to redis
            signin(id, isadmin)
            //redirects to start
            return NextResponse.json({status: true})
        }
        else{
            return NextResponse.json({status:false});
        }
    } catch (error) {
        console.error('Error during fetch:', error);
        throw error;
    }
}
//When logged in, return start page directly else login page
export async function GET(req:NextRequest){
    return NextResponse.redirect(host + '/start/');

}