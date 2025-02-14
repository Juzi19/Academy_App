import { NextResponse } from "next/server";
import { getCsrfToken } from "../../../../lib/auth";

export async function GET() {
    const token = await getCsrfToken();
    return NextResponse.json({"token": token})
}