"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { RegisterData, registerSchema } from "../schema";
import { toast } from "react-toastify";
// Import your server action
import { handleRegister } from "@/lib/actions/auth-action";

export default function RegisterForm() {
    const router = useRouter();
    const [pending, setTransition] = useTransition();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [serverError, setServerError] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterData>({
        resolver: zodResolver(registerSchema),
        mode: "onSubmit",
    });

    const onSubmit = async (values: RegisterData) => {
        setServerError("");
        setShowSuccess(false);

        try {
            // 1. Call the backend server action
            const res = await handleRegister(values);

            if (!res.success) {
                // 2. Handle failure from backend with toast
                toast.error(res.message || "Registration failed");
                return;
            }

            // 3. Handle success with toast
            toast.success("Registration successful! Redirecting to login...");
            setTransition(() => {
                // Redirecting to login after success
                setTimeout(() => {
                    router.push("/login");
                }, 2000);
            });

        } catch (err: any) {
            toast.error("An unexpected error occurred. Please try again.");
        }
    };

    const togglePasswordVisibility = (field: 'showPassword' | 'showConfirm') => {
        if (field === 'showPassword') {
            setShowPassword(!showPassword);
        } else {
            setShowConfirm(!showConfirm);
        }
    };

    return (
        <div
            className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-8"
            style={{ backgroundImage: "url('/images/signupbg.jpg')" }}
        >
            <div className="w-full max-w-105 bg-white rounded-2xl shadow-xl px-10 py-12 text-center font-montserrat">
                
                {/* Status Messages */}
                {showSuccess && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
                        Registration successful! Redirecting to login page...
                    </div>
                )}
                {serverError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-left">
                        {serverError}
                    </div>
                )}

                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Sign up to your account
                </h2>
                <p className="text-sm text-gray-500 mb-8">
                    Enter your personal data to create your account
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Full Name */}
                    <div className="text-left">
                        <div className="relative">
                            <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-green-500">
                                person
                            </span>
                            <input
                                type="text"
                                {...register("fullName")}
                                placeholder="Full name"
                                disabled={isSubmitting || pending}
                                className={`w-full px-5 py-4 rounded-xl border bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400 pl-12 ${
                                    errors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-200'
                                }`}
                            />
                        </div>
                        {errors.fullName?.message && (
                            <span className="text-red-500 text-sm mt-1 block">{errors.fullName.message}</span>
                        )}
                    </div>

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
                                onClick={() => togglePasswordVisibility('showPassword')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
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

                    {/* Confirm Password */}
                    <div className="text-left">
                        <div className="relative">
                            <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-green-500">
                                lock_clock
                            </span>
                            <input
                                type={showConfirm ? 'text' : 'password'}
                                {...register("confirmPassword")}
                                placeholder="Confirm password"
                                disabled={isSubmitting || pending}
                                className={`w-full px-5 py-4 rounded-xl border bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400 pl-12 pr-12 ${
                                    errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-200'
                                }`}
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('showConfirm')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                            >
                                <span className="material-icons">
                                    {showConfirm ? 'visibility_off' : 'visibility'}
                                </span>
                            </button>
                        </div>
                        {errors.confirmPassword?.message && (
                            <span className="text-red-500 text-sm mt-1 block">{errors.confirmPassword.message}</span>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting || pending}
                        className="w-full py-4 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isSubmitting || pending ? "Creating account..." : "Continue"}
                    </button>
                </form>

                <p className="text-sm text-gray-500 mt-6">
                    Already have an account?{' '}
                    <Link href="/login" className="text-green-600 font-semibold cursor-pointer hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}