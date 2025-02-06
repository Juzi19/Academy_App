import { NextRequest, NextResponse } from "next/server";
import { api } from "../../../../../lib/auth";
import { checkCsrfToken } from "../../../../../lib/auth";
import { signin } from "../../../../../lib/auth";

export async function POST(req:NextRequest) {
    const data = await req.json();
    const {
        username,
        email,
        birthday,
        password,
        billing_name,
        billing_street_number,
        billing_city,
        billing_ZIP,
        billing_country,
        token
    } = data;
    const url = api+'/user/new/';
    if(!checkCsrfToken(token)){
            //if csrf Token isn't valid
            return NextResponse.error();
    }
    try{
        //Sending email and password as json
        const res = await fetch(url, {
            method: 'POST', // http method post
            headers: {
                'Content-Type': 'application/json', // json format
            },
            body: JSON.stringify({name:username, email: email, password: password, age:birthday,billing_name:billing_name, billing_street_number:billing_street_number, billing_city:billing_city, billing_ZIP:billing_ZIP,billing_country:billing_country }) // json data
        });
        const resdata = await res.json();
        console.log(resdata)

        //redirecting and saving id to client
        if(res.status==200){
            //sign user in (redis)
            signin(resdata.id);
            //Redirecturl
            return new NextResponse(JSON.stringify({mes: true}),{
                status:200
            })
        }
        else if(res.status == 400){
            //email already in use
            return new NextResponse(JSON.stringify({error: "Email already in use"}),{
                status:400
            })
        }
    }
    //Error response when trying to fetch data from the backend api
    catch{
        return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}