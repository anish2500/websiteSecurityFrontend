"use client";

import { Controller, useForm } from "react-hook-form";
import { UserData, UserSchema } from "@/app/admin/users/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, useTransition } from "react";
import { toast } from "react-toastify";
import { handleUpdateUser } from "@/lib/actions/admin/user-action";
import Image from "next/image";

export default function UpdateUserForm({ user }: { user: any }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Partial<UserData>>({
    resolver: zodResolver(UserSchema.partial()),
    defaultValues: {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      username: user.username || "",
      profilePicture: undefined,
    },
  });

  const handleImageChange = (
    file: File | undefined,
    onChange: (file: File | undefined) => void
  ) => {
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
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: Partial<UserData>) => {
    setError(null);
    startTransition(async () => {
      try {
        const formData = new FormData();
        if (data.firstName) formData.append("firstName", data.firstName);
        if (data.lastName) formData.append("lastName", data.lastName);
        if (data.email) formData.append("email", data.email);
        if (data.username) formData.append("username", data.username);
        if (data.profilePicture) formData.append("image", data.profilePicture);

        const response = await handleUpdateUser(user._id, formData);

        if (!response.success) {
          throw new Error(response.message || "Update profile failed");
        }
        reset();
        handleDismissImage();
        toast.success("Profile Updated successfully");
      } catch (error: any) {
        toast.error(error.message || "Update profile failed");
        setError(error.message || "Update profile failed");
      }
    });
  };

  return (
    <div className="mt-8 bg-white border border-emerald-100 rounded-2xl shadow-sm overflow-hidden max-w-2xl mx-auto">
      {/* Header Section matching Table style */}
      <div className="p-5 bg-linear-to-r from-emerald-50/50 to-white border-b border-emerald-50">
        <h2 className="text-xl font-semibold text-emerald-900">Update User Profile</h2>
        <p className="text-xs text-emerald-600 font-medium">Editing: {user._id}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
        {/* Profile Image Display Section */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative group">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-emerald-100 shadow-md bg-emerald-50">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : user.profilePicture ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/profile_pictures/${user.profilePicture}`}
                  alt={user.username || "User"}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full text-emerald-600 font-bold text-3xl">
                  {user.username?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
            </div>

            {/* Clear Preview Button */}
            {previewImage && (
              <Controller
                name="profilePicture"
                control={control}
                render={({ field: { onChange } }) => (
                  <button
                    type="button"
                    onClick={() => handleDismissImage(onChange)}
                    className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-lg hover:bg-rose-600 transition-colors border-2 border-white"
                  >
                    ✕
                  </button>
                )}
              />
            )}
          </div>

          <div className="w-full max-w-xs text-center">
            <label className="block text-sm font-bold text-emerald-900 mb-2">Profile Picture</label>
            <Controller
              name="profilePicture"
              control={control}
              render={({ field: { onChange } }) => (
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={(e) => handleImageChange(e.target.files?.[0], onChange)}
                  accept=".jpg,.jpeg,.png,.webp"
                  className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition-all cursor-pointer"
                />
              )}
            />
            {errors.profilePicture && <p className="mt-1 text-xs text-rose-500">{errors.profilePicture.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-emerald-900 ml-1" htmlFor="firstName">First name</label>
            <input
              id="firstName"
              {...register("firstName")}
              placeholder="Jane"
              className="w-full px-4 py-2.5 bg-white border border-emerald-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-300 text-sm"
            />
            {errors.firstName && <p className="text-xs text-rose-500 ml-1">{errors.firstName.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-emerald-900 ml-1" htmlFor="lastName">Last name</label>
            <input
              id="lastName"
              {...register("lastName")}
              placeholder="Doe"
              className="w-full px-4 py-2.5 bg-white border border-emerald-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-300 text-sm"
            />
            {errors.lastName && <p className="text-xs text-rose-500 ml-1">{errors.lastName.message}</p>}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold text-emerald-900 ml-1" htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            {...register("email")}
            placeholder="you@example.com"
            className="w-full px-4 py-2.5 bg-white border border-emerald-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-300 text-sm"
          />
          {errors.email && <p className="text-xs text-rose-500 ml-1">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold text-emerald-900 ml-1" htmlFor="username">Username</label>
          <input
            id="username"
            {...register("username")}
            placeholder="janedoe"
            className="w-full px-4 py-2.5 bg-white border border-emerald-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-300 text-sm"
          />
          {errors.username && <p className="text-xs text-rose-500 ml-1">{errors.username.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || pending}
          className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-md shadow-emerald-100 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none mt-4"
        >
          {isSubmitting || pending ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Updating Account...
            </span>
          ) : (
            "Update Account"
          )}
        </button>

        {error && <p className="text-center text-xs font-semibold text-rose-500 bg-rose-50 p-2 rounded-lg">{error}</p>}
      </form>
    </div>
  );
}