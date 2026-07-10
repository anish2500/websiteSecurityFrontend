"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTransition, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";
import { LoginData, loginSchema } from "../schema";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
// Import your server action
import { handleLogin, handleMfaChallenge } from "@/lib/actions/auth-action";

export default function LoginForm() {
    const router = useRouter();
    const { checkAuth } = useAuth();
    const [pending, setTransition] = useTransition();
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState(""); // State for backend errors
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const [captchaRequired, setCaptchaRequired] = useState(false); 
    const captchaRef = useRef<ReCAPTCHA>(null);
    const [mfaStep, setMfaStep] = useState(false);
    const [mfaChallengeToken, setMfaChallengeToken] = useState("");
    const [mfaCode, setMfaCode] = useState("");
    const [mfaSubmitting, setMfaSubmitting] = useState(false);


    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginData>({
        resolver: zodResolver(loginSchema),
        mode: "onSubmit",
    });

    // Shared by both the normal login success path and the post-MFA success path -
    // both end up with the same { data: user } shape and need the same redirect logic.
    const finishLogin = async (res: { data?: any }) => {
        console.log('=== LOGIN DEBUG ===');
        console.log('Login response:', res);
        console.log('User data:', res.data);
        console.log('User role:', res.data?.role);
        console.log('Role type:', typeof res.data?.role);

        // Force string comparison with trimming
        const userRole = String(res.data?.role || '').trim();
        console.log('Cleaned role:', `"${userRole}"`);
        console.log('Is admin:', userRole === 'admin');

        toast.success("Login successful! Redirecting...");
        await checkAuth(); // Immediately update AuthContext state

        setTransition(() => {
            // Explicit role check with string conversion
            const isAdmin = userRole === 'admin';
            const redirectPath = isAdmin ? '/admin' : '/dashboard';

            console.log('Final redirect decision:');
            console.log('- isAdmin:', isAdmin);
            console.log('- redirectPath:', redirectPath);

            router.push(redirectPath);
            router.refresh(); // Ensure the layout updates with new auth state
        });
    };

    const onSubmit = async (values: LoginData) => {
        try {
            // 1. Call the backend/server action, attaching the solved CAPTCHA token if we have one
            const res = await handleLogin({ ...values, captchaToken: captchaToken ?? undefined });

            if (!res.success) {
                // 2. Handle failure from backend with toast
                toast.error(res.message || "Invalid email or password");
                if (res.captchaRequired) setCaptchaRequired(true);

                captchaRef.current?.reset();
                setCaptchaToken(null);
                return;
            }
            if (res.mfaRequired) {
                setMfaChallengeToken(res.mfaChallengeToken);
                setMfaStep(true);
                return;
            }

            // 3. Handle success and redirect with toast
            await finishLogin(res);

        } catch (err: any) {
            // 4. Handle unexpected network/code errors with toast
            toast.error("Something went wrong. Please try again.");
        }
    };

    const onSubmitMfaCode = async () => {
        setMfaSubmitting(true);
        try {
            const res = await handleMfaChallenge(mfaChallengeToken, mfaCode);
            if (!res.success) {
                toast.error(res.message || "Invalid code");
                setMfaCode("");
                return;
            }
            await finishLogin(res);
        } finally {
            setMfaSubmitting(false);
        }
    };

    const backToLogin = () => {
        setMfaStep(false);
        setMfaChallengeToken("");
        setMfaCode("");
    };

    if (mfaStep) {
        return (
            <div className="w-full max-w-105 bg-white rounded-2xl shadow-xl px-10 py-12 text-center font-montserrat">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 font-montserrat">Two-Factor Authentication</h2>
                <p className="text-sm text-gray-500 mb-8">
                    Enter the 6-digit code from your authenticator app
                </p>

                <div className="space-y-6">
                    <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        autoFocus
                        value={mfaCode}
                        onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ""))}
                        placeholder="123456"
                        disabled={mfaSubmitting}
                        className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 text-center text-lg tracking-[0.4em] font-mono focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
                    />

                    <button
                        type="button"
                        onClick={onSubmitMfaCode}
                        disabled={mfaSubmitting || mfaCode.length !== 6}
                        className="w-full py-4 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {mfaSubmitting ? "Verifying..." : "Verify & Sign in"}
                    </button>

                    <button
                        type="button"
                        onClick={backToLogin}
                        disabled={mfaSubmitting}
                        className="text-sm text-gray-500 hover:text-gray-700"
                    >
                        Back to login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-105 bg-white rounded-2xl shadow-xl px-10 py-12 text-center font-montserrat">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 font-montserrat">Sign in to your account</h2>
            <p className="text-sm text-gray-500 mb-8">
                Enter your credentials to access your account
            </p>

            {/* Backend Error Alert */}
            {serverError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-left">
                    {serverError}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Email */}
                <div className="text-left">
                    <div className="relative">
                        <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-green-500">
                            email
                        </span>
                        <input
                            type="email"
                            {...register("email")}
                            placeholder="Email address"
                            disabled={isSubmitting || pending}
                            className={`w-full px-5 py-4 rounded-xl border bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400 pl-12 ${
                                errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200'
                            }`}
                        />
                    </div>
                    {errors.email?.message && (
                        <span className="text-red-500 text-sm mt-1 block">{errors.email.message}</span>
                    )}
                </div>

                {/* Password */}
                <div className="text-left">
                    <div className="relative">
                        <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-green-500">
                            lock
                        </span>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            {...register("password")}
                            placeholder="Password"
                            disabled={isSubmitting || pending}
                            className={`w-full px-5 py-4 rounded-xl border bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400 pl-12 pr-12 ${
                                errors.password ? 'border-red-500 bg-red-50' : 'border-gray-200'
                            }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600"
                        >
                            <span className="material-icons">
                                {showPassword ? 'visibility_off' : 'visibility'}
                            </span>
                        </button>
                    </div>
                    {errors.password?.message && (
                        <span className="text-red-500 text-sm mt-1 block">{errors.password.message}</span>
                    )}
                </div>

                {/* CAPTCHA - required on every login attempt */}
             {/* CAPTCHA - only shown once the backend flags the account as under attack */}
{captchaRequired && (
    <div className="flex justify-center">
        <ReCAPTCHA
            ref={captchaRef}
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITEKEY as string}
            onChange={(token) => setCaptchaToken(token)}
            onExpired={() => setCaptchaToken(null)}
        />
    </div>
)}


                {/* Submit */}
        <button
    type="submit"
    disabled={isSubmitting || pending || (captchaRequired && !captchaToken)}

                    className="w-full py-4 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isSubmitting || pending ? (
                        <span className="flex items-center justify-center gap-2">
                             Signing in...
                        </span>
                    ) : "Continue"}
                </button>
            </form>

            <p className="text-sm text-gray-500 mt-6">
                Don't have an account?{' '}
                <Link href="/register" className="text-green-600 font-semibold cursor-pointer hover:underline">
                    Register
                </Link>
            </p>

            <p className="text-sm text-gray-500 mt-2 text-center">
                <Link href="/forget-password" className="text-green-600 font-semibold cursor-pointer hover:text-green-700 flex items-center justify-center gap-1">
                    <span className="material-icons text-sm">lock_open</span>
                    Forgot your password?
                </Link>
            </p>
        </div>
    );
}