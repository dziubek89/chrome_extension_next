import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_PATHS = [
  "/",
  "/pricing",
  "/login",
  "/api/auth", // NextAuth routes muszą być publiczne
  "/favicon.ico",
  "/manifest.json",
  "/_next", // Next.js static assets
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Jeśli ścieżka jest publiczna → przepuszczamy

  const isPublic =
    PUBLIC_PATHS.includes(pathname) || // dokładne dopasowanie
    pathname.startsWith("/api/auth") || // NextAuth routes
    pathname.startsWith("/_next");
  if (isPublic) {
    return NextResponse.next();
  }

  // 2. Pobieramy token sesji NextAuth
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  console.log(token);

  // 3. Jeśli użytkownik nie jest zalogowany → redirect do /login
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Obsługa requestów z rozszerzenia Chrome
  const response = NextResponse.next();
  const origin = req.headers.get("origin");
  if (
    origin &&
    origin.startsWith("chrome-extension://mpibnpfjlgfkomhaiblbgaenphedoblh")
  ) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
  }

  return response;
}

// Konfiguracja ścieżek chronionych
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|api/auth|login).*)",
  ],
};

// export const config = {
//   matcher: [
//     // Wszystkie URL-e oprócz publicznych i root '/'
//     "/((?!_next/static|_next/image|favicon.ico|manifest.json|api/auth|login|$).*)",
//   ],
// };
