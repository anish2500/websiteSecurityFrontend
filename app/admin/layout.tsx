"use client"
import Header from "./_components/Header";
import Sidebar from "./_components/Sidebar";
import { useState } from "react";
export default function Layout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
     return (
        <div className='flex w-full min-h-screen'>
            <div className='page-wrapper flex w-full'>
                {/* Sidebar - visible on xl, toggleable on mobile */}
                <div className={`
                    xl:block ${sidebarOpen ? 'block' : 'hidden'}
                `}>
                    <Sidebar />
                </div>
                
                {/* Mobile sidebar overlay */}
                {sidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-black/50 z-30 xl:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
                
                <div className='w-full bg-background'>
                    <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
                    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 p-2">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
