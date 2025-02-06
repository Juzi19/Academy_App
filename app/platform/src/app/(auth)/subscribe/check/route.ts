import { NextRequest, NextResponse } from "next/server";
import { checkCsrfToken, getUserID } from "../../../../../lib/auth";
import { api } from "../../../../../lib/auth";
import { host } from "../../../../../lib/auth";

export async function POST(req:NextRequest){
    //api interaction logic
    const reqdata = await req.json()
    if(await checkCsrfToken(reqdata.token) == false){
        return NextResponse.json({"message":"CSRF Token validation failed"},{"status":403})
    }
    const userid = await getUserID();
    const priceid = process.env.PRICE_ID;
    const success_url = host + '/payment/success';
    const cancel_url = host + '/payment/cancel';
    const url = api + '/user/new/subscription/'
    const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({user_id: userid, price_id:priceid, success_url:success_url, cancel_url:cancel_url})
    });
    const resdata = await res.json();
    //proceeds if answer is 200, else return error message
    if(res.ok){
        return NextResponse.json({"url": resdata.url}, {"status":200})
    }
    else{
        return NextResponse.json({"url": cancel_url, "message": resdata.message}, {"status": 400})
    }
}