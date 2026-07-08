"use client";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
export default function AdminProfilePage() {
  const { user } = useAuth();
  return (
    <div className="p-6 md:p-10 bg-slate-50/30 min-h-screen">
      <div className="max-w-3xl mx-auto">
        {/* Navigation Breadcrumbs */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/admin" 
            className="group flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-1"><path d="m15 18-6-6 6-6"/></svg>
            Back to Dashboard
          </Link>
        </div>
        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-emerald-50/50">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-8 border-b border-slate-100">
            <div className="flex items-center gap-5">
              <div className="h-24 w-24 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 text-4xl font-bold shadow-inner">
                {user?.email?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">{user?.email?.split('@')[0] || 'Admin'}</h1>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-wider mt-1">
                  Administrator
                </span>
              </div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          {/* Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Email Address</p>
              <p className="text-slate-700 font-medium">{user?.email || 'admin@example.com'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Account Type</p>
              <p className="text-slate-700 font-medium">Administrator</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Status</p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                Active
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">User ID</p>
              <p className="text-slate-700 text-xs font-mono bg-slate-50 p-1.5 rounded border border-slate-100 inline-block">
                {user?._id || 'N/A'}
              </p>
            </div>
          </div>
        </div>
        {/* Info Note */}
        <p className="text-center text-slate-400 text-xs mt-8">
          Admin profile information is for reference only.
        </p>
      </div>
    </div>
  );
}
