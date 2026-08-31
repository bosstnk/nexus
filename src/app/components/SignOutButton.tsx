"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { LogOutIcon } from "./icons";
import { createClient } from "../lib/supabase/client";

export default function SignOutButton() {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Supabase signOut failed:", error.toJSON());
      setSigningOut(false);
      return;
    }

    router.replace("/login");
    // Without refresh() the Router Cache still holds the rendered, signed-in
    // RSC payload — pressing Back would show a signed-out user their own data.
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={signingOut}
      aria-label="ออกจากระบบ"
      title="ออกจากระบบ"
      className={clsx(
        "grid size-9 shrink-0 place-items-center rounded-lg transition-colors",
        signingOut
          ? "cursor-not-allowed text-neutral-300"
          : "cursor-pointer text-neutral-500 hover:bg-neutral-100 hover:text-danger",
      )}
    >
      <LogOutIcon size={20} className={clsx(signingOut && "animate-pulse")} />
    </button>
  );
}
