import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Allowlist, not a protected list: a new page is private by default, so
// forgetting to register it here cannot expose it.
const PUBLIC = [
  "/login",
  "/signup",
  "/signup-success",
  "/confirm-email",
  "/auth",
];
const AUTH_ONLY = ["/login", "/signup"];

const HOME = "/";

const matches = (pathname: string, routes: string[]) =>
  routes.some((r) => pathname === r || pathname.startsWith(`${r}/`));

function redirectPreservingCookies(
  request: NextRequest,
  from: NextResponse,
  pathname: string,
) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";

  const redirect = NextResponse.redirect(url);
  // Carry over any Set-Cookie the refresh produced. A bare redirect drops them,
  // which turns the /login <-> / bounce into a redirect loop.
  from.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  return redirect;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Update the request so the RSC render in this same pass sees the
          // refreshed token, then rebuild the response from it, then attach
          // Set-Cookie so the browser stores the rotated pair.
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // No code — especially no await — between createServerClient and getUser().
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (!user && !matches(pathname, PUBLIC)) {
    return redirectPreservingCookies(request, supabaseResponse, "/login");
  }

  if (user && matches(pathname, AUTH_ONLY)) {
    return redirectPreservingCookies(request, supabaseResponse, HOME);
  }

  // Must be this exact object: when the token was refreshed, the rotated
  // token pair exists ONLY in its Set-Cookie headers. Returning a fresh
  // NextResponse drops them and logs the user out at random.
  return supabaseResponse;
}
