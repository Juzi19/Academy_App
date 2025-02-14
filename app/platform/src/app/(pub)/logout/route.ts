import { NextResponse } from "next/server";
import { logout } from "../../../../lib/auth";
import { host } from "../../../../lib/auth";
export function GET(){
    logout();
    return NextResponse.redirect(host + '/logout/view/');
}