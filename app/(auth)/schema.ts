import z from "zod";

const passwordPolicy = z.string()
    .min(12, "Password must be at least 12 characters")
    .max(64, "Password must be at most 64 characters")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[0-9]/, "Must contain a number")
    .regex(/[^A-Za-z0-9]/, "Must contain a special character");

export const loginSchema = z.object({
    email: z.email({ message: "Enter a valid email" }),
    password: z.string().min(1, { message: "Password is required" }),
});

export type LoginData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
    fullName: z.string().min(2, "Full name is required").optional().nullable(),
    username: z.string().min(2, "Username is required").optional().nullable(),
    email: z.string().email("Invalid email format"),
    password: passwordPolicy,
    confirmPassword: passwordPolicy,
    profilePicture: z.string().url("Invalid URL format").optional().nullable(),
}).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
});

export type RegisterData = z.infer<typeof registerSchema>;

export const forgetPasswordSchema = z.object ({
    email : z.email({message : "Enter a valid email"}),
});

export type ForgetPasswordData = z.infer<typeof forgetPasswordSchema>;


export const resetPasswordSchema = z.object({

    newPassword: passwordPolicy,
    confirmNewPassword: passwordPolicy,

}).refine((v) => v.newPassword ===v.confirmNewPassword,{
    path: ["confirmNewPassword"],
    message: "Passwords do not match",
});

export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;