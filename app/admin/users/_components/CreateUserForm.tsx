"use client";
import { Controller, useForm } from "react-hook-form";
import { UserData, UserSchema } from "@/app/admin/users/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, useTransition } from "react";
import { toast } from "react-toastify";
import { handleCreateUser } from "@/lib/actions/admin/user-action";

export default function CreateUserForm() {
    const [pending, startTransition] = useTransition();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<UserData>({
        resolver: zodResolver(UserSchema)
    });

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (file: File | undefined, onChange: (file: File | undefined) => void) => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreviewImage(reader.result as string);
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
        }
        onChange(file);
    };

    const handleDismissImage = (onChange?: (file: File | undefined) => void) => {
        setPreviewImage(null);
        onChange?.(undefined);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const onSubmit = async (data: UserData) => {
        startTransition(async () => {
            try {
                const formData = new FormData();
                if (data.firstName) formData.append('firstName', data.firstName);
                if (data.lastName) formData.append('lastName', data.lastName);
                formData.append('email', data.email);
                formData.append('username', data.username);
                formData.append('password', data.password);
                formData.append('confirmPassword', data.confirmPassword);
                if (data.profilePicture) formData.append('profilePicture', data.profilePicture);

                const response = await handleCreateUser(formData);
                if (!response.success) throw new Error(response.message || 'Create profile failed');
                
                reset();
                handleDismissImage();
                toast.success('Profile Created successfully');
            } catch (error: any) {
                toast.error(error.message || 'Create profile failed');
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto p-8 bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-zinc-100 font-(family-name:--font-montserrat) text-zinc-800">
            
            {/* Header Section */}
            <div className="text-center space-y-1 mb-4">
                <h2 className="text-xl font-black tracking-tight text-zinc-900">Create New User</h2>
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest">Enter account details below</p>
            </div>

            {/* Profile Image Upload */}
            <div className="flex flex-col items-center justify-center space-y-4 pb-6">
                <div className="relative group">
                    {previewImage ? (
                        <div className="relative w-24 h-24">
                            <img src={previewImage} alt="Preview" className="w-24 h-24 rounded-full object-cover border-4 border-[#32CD32]/10 shadow-inner" />
                            <Controller
                                name="profilePicture"
                                control={control}
                                render={({ field: { onChange } }) => (
                                    <button
                                        type="button"
                                        onClick={() => handleDismissImage(onChange)}
                                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg hover:bg-red-600 transition-all active:scale-90"
                                    >
                                        <span className="material-icons text-[14px]">close</span>
                                    </button>
                                )}
                            />
                        </div>
                    ) : (
                        <div className="w-24 h-24 bg-zinc-50 rounded-full flex items-center justify-center border-2 border-dashed border-zinc-200">
                            <span className="material-icons text-zinc-300 text-4xl">add_a_photo</span>
                        </div>
                    )}
                </div>

                <label className="cursor-pointer group">
                    <span className="px-4 py-2 rounded-full bg-zinc-50 text-zinc-600 text-[10px] font-black uppercase tracking-widest border border-zinc-200 hover:border-[#32CD32] hover:text-[#32CD32] transition-all inline-flex items-center gap-2 shadow-sm">
                        Choose Image
                    </span>
                    <Controller
                        name="profilePicture"
                        control={control}
                        render={({ field: { onChange } }) => (
                            <input ref={fileInputRef} type="file" className="hidden" onChange={(e) => handleImageChange(e.target.files?.[0], onChange)} accept=".jpg,.jpeg,.png,.webp" />
                        )}
                    />
                </label>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                    { id: "firstName", label: "First Name", icon: "person", placeholder: "Jane" },
                    { id: "lastName", label: "Last Name", icon: "badge", placeholder: "Doe" }
                ].map((field) => (
                    <div key={field.id} className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1" htmlFor={field.id}>{field.label}</label>
                        <div className="relative group">
                            <span className="material-icons absolute left-3 top-2.5 text-zinc-300 group-focus-within:text-[#32CD32] transition-colors text-lg">{field.icon}</span>
                            <input
                                id={field.id}
                                {...register(field.id as any)}
                                className="h-11 w-full rounded-2xl border border-zinc-100 bg-zinc-50/50 pl-10 pr-4 text-sm focus:bg-white focus:border-[#32CD32] focus:ring-4 focus:ring-[#32CD32]/5 outline-none transition-all placeholder:text-zinc-300"
                                placeholder={field.placeholder}
                            />
                        </div>
                        {errors[field.id as keyof UserData]?.message && <p className="text-[10px] font-bold text-red-500 pl-1 uppercase">{errors[field.id as keyof UserData]?.message as string}</p>}
                    </div>
                ))}
            </div>

            {/* Email & Username */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1" htmlFor="email">Email</label>
                    <div className="relative group">
                        <span className="material-icons absolute left-3 top-2.5 text-zinc-300 group-focus-within:text-[#32CD32] transition-colors text-lg">mail</span>
                        <input id="email" type="email" {...register("email")} className="h-11 w-full rounded-2xl border border-zinc-100 bg-zinc-50/50 pl-10 pr-4 text-sm focus:bg-white focus:border-[#32CD32] focus:ring-4 focus:ring-[#32CD32]/5 outline-none transition-all placeholder:text-zinc-300" placeholder="jane@example.com" />
                    </div>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1" htmlFor="username">Username</label>
                    <div className="relative group">
                        <span className="material-icons absolute left-3 top-2.5 text-zinc-300 group-focus-within:text-[#32CD32] transition-colors text-lg">alternate_email</span>
                        <input id="username" {...register("username")} className="h-11 w-full rounded-2xl border border-zinc-100 bg-zinc-50/50 pl-10 pr-4 text-sm focus:bg-white focus:border-[#32CD32] focus:ring-4 focus:ring-[#32CD32]/5 outline-none transition-all placeholder:text-zinc-300" placeholder="janedoe" />
                    </div>
                </div>
            </div>

            {/* Passwords with Eye Toggle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                    { id: "password", label: "Password", state: showPassword, setter: setShowPassword },
                    { id: "confirmPassword", label: "Confirm Password", state: showConfirmPassword, setter: setShowConfirmPassword }
                ].map((field) => (
                    <div key={field.id} className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1" htmlFor={field.id}>{field.label}</label>
                        <div className="relative group">
                            <span className="material-icons absolute left-3 top-2.5 text-zinc-300 group-focus-within:text-[#32CD32] transition-colors text-lg">lock</span>
                            <input
                                id={field.id}
                                type={field.state ? "text" : "password"}
                                {...register(field.id as any)}
                                className="h-11 w-full rounded-2xl border border-zinc-100 bg-zinc-50/50 pl-10 pr-12 text-sm focus:bg-white focus:border-[#32CD32] focus:ring-4 focus:ring-[#32CD32]/5 outline-none transition-all placeholder:text-zinc-300"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => field.setter(!field.state)}
                                className="absolute right-3 top-2.5 text-zinc-300 hover:text-[#32CD32] transition-colors"
                            >
                                <span className="material-icons text-xl">{field.state ? "visibility_off" : "visibility"}</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isSubmitting || pending}
                className="h-14 w-full rounded-2xl bg-[#32CD32] text-white text-xs font-black uppercase tracking-[0.2em] shadow-[0_12px_24px_-8px_rgba(50,205,50,0.5)] hover:shadow-[0_15px_30px_-5px_rgba(50,205,50,0.6)] hover:-translate-y-1 transition-all active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none"
            >
                {isSubmitting || pending ? "Creating Account..." : "Confirm & Create"}
            </button>
        </form>
    );
}