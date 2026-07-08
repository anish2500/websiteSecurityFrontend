import Link from "next/link";
import { handleGetAllUsers } from "@/lib/actions/admin/user-action";
import UserTable from "./_components/UserTable";

export default async function Page({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams;
    const page = params.page as string || '1';
    const size = params.size as string || '10';
    const search = params.search as string || '';

    const response = await handleGetAllUsers(
        page,
        size,
        search as string
    );

    if (!response.success) {
        throw new Error(response.message || 'Failed to load users');
    }

    return (
        <div className="p-6 md:p-10 bg-slate-50/30 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Action Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">User Accounts</h1>
                        <p className="text-sm text-slate-500">Manage your nursery staff and administrator access</p>
                    </div>

                    <Link 
                        href="/admin/users/create"
                        className="group relative inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md shadow-emerald-200 transition-all duration-200 active:scale-95"
                    >
                        {/* Plus Icon */}
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="20" 
                            height="20" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2.5" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            className="transition-transform group-hover:rotate-90"
                        >
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        <span>Create User</span>
                    </Link>
                </div>

                {/* Table Component */}
                <UserTable users={response.data} pagination={response.pagination} search={search} />
            </div>
        </div>
    );
}