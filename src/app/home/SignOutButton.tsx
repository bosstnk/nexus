"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../components/Button";
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
    <Button
      variant="outline"
      size="large"
      block
      className="mt-8"
      loading={signingOut}
      onClick={handleSignOut}
    >
      ออกจากระบบ
    </Button>
  );
}
