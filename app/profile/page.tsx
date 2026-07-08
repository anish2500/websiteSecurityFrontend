'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from "@/context/AuthContext";
import Link from 'next/link';
import { handleUpdateProfile } from "@/lib/actions/auth-action";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);

      const response = await handleUpdateProfile(formData);
      
      if (response.data) {
        setUser(response.data);
        toast.success('Profile image updated successfully!');
        
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const getImageUrl = (imagePath: string | null | undefined) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050';
    const timestamp = new Date().getTime();
    return `${baseUrl}/${imagePath}?t=${timestamp}`;
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="text-4xl mb-4">🔐</div>
          <h1 className="text-2xl font-bold mb-2 text-gray-800">Please log in</h1>
          <p className="text-gray-500">You need to be logged in to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-4xl overflow-hidden border border-gray-100">
          
          {/* Profile Header - Aesthetic Gradient & Modern Layout */}
          <div className="relative px-6 py-12 sm:px-12 bg-linear-to-br from-emerald-50 via-white to-blue-50 border-b border-gray-50">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <svg width="150" height="150" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z"/></svg>
            </div>

            <div className="flex flex-col sm:flex-row items-center relative z-10">
              <div className="relative group mb-6 sm:mb-0">
                <div className="relative w-32 h-32 rounded-3xl overflow-hidden border-[6px] border-white shadow-xl rotate-3 group-hover:rotate-0 transition-all duration-500">
                  {user.profilePicture ? (
                    <img
                      src={getImageUrl(user.profilePicture) || ''}
                      alt={user.fullName || 'Profile'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || 'U')}&background=10b981&color=fff&size=128`;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-5xl text-white font-bold">
                      {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                </div>

                {/* Modern Hover Overlay */}
                <label className="absolute inset-0 m-1.5 cursor-pointer bg-black/40 backdrop-blur-[2px] rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                    accept="image/*"
                    disabled={uploadingImage}
                  />
                  {uploadingImage ? (
                    <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                    </div>
                  )}
                </label>
              </div>

              <div className="sm:ml-10 text-center sm:text-left">
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider mb-2">
                    {user.role || 'Member'}
                </span>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{user.fullName || 'User'}</h1>
                <p className="text-gray-500 font-medium">{user.email}</p>
                <div className="flex items-center justify-center sm:justify-start mt-3 space-x-2 text-sm text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <span>Member since {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details - Minimalist Cards */}
          <div className="px-6 py-10 sm:px-12 bg-white">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-8">Personal Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Full Name', value: user.fullName || 'Not provided', icon: '👤' },
                { label: 'Email Address', value: user.email, icon: '✉️' },
                { label: 'Account Role', value: user.role || 'User', icon: '🛡️' },
                { label: 'Account ID', value: user._id ? `${user._id.substring(0, 8)}...` : 'N/A', icon: '🔑' },
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100 group hover:bg-white hover:shadow-md transition-all duration-300">
                  <div className="flex items-center space-x-3 mb-1">
                    <span className="text-lg opacity-70">{item.icon}</span>
                    <dt className="text-xs font-bold text-gray-400 uppercase tracking-wide">{item.label}</dt>
                  </div>
                  <dd className="text-sm font-semibold text-gray-700 ml-8 capitalize">{item.value}</dd>
                </div>
              ))}
            </div>

            <div className="mt-12 flex items-center justify-center sm:justify-start">
              <Link 
                href="/user/profile" 
                className="group relative px-8 py-3 bg-gray-900 text-white text-sm font-bold rounded-2xl overflow-hidden transition-all hover:pr-12 hover:bg-emerald-600 active:scale-95 shadow-lg shadow-gray-200"
              >
                <span>Edit Profile</span>
                <span className="absolute right-4 opacity-0 group-hover:opacity-100 transition-all">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}