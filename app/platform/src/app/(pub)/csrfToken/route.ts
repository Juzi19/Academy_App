import { NextRequest, NextResponse } from "next/server";
import { getCsrfToken } from "../../../../lib/auth";

export async function GET(req: NextRequest) {
    const token = await getCsrfToken();
    return NextResponse.json({"token": token})
}