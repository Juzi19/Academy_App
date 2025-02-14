import { NextResponse } from "next/server";
import { logout } from "../../../../lib/auth";
import { host } from "../../../../lib/auth";
export async function GET(){
    await logout();
    return NextResponse.redirect(host + '/logout/view/');
}