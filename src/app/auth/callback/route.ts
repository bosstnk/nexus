import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "../../lib/supabase/server";

// Only same-origin relative paths — blocks ?next=https://evil.com
function safeNext(raw: string | null) {
  return raw && raw.startsWith("/") && !raw.startsWith("//")
    ? raw
    : "/signup-success";
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const next = safeNext(searchParams.get("next"));
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, origin));
    console.error("exchangeCodeForSession failed:", error.message);
  }

  const failed = new URL(next, origin);
  failed.searchParams.set(
    "error",
    searchParams.get("error_code") ??
      searchParams.get("error") ??
      "exchange_failed",
  );
  return NextResponse.redirect(failed);
}
