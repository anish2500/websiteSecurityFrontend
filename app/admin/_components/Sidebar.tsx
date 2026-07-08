"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ADMIN_LINKS = [
    { href: "/admin", label: "Dashboard", icon: "grid_view" },
    { href: "/admin/users", label: "Users", icon: "group" },
    { href: "/admin/plant", label: "Plant", icon: "local_florist" },
    { href: "/admin/orders", label: "Orders" , icon: "shopping_cart"},
    { href: "/admin/adminProfile", label: "Profile", icon: "person" },


];

export default function Sidebar() {
    const pathname = usePathname();

    const isActive = (href: string) => 
        href === "/admin" ? pathname === href : pathname?.startsWith(href);

    return (
        <>
            {/* Sidebar */}
            <aside className={`
                fixed md:static 
                top-0 left-0 
                h-screen w-64 
                bg-white dark:bg-[#28a428] 
                border-r border-zinc-100 dark:border-white/10 
                z-40 overflow-y-auto
                font-(family-name:--font-montserrat)]`}
            >
                {/* Brand Logo Section */}
                <div className="p-6">
                    <Link href="/admin" className="flex items-center gap-3 group">
                        <div className="h-10 w-10 rounded-xl bg-[#32CD32] dark:bg-white text-white dark:text-[#32CD32] flex items-center justify-center shadow-[0px_4px_12px_rgba(0,0,0,0.1)] transition-transform group-hover:rotate-3">
                            <span className="material-icons text-xl">admin_panel_settings</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-sm tracking-tight text-zinc-800 dark:text-white uppercase">
                                Admin<span className="text-[#32CD32] dark:text-green-900">HQ</span>
                            </span>
                            <span className="text-[10px] font-bold text-[#32CD32]/60 dark:text-white/60 tracking-[0.2em]">CONTROL</span>
                        </div>
                    </Link>
                </div>

                {/* Navigation Links */}
                <nav className="px-4 py-2 space-y-2">
                    <div className="mb-4 px-4">
                        <p className="text-[10px] font-black text-zinc-400 dark:text-green-900/50 uppercase tracking-widest">Main Menu</p>
                    </div>

                    {ADMIN_LINKS.map(link => {
                        const active = isActive(link.href);
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`
                                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300
                                    ${active
                                        ? 'bg-[#32CD32]/10 dark:bg-white/20 text-[#32CD32] dark:text-white border-r-4 border-[#32CD32] dark:border-white shadow-sm'
                                        : 'text-zinc-500 dark:text-green-900/80 hover:bg-zinc-50 dark:hover:bg-white/10 hover:text-[#32CD32] dark:hover:text-white'
                                    }
                                `}
                            >
                                <span className={`material-icons text-[20px] ${active ? 'text-[#32CD32] dark:text-white' : 'text-zinc-400 dark:text-green-900/60'}`}>
                                    {link.icon}
                                </span>
                                <span>{link.label}</span>
                            </Link>
                        );
                    })}
                </nav>

             
            </aside >
        </>
    );
}