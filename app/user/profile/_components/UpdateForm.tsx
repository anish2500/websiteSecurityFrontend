"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { handleUpdateProfile } from "@/lib/actions/auth-action";
import { z } from "zod";


const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const updateUserSchema = z.object({
    fullName: z.string().min(2, { message: "Minimum 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    username: z.string().min(3, { message: "Minimum 3 characters" }),
    image: z
        .instanceof(File)
        .optional()
        .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
            message: "Max file size is 5MB",
        })
        .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
            message: "Only .jpg, .jpeg, .png and .webp formats are supported",
        }),
})

export type UpdateUserData = z.infer<typeof updateUserSchema>;

export default function UpdateUserForm({ user }: { user: any }) {
    const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } =
        useForm<UpdateUserData>({
            resolver: zodResolver(updateUserSchema),
            values: {
                fullName: user?.fullName || '',
                email: user?.email || '',
                username: user?.username || ''
            }
        });

    const { updateUser} = useAuth();    
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (file: File | undefined, onChange: (file: File | undefined) => void) => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
        }
        onChange(file);
    };

    const handleDismissImage = (onChange?: (file: File | undefined) => void) => {
        setPreviewImage(null);
        onChange?.(undefined);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const getImageUrl = (imagePath: string | null | undefined) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';
        const timestamp = new Date().getTime();
        return `${baseUrl}/${imagePath}?t=${timestamp}`;
    };

    const onSubmit = async (data: UpdateUserData) => {
        setError(null);
        try {
            const formData = new FormData();
            formData.append('fullName', data.fullName);
            formData.append('email', data.email);
            formData.append('username', data.username);
            if (data.image) {
                formData.append('profilePicture', data.image);
            }
            const response = await handleUpdateProfile(formData);
            if (!response.success) {
                throw new Error(response.message || 'Update profile failed');
            }
            if(response.user){
                updateUser(response.user);
            }
            reset({
                fullName: data.fullName, 
                email: data.email, 
                username: data.username, 
                image: undefined
            })
            

            handleDismissImage();
            toast.success('Profile updated successfully');
            router.refresh();
        } catch (error: Error | any) {
            toast.error(error.message || 'Profile update failed');
            setError(error.message || 'Profile update failed');
        }
    };

    return (
        <div className="min-h-screen bg-[#fcfdfd] py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.04)] rounded-[2.5rem] border border-emerald-50/50 overflow-hidden">
                    <div className="px-8 py-10 sm:px-12">
                        
                        {/* Header Area */}
                        <div className="mb-10 text-center sm:text-left">
                            <h1 className="text-3xl font-extrabold text-emerald-950 tracking-tight">Edit Profile</h1>
                            <p className="text-emerald-600/60 font-medium text-sm mt-1">Update your personal presence and information</p>
                        </div>

                        <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
                            {error && (
                                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl">
                                    <p className="text-sm text-rose-600 font-medium flex items-center gap-2">
                                        <span>⚠️</span> {error}
                                    </p>
                                </div>
                            )}

                            {/* Aesthetic Profile Image Display */}
                            <div className="flex flex-col items-center sm:flex-row gap-8 pb-8 border-b border-emerald-50/60">
                                <div className="relative group">
                                    <div className="w-28 h-28 rounded-4xl overflow-hidden border-4 border-white shadow-xl bg-emerald-50 ring-1 ring-emerald-100 transition-transform group-hover:scale-105 duration-300">
                                        {previewImage ? (
                                            <img
                                                src={previewImage}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : user?.profilePicture ? (
                                            <img
                                                src={getImageUrl(user.profilePicture) || ''}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-emerald-200">
                                                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {previewImage && (
                                        <Controller
                                            name="image"
                                            control={control}
                                            render={({ field: { onChange } }) => (
                                                <button
                                                    type="button"
                                                    onClick={() => handleDismissImage(onChange)}
                                                    className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-xl p-1.5 shadow-lg shadow-rose-200 hover:bg-rose-600 transition-colors"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                                                </button>
                                            )}
                                        />
                                    )}
                                </div>

                                <div className="flex flex-col gap-3">
                                    <label className="text-sm font-bold text-emerald-900 uppercase tracking-widest">Profile Picture</label>
                                    <div className="flex items-center gap-3">
                                        <Controller
                                            name="image"
                                            control={control}
                                            render={({ field: { onChange } }) => (
                                                <div className="relative">
                                                    <input
                                                        ref={fileInputRef}
                                                        type="file"
                                                        onChange={(e) => handleImageChange(e.target.files?.[0], onChange)}
                                                        className="hidden"
                                                        id="file-upload"
                                                        accept=".jpg,.jpeg,.png,.webp"
                                                    />
                                                    <label 
                                                        htmlFor="file-upload" 
                                                        className="px-5 py-2.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-100 cursor-pointer hover:bg-emerald-100 transition-all active:scale-95 inline-block"
                                                    >
                                                        Upload New Photo
                                                    </label>
                                                </div>
                                            )}
                                        />
                                        <p className="text-[11px] text-emerald-600/50 max-w-37.5 leading-tight">JPG, PNG or WebP. Max size of 5MB.</p>
                                    </div>
                                    {errors.image && <p className="text-xs font-semibold text-rose-500 mt-1">● {errors.image.message}</p>}
                                </div>
                            </div>

                            {/* Form Fields Section */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-emerald-800/60 uppercase tracking-wider ml-1" htmlFor="username">Username</label>
                                    <input
                                        id="username"
                                        type="text"
                                        {...register("username")}
                                        placeholder="@botanist"
                                        className="w-full bg-emerald-50/30 border border-emerald-100 rounded-2xl px-5 py-3.5 text-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white outline-none transition-all placeholder:text-emerald-200"
                                    />
                                    {errors.username && <p className="text-xs font-semibold text-rose-500 ml-1 italic">{errors.username.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-emerald-800/60 uppercase tracking-wider ml-1" htmlFor="fullName">Full Name</label>
                                    <input
                                        id="fullName"
                                        type="text"
                                        {...register("fullName")}
                                        placeholder="Enter your name"
                                        className="w-full bg-emerald-50/30 border border-emerald-100 rounded-2xl px-5 py-3.5 text-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white outline-none transition-all placeholder:text-emerald-200"
                                    />
                                    {errors.fullName && <p className="text-xs font-semibold text-rose-500 ml-1 italic">{errors.fullName.message}</p>}
                                </div>

                                <div className="space-y-2 sm:col-span-2">
                                    <label className="text-xs font-bold text-emerald-800/60 uppercase tracking-wider ml-1" htmlFor="email">Email Address</label>
                                    <input
                                        id="email"
                                        type="email"
                                        {...register("email")}
                                        placeholder="email@example.com"
                                        className="w-full bg-emerald-50/30 border border-emerald-100 rounded-2xl px-5 py-3.5 text-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white outline-none transition-all placeholder:text-emerald-200"
                                    />
                                    {errors.email && <p className="text-xs font-semibold text-rose-500 ml-1 italic">{errors.email.message}</p>}
                                </div>
                            </div>

                            {/* Aesthetic Submit Button */}
                            <div className="pt-6">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full sm:w-auto px-10 py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-emerald-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Saving Changes...</span>
                                        </>
                                    ) : (
                                        'Update Profile'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}