import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const requireUser = cache(async () => {
  const supabase = await createClient();

  // getUser(), not getSession(): getSession only decodes the cookie without
  // verifying the signature, and cookies are client-controlled.
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name, phone, avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  const fullName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
    undefined;

  return { user, profile, fullName, avatarUrl: profile?.avatar_url ?? null };
});
