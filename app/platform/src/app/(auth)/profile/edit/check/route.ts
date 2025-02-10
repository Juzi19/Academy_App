import { api, getUserID } from "../../../../../../lib/auth";
import { checkCsrfToken } from "../../../../../../lib/auth";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req:NextRequest) {
    const user = await getUserID();
    const reqdata = await req.json();
        const {new_password, current_password,username, token} = reqdata;
        if(!await checkCsrfToken(token)){
            //if csrf Token isn't valid
            return NextResponse.error();
        }
        const res = await fetch(api+'/user/settings/personal/',{
            "method": "PUT",
            "body": JSON.stringify({password:new_password, previous_password:current_password, name:username, user_id:user})
        })
        if(!res.ok){
            //if server responds an error
            return NextResponse.json({ error: "Message" }, { status: 400 })
        }
        else{
            return NextResponse.json({},{"status": 200})
        }
}