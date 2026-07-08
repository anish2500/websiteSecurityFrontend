"use client";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { forgetPasswordSchema, ForgetPasswordData } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { handleRequestPasswordReset } from "@/lib/actions/auth-action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const ForgetPasswordForm = () => {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgetPasswordData>({
        mode: "onSubmit",
        resolver: zodResolver(forgetPasswordSchema),
    });
    const [error, setError] = useState<string | null>(null);
    const [pending, setTransition] = useTransition();
    const submit = (values: ForgetPasswordData) => {
        setError(null);
        setTransition(async () => {
            try {
                const result = await handleRequestPasswordReset(values.email);
                if (result.success) {
                    toast.success("If the email is registered, a reset link has been sent.");
                    return router.push('/login');
                }else{
                    throw new Error(result.message || 'Failed to send reset link');
                }
            } catch (err: Error | any) {
                toast.error(err.message || 'Failed to send reset link');
            }
        })
    }

    return (
        <form onSubmit={handleSubmit(submit)} className="space-y-6">
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                    {error}
                </div>
            )}
            
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2" htmlFor="email">
                    <span className="material-icons text-gray-400">email</span>
                    Email Address
                </label>
                <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 placeholder-gray-400 pl-12 transition-colors"
                    {...register("email")}
                    placeholder="Enter your email address"
                />
                {errors.email?.message && (
                    <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                        <span className="material-icons text-xs">error</span>
                        {errors.email.message}
                    </p>
                )}
            </div>

            <button
                type="submit"
                disabled={isSubmitting || pending}
                className="w-full h-12 bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isSubmitting || pending ? (
                    <>
                        <span className="material-icons animate-spin">refresh</span>
                        Sending Reset Link...
                    </>
                ) : (
                    <>
                        <span className="material-icons">send</span>
                        Send Reset Link
                    </>
                )}
            </button>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    Remember your password?{' '}
                    <Link href="/login" className="text-blue-600 font-semibold hover:text-blue-700 flex items-center justify-center gap-1">
                        <span className="material-icons text-sm">login</span>
                        Back to Login
                    </Link>
                </p>
            </div>
        </form>
    );
}

export default ForgetPasswordForm;