"use client";

import { useProfile, useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { ROUTES, PROTECTED_ROUTES, GUEST_ROUTES } from "@/constants/routes";
import { useEffect } from "react";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, ready } = useAuth();
  useProfile();

  useEffect(() => {
    if (!ready) return;

    const isProtected = PROTECTED_ROUTES.includes(pathname);
    const isGuestOnly = GUEST_ROUTES.includes(pathname);

    if (isProtected && !user) {
      router.replace(ROUTES.LOGIN);
    } else if (isGuestOnly && user) {
      router.replace(ROUTES.HOME);
    }
  }, [ready, user, pathname, router]);

  return <>{children}</>;
}
