"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import Cookies from "js-cookie";

/**
 * Clear stale backend auth when NextAuth is signed out.
 * Explicit Google sign-in components set the backend token themselves.
 */
export default function SessionSync() {
    const { status } = useSession();

    useEffect(() => {
        if (status === "unauthenticated") {
            Cookies.remove("token");
            Cookies.remove("refreshToken");
            localStorage.removeItem("user");
        }
    }, [status]);

    return null;
}
