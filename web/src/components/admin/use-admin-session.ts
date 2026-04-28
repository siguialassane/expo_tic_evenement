"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

export function useAdminSession() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) {
        return;
      }

      if (!session) {
        router.replace("/admin/login");
        return;
      }

      setUserEmail(session.user.email ?? "");
      setCheckingAuth(false);
    });

    return () => {
      isMounted = false;
    };
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  return {
    checkingAuth,
    userEmail,
    handleLogout,
  };
}