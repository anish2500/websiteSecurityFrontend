"use client";
import { useForm } from "react-hook-form";
import { resetPasswordSchema, ResetPasswordData } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { handleResetPassword } from "@/lib/actions/auth-action";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Link from "next/link";

const ResetPasswordForm = ({ token }: { token: string }) => {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordData>({
    mode: "onSubmit",
    resolver: zodResolver(resetPasswordSchema),
  });
  const [error, setError] = useState<string | null>(null);
  const [pending, setTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const submit = (values: ResetPasswordData) => {
    setError(null);
    setTransition(async () => {
      try {
        const result = await handleResetPassword(token, values.newPassword);
        if (result.success) {
          toast.success("Password has been reset successfully.");
          return router.push('/login');
        } else {
          throw new Error(result.message || 'Failed to reset password');
        }
      } catch (err: Error | any) {
        toast.error(err.message || 'Failed to reset password');
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
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2" htmlFor="password">
          <span className="material-icons text-gray-400">lock</span>
          New Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            className="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500 placeholder-gray-400 pl-12 pr-12 transition-colors"
            {...register("newPassword")}
            placeholder="Enter your new password"
          />
          <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            lock
          </span>
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
        {errors.newPassword?.message && (
          <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
            <span className="material-icons text-xs">error</span>
            {errors.newPassword.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2" htmlFor="confirmPassword">
          <span className="material-icons text-gray-400">lock</span>
          Confirm New Password
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            autoComplete="new-password"
            className="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500 placeholder-gray-400 pl-12 pr-12 transition-colors"
            {...register("confirmNewPassword")}
            placeholder="Confirm your new password"
          />
          <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            lock
          </span>
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600"
          >
            <span className="material-icons">
              {showConfirmPassword ? 'visibility_off' : 'visibility'}
            </span>
          </button>
        </div>
        {errors.confirmNewPassword?.message && (
          <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
            <span className="material-icons text-xs">error</span>
            {errors.confirmNewPassword.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || pending}
        className="w-full h-12 bg-linear-to-r from-green-500 to-blue-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting || pending ? (
          <>
            <span className="material-icons animate-spin">refresh</span>
            Resetting Password...
          </>
        ) : (
          <>
            <span className="material-icons">lock_reset</span>
            Reset Password
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

export default ResetPasswordForm;