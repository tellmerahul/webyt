import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const code = searchParams.get("code");
        
        if (!code) {
            return NextResponse.redirect(new URL('/', request.url));
        }

        // Handle the OAuth callback
        return NextResponse.redirect(new URL('/', request.url));
    } catch (error) {
        console.error('Auth callback error:', error);
        return NextResponse.redirect(new URL('/', request.url));
    }
}