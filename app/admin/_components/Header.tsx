"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function Header({onMenuClick}: {onMenuClick?: () => void }) {
    const { logout, user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 bg-white/70 dark:bg-zinc-950/ backdrop-blur-md border-b border-[#32CD32]/20 font-(family-name:--font-montserrat)">
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Global">
                <div className="flex h-16 items-center justify-between">
                    
                    {/* Left: Logo & Title */}
                    <div className="flex items-center gap-3">
                        <Link href="/admin" className="flex items-center gap-2 group">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#32CD32] text-white shadow-[0px_4px_10px_rgba(50,205,50,0.3)] group-hover:scale-105 transition-transform duration-200">
                                <span className="material-icons text-xl">shield</span>
                            </div>
                            <div className="flex flex-col leading-tight">
                                <span className="text-sm font-black uppercase tracking-tighter text-zinc-800 dark:text-zinc-10">
                                    Admin<span className="text-[#32CD32]">Panel</span>
                                </span>
                                <span className="text-[9px] font-bold text-zinc-400">VERSION 2.0</span>
                            </div>
                        </Link>
                        <button
                            onClick={onMenuClick}
                            className="xl:hidden p-2 text-zinc-600 hover:text-[#32CD32]"
                                    >
                                 <span className="material-icons">menu</span>
                            </button>
                        
                    </div>

                    {/* Right: User Section */}
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                            <span className="flex h-2 w-2 rounded-full bg-[#32CD32] animate-pulse"></span>
                            <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                                {user?.email?.split('@')[0] || 'Admin'}
                            </span>
                        </div>

                        <button
                            onClick={() => logout()}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border-2 border-[#32CD32] text-[#32CD32] hover:bg-[#32CD32] hover:text-white transition-all duration-300 active:translate-y-0.5"
                        >
                            <span className="material-icons text-sm">power_settings_new</span>
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
}