"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import Cookies from "js-cookie";

/**
 * SessionSync handles keeping the traditional "token" cookie
 * in sync with the NextAuth session.
 * This ensures the Express backend and AuthContext remain compatible.
 */
export default function SessionSync() {
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "authenticated" && session?.accessToken) {
            // Sync to Cookies for Express backend and AuthContext compatibility
            const existingToken = Cookies.get("token");
            
            if (existingToken !== session.accessToken) {
                console.log("[Nyle Travel] Syncing NextAuth session to backend token...");
                Cookies.set("token", session.accessToken, { expires: 7 });
                
                // Also set user in localStorage if AuthContext expects it 
                // (Looking at AuthContext, it mostly relies on the token for checkUser)
                if (session.user) {
                    localStorage.setItem("user", JSON.stringify({
                        id: session.user.id,
                        name: session.user.name,
                        email: session.user.email,
                        image: session.user.image,
                        // role is intentionally omitted — this is a customer-facing
                        // app; admin access is enforced by the backend, not here.
                    }));
                }
                
                // Force a reload or a context refresh if needed? 
                // For now, let's just let the app pick it up on next navigation or refresh.
                // window.location.reload(); 
            }
        } else if (status === "unauthenticated") {
            // NextAuth has no active session — clear any stale token/user data that
            // was left behind from a previous Google sign-in so the AuthContext does
            // not auto-restore the backend session on refresh.
            Cookies.remove("token");
            Cookies.remove("refreshToken");
            localStorage.removeItem("user");
        }
    }, [session, status]);

    return null;
}
