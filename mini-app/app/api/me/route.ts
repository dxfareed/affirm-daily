import { isAuthenticated } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const authResult = await isAuthenticated(req);

    if (authResult instanceof NextResponse) {
        return authResult;
    }

    // authResult is the fid (number)
    return NextResponse.json({ fid: authResult, valid: true });
}
