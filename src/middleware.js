// import { NextResponse } from "next/server";

// export async function middleware(req) {
//     const url = req.nextUrl.clone();
//     const host = req.headers.get("host");
//     const subdomain = host?.split(".")[0];
//     console.log("URL: ", url, subdomain);

//     if (subdomain === "www" || subdomain === process.env.NEXT_PUBLIC_BASE_DOMAIN || url.pathname.endsWith("/not-found")) {
//         return NextResponse.next();
//     }

//     const isValid = await isValidSlug(subdomain);
//     if (!isValid) {
//         return NextResponse.redirect(new URL(`${url.protocol}//${process.env.NEXT_PUBLIC_BASE_DOMAIN}/not-found`));
//     }

//     const encodedSubdomain = encodeURIComponent(subdomain);
//     return NextResponse.rewrite(new URL(`/Channel/${encodedSubdomain}${url.pathname}`, req.url));
// }


// async function isValidSlug(slug) {
//     if (!slug) return false;
//     let clients = [];
//     try {
//         const response = await fetch(`${process.env.NEXT_PUBLIC_FULL_BASE_DOMAIN}/api/user`, {
//             method: 'GET',
//         });
//         const res = await response.json();
//         if (res.success) {
//             clients = res.data.map(client => encodeURIComponent(client.channelName));
//             return clients.includes(slug);
//         } else {
//             console.error(`Error in response: ${res.message}`);
//             return false;
//         }
//     } catch (err) {
//         console.error(`Error finding channels in db: ${err.message}`);
//         return false;
//     }
// }


// export const config = {
//     matcher: [
//         '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//         '/(api|trpc)(.*)',
//     ],
// };
import { NextResponse } from "next/server";

export async function middleware(req) {
    try {
        const url = req.nextUrl.clone();
        const host = req.headers.get("host");
        const subdomain = host?.split(".")[0];
        console.log("Middleware:", { url: url.toString(), host, subdomain });

        // Skip middleware for these paths
        if (url.pathname.startsWith('/_next') || 
            url.pathname.startsWith('/api') || 
            url.pathname.includes('/static') ||
            url.pathname.includes('.')) {
            return NextResponse.next();
        }

        // Handle root domain
        if (subdomain === "www" || host === process.env.NEXT_PUBLIC_BASE_DOMAIN) {
            return NextResponse.next();
        }

        const isValid = await isValidSlug(subdomain);
        if (!isValid) {
            return NextResponse.redirect(new URL('/not-found', req.url));
        }

        // Rewrite to channel page
        return NextResponse.rewrite(new URL(`/Channel/${subdomain}`, req.url));
    } catch (error) {
        console.error("Middleware error:", error);
        return NextResponse.next();
    }
}

async function isValidSlug(slug) {
    if (!slug) return false;
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_FULL_BASE_DOMAIN}/api/user?name=${slug}`);
        const data = await response.json();
        return data.success;
    } catch (err) {
        console.error("isValidSlug error:", err);
        return false;
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};