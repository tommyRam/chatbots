"use client";

import { useCallback } from "react";
import { useRouter } from "next/router";

export default function useAuthError() {
    const router = useRouter();

    const handleAuth401Error = useCallback( () => {
        if (localStorage.getItem("access_token")){
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
        }

        router.push("auth/login");
    }, [router])

    return {handleAuth401Error};
}