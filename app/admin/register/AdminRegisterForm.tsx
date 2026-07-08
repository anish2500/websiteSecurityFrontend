// "use client";

// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "react-toastify";
// import { useRouter } from "next/navigation";
// import { FaUser, FaEnvelope, FaLock, FaImage } from "react-icons/fa";
// import { adminRegisterSchema, AdminRegisterData } from "./schema";

// export default function AdminRegisterForm() {
//     const [isLoading, setIsLoading] = useState(false);
//     const router = useRouter();

//     const {
//         register,
//         handleSubmit,
//         formState: { errors },
//     } = useForm<AdminRegisterData>({
//         resolver: zodResolver(adminRegisterSchema),
//     });

//     const onSubmit = async (data: AdminRegisterData) => {
//         setIsLoading(true);
//         try {
//             const result = await handleAdminRegister(data);
            
//             if (result.success) {
//                 toast.success(result.message || "Admin registration successful!");
//                 router.push("/admin/login");
//             } else {
//                 toast.error(result.message || "Admin registration failed");
//             }
//         } catch (error: any) {
//             toast.error(error.message || "An error occurred during registration");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
//             <div className="text-center mb-8">
//                 <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Register</h1>
//                 <p className="text-gray-600">Create your admin account</p>
//             </div>

//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//                 {/* Full Name */}
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Full Name
//                     </label>
//                     <div className="relative">
//                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                             <FaUser className="text-gray-400" />
//                         </div>
//                         <input
//                             {...register("fullName")}
//                             type="text"
//                             placeholder="Enter your full name"
//                             className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         />
//                     </div>
//                     {errors.fullName && (
//                         <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
//                     )}
//                 </div>

//                 {/* Email */}
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Email
//                     </label>
//                     <div className="relative">
//                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                             <FaEnvelope className="text-gray-400" />
//                         </div>
//                         <input
//                             {...register("email")}
//                             type="email"
//                             placeholder="Enter your email"
//                             className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         />
//                     </div>
//                     {errors.email && (
//                         <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
//                     )}
//                 </div>

//                 {/* Password */}
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Password
//                     </label>
//                     <div className="relative">
//                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                             <FaLock className="text-gray-400" />
//                         </div>
//                         <input
//                             {...register("password")}
//                             type="password"
//                             placeholder="Enter your password"
//                             className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         />
//                     </div>
//                     {errors.password && (
//                         <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
//                     )}
//                 </div>

//                 {/* Confirm Password */}
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Confirm Password
//                     </label>
//                     <div className="relative">
//                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                             <FaLock className="text-gray-400" />
//                         </div>
//                         <input
//                             {...register("confirmPassword")}
//                             type="password"
//                             placeholder="Confirm your password"
//                             className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         />
//                     </div>
//                     {errors.confirmPassword && (
//                         <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
//                     )}
//                 </div>

//                 {/* Profile Picture */}
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Profile Picture URL (optional)
//                     </label>
//                     <div className="relative">
//                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                             <FaImage className="text-gray-400" />
//                         </div>
//                         <input
//                             {...register("profilePicture")}
//                             type="url"
//                             placeholder="https://example.com/image.jpg"
//                             className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         />
//                     </div>
//                     {errors.profilePicture && (
//                         <p className="mt-1 text-sm text-red-600">{errors.profilePicture.message}</p>
//                     )}
//                 </div>

//                 {/* Submit Button */}
//                 <button
//                     type="submit"
//                     disabled={isLoading}
//                     className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
//                 >
//                     {isLoading ? "Registering..." : "Register as Admin"}
//                 </button>
//             </form>

//             <div className="mt-6 text-center">
//                 <p className="text-sm text-gray-600">
//                     Already have an admin account?{" "}
//                     <a href="/admin/login" className="text-blue-600 hover:text-blue-800 font-medium">
//                         Sign in
//                     </a>
//                 </p>
//             </div>
//         </div>
//     );
// }
