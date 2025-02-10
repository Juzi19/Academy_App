import redis from "./redis";
import { cookies } from "next/headers";

export const api = 'http://127.0.0.1:8000';
export const host = 'http://127.0.0.1:3000';

interface Session_Information {
    session_valid: number,
    user_id: null | number,
    isadmin: boolean,
    csrf_token: string,
    csrf_valid: number
}

//starting a new session
export async function startSession(){
    //generates a unique session id
    const session_id = await generateUniqueSessionID();
    //generates information for the new session saved in redis
    const session_information:Session_Information = {
        session_valid: generateSessionValid(),
        //changes when users sign in
        user_id: null,
        isadmin: false,
        csrf_token: await generateCsrfToken(),
        csrf_valid: generateCsrfValidity() 
    }
    const user_cookies:any = await cookies()
    const expires = new Date(session_information.session_valid);

    //set secure to true in production
    user_cookies.set('session', session_id, {expires,httpOnly:true, sameSite:'strict', secure: false})

    await redis.set(session_id,session_information);
    await redis.expire(session_id, 2*60*60);
}

export async function extendSession(old_session_id:string, session_information:Session_Information):Promise<string> {
    //extending the session validy
    session_information.session_valid = generateSessionValid();
    await redis.del(old_session_id)
    //gets a new session id and saves it to redis
    const session_id = await generateUniqueSessionID();
    await redis.set(session_id, session_information);
    await redis.expire(session_id, 2*60*60);
    return session_id
}

//decides whether it's necessary to start a new session
export async function decideSession() {
    const user_cookies = await cookies();
    const session_id = user_cookies.get('session')?.value??null;
    //if there's no session running
    if(session_id===null){
        //start a new session
        await startSession();
    }
    else{
        //check the existing session for expiry
        const session_information:Session_Information | null = await redis.get(session_id);
        if(session_information === null){
            console.log('Error connecting to redis or potential session hijacking attack')
        }
        else{
            //checks for session validy, renews it if necessary (new session 20 min before end)
            if(session_information.session_valid-Date.now() <= 20*60*1000){
                //extending the current session
                const new_session_id:string = await extendSession(session_id, session_information)
                user_cookies.delete('session');
                user_cookies.set('session', new_session_id, {expires:new Date(session_information.session_valid),httpOnly:true, sameSite:'strict', secure: false})
            }
            //csrf token validy should get checked when requesting it
        }
        
    }
}

//checks a csrfToken for forms
export async function checkCsrfToken(csrfToken:string):Promise<boolean| undefined> {
    const user_cookies = await cookies();
    const session_id = user_cookies.get('session')?.value??null;
    if(session_id!=null){
        //request csrf Token
        const session_information:Session_Information | null= await redis.get(session_id);
        //checks if token is valid
        if(session_information === null){
            console.log("Error when connecting to redis")
        }
        else{
            //checks if token are identical
            return(session_information.csrf_token == csrfToken)
        }
    }
}

//returns csrf token if valid
export async function getCsrfToken(): Promise<string | undefined> {
    const user_cookies = await cookies();
    const session_id = user_cookies.get('session')?.value??null;
    if(session_id!=null){
        //request csrf Token
        const session_information:Session_Information | null= await redis.get(session_id);
        //checks if token is valid
        if(session_information === null){
            console.log("Error when connecting to redis")
        }
        else{
            //checking csrf token for validy
            if(session_information.csrf_valid - Date.now() <= 15*60*1000){
                //renewing csrf token
                session_information.csrf_token = await generateCsrfToken();
                session_information.csrf_valid = generateCsrfValidity();
                await redis.del(session_id)
                await redis.set(session_id, session_information)
            }
            return session_information.csrf_token;

        }
        
    }
}

//signin function
export async function signin(user_id:number, isadmin=false) {
    const user_cookies = await cookies();
    const session_id = user_cookies.get('session')?.value??null;
    if(session_id!=null){
        const session_information: Session_Information | null = await redis.get(session_id);
        if (!session_information){
            console.log("Error connecting to redis");
        }
        else{
            //saving user id to the session id
            session_information.user_id = user_id;
            session_information.isadmin = false;
            redis.set(session_id, session_information);
        }
    }
}

//checks if user is logged in
export async function isloggedIn() {
    const user_cookies = await cookies();
    const session_id = user_cookies.get('session')?.value??null;
    if(session_id!=null){
        const session_information: Session_Information | null = await redis.get(session_id);
        if (!session_information){
            console.log("Error connecting to redis");
        }
        else{
            //checks if user is logged in
            if(session_information.user_id!=null){
                return true
            }
            else{
                return false
            }
        }
    }
}

//User ID
export async function getUserID():Promise<null | number> {
    const user_cookies = await cookies();
    const session_id = user_cookies.get('session')?.value??null;
    if(session_id!=null){
        const session_information: Session_Information | null = await redis.get(session_id);
        if (!session_information){
            console.log("Error connecting to redis");
        }
        else{
            //checks if user is logged in
            if(session_information.user_id!=null){
                return session_information.user_id
            }
        }
    }
    return null
}

export async function logout() {
    const user_cookies = await cookies();
    const session_id = user_cookies.get('session')?.value??null;
    if(session_id!=null){
        const session_information: Session_Information | null = await redis.get(session_id);
        if (!session_information){
            console.log("Error connecting to redis");
        }
        else{
            //saving user id = null to the session id
            session_information.user_id = null;
            session_information.isadmin = false;
            redis.set(session_id, session_information);
        }
    }
}



//Generates timestamp 2 hours from now
function generateSessionValid():number{
    return(Date.now() + 2*60*60*1000);
}
//generates csrfToken validity 40min from now
function generateCsrfValidity():number{
    return(Date.now()+40*60*1000)
}
async function generateCsrfToken():Promise<string>{
    return(await generateRandomStrings())
}
//generates a truly unique session id
async function generateUniqueSessionID(): Promise<string> {
    const randomPart = await generateRandomStrings();
    const timestamp = Date.now().toString(16);
    return `${randomPart}-${timestamp}`;
}
async function generateRandomStrings():Promise<string>{
    const buffer = new Uint8Array(32); // Byte-Array erstellen
    const randomValues = crypto.getRandomValues(buffer); // Web Crypto API für zufällige Werte

    return Array.from(randomValues).map(byte => byte.toString(16).padStart(2, "0")).join('');
}
