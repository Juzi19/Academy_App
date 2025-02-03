import { NextRequest, NextResponse } from "next/server";
import { logout } from "../../../../lib/auth";
import { host } from "../../../../lib/auth";
export function GET(req:NextRequest){
    logout();
    return NextResponse.redirect(host + '/logout/view/');
}