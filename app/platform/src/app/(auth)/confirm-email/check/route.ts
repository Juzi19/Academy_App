import { NextRequest, NextResponse } from "next/server";
import { checkCsrfToken } from "../../../../../lib/auth";
import { api } from "../../../../../lib/auth";
import { getUserID } from "../../../../../lib/auth";

export async function POST(req: NextRequest){
    const data = await req.json();
    const {pin, token} = data;
    const url = api + '/user/new/confirm-email/';
    const user:number|null = await getUserID();
    if(user&&(await checkCsrfToken(token))){
        const res = await fetch(url,{
            method: 'POST', // http method post
            headers: {
                'Content-Type': 'application/json', // json format
            },
            body: JSON.stringify({user_id:user, pin:pin}) // json data
        });
        if(res.status == 200){
            return new NextResponse(JSON.stringify({success: true}),{
                status:200
            })
        }
        else if(res.status == 403){
            return new NextResponse(JSON.stringify({success: false}),{
                status:403
            })
        }else{
            return new NextResponse(JSON.stringify({success: false}),{
                status:500
            })
        }

    }

}