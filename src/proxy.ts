import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "./lib/jwt";
import { apiUrl } from "./lib/api";

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Allow login page
    if (pathname === apiUrl("/admin/login")) {
        return NextResponse.next();
    }

    const token = request.cookies.get("auth-session")?.value;

    if (!token) {
        return NextResponse.redirect(
            new URL(apiUrl("/admin/login"), request.url)
        );
    }

    try {
        await jwtVerify(token);
        return NextResponse.next();
    } catch {
        return NextResponse.redirect(
            new URL(apiUrl("/admin/login"), request.url)
        );
    }
}

export const config = {
    matcher: [apiUrl("/admin/:path*"), apiUrl("/admin")],
};