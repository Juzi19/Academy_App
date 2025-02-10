import { NextRequest, NextResponse } from "next/server";
import { checkCsrfToken, getUserID } from "../../../../../lib/auth";
import { api } from "../../../../../lib/auth";

export async function POST(req:NextRequest) {
    const {id, token, state} = await req.json();
    const user = await getUserID();
    if(await checkCsrfToken(token)){
        if (id!=undefined && state!=undefined){
            let res:Response;
            //if element is saved, remove it
            if(state){
                res = await fetch(api+'/products/save/', {
                    "method": "DELETE",
                    "body": JSON.stringify({user_id:user, id:id})
                })
            }
            else{
                //add element to the saved elements
                res = await fetch(api+'/products/save/', {
                    "method": "POST",
                    "body": JSON.stringify({user_id:user, id:id})
                })
            }
            if(!res.ok){
                return NextResponse.json({"message": "Error when fetching the data"}, {"status":500})
            }
            else{
                return NextResponse.json({"message": "Successfully edited the saved state"}, {"status": 200})
            }
        }
    }
    else{
        return NextResponse.json({"message": "CSRF Token validation failed"}, {"status":400})
    }

}