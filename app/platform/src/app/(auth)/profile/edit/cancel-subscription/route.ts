import {  NextResponse } from "next/server";
import { getUserID } from "../../../../../../lib/auth";
import { api } from "../../../../../../lib/auth";
import { host } from "../../../../../../lib/auth";

export async function GET(){
    const user  = await getUserID();
    const res = await fetch(api+'/user/cancel-subscription/', {
        "method": "DELETE",
        "body": JSON.stringify({user_id:user})
    })
    if(res.ok){
        return NextResponse.redirect(new URL("/start/", host))
    }
    else{
        return NextResponse.json({ error: "Error when trying to cancel subscription. Please retry or contact costumer service!" }, { status: 400 })
    }
}