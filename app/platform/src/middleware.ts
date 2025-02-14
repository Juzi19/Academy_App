import { NextRequest, NextResponse } from "next/server";
import { decideSession, isloggedIn } from "../lib/auth";
import { host } from "../lib/auth";

export async function middleware(req: NextRequest){    
    //decides whether to start or proceed on an existing session
    await decideSession();

    const { pathname } = req.nextUrl;
    //auth middleware for protected parts of the page
    if(pathname.startsWith('/profile')|| pathname.startsWith('/start')||pathname.startsWith('/products')||pathname.startsWith('/confirm-email')||pathname.startsWith('/subscribe')){
        //using authMiddleware ontop, to check if user is authenticated
        if(! await authMiddleware()){
            return NextResponse.redirect(host + '/login/')
        }
    }

    const response = NextResponse.next();

    //securityheaders
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set(
        "Strict-Transport-Security",
        "max-age=31536000; includeSubDomains; preload"
    );
    response.headers.set(
        "Content-Security-Policy",
        `
        default-src 'self';
        script-src 'self' trusted-scripts.example.com;
        style-src 'self' 'unsafe-inline';
        img-src 'self' data:;
        connect-src 'self' api.example.com;
        `.replace(/\s{2,}/g, " ") // removes unnecessary chars
    );

    //handles request normally
    return NextResponse.next();
}

export async function authMiddleware() {
    if(await isloggedIn()){
        return true
    }
    else{
        return false
    }
}


export const config = {
    runtime: 'nodejs',
    matcher: ['/', '/(login|start|profile|products|confirm-email|signup|subscribe|payment)(.*)']  };