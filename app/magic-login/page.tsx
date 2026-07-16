"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { handleMagicLogin } from "@/lib/actions/auth-action";
import { useAuth } from "@/context/AuthContext";

export default function MagicLoginPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { checkAuth } = useAuth();
    const [status, setStatus] = useState<"loading" | "error">("loading");

    useEffect(() => {
        const token = searchParams.get("token");
        if (!token) {
            setStatus("error");
            toast.error("Missing login link token");
            return;
        }
        (async () => {
            const res = await handleMagicLogin(token);
            if (!res.success) {
                setStatus("error");
                toast.error(res.message || "Login link is invalid or expired");
                return;
            }
            toast.success("Logged in!");
            await checkAuth();
            const role = String(res.data?.role || '').trim();
            router.push(role === 'admin' ? '/admin' : '/dashboard');
        })();
    }, [searchParams, router, checkAuth]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            {status === "loading"
                ? <p>Logging you in...</p>
                : <p>This login link is invalid or has expired. <a href="/login" className="text-green-600 underline">Back to login</a></p>}
        </div>
    );
}
