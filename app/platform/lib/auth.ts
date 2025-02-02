import { randomBytes } from "crypto";
function generateSessionID(lenght=32):string{
    return randomBytes(lenght).toString('hex');
}