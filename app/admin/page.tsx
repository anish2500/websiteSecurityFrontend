import Link from "next/link";
import { handleGetAllUsers } from "@/lib/actions/admin/user-action";
import { handleGetAllPlant } from "@/lib/actions/admin/plant-action";
import { handleGetAllOrders } from "@/lib/actions/admin/order-action";
export default async function Page() {
    const usersResponse = await handleGetAllUsers('1', '1000', '');
    const plantsResponse = await handleGetAllPlant('1', '1000', '');
    const ordersResponse = await handleGetAllOrders();
    const totalUsers = usersResponse.success ? usersResponse.pagination?.total || 0 : 0;
    const totalPlants = plantsResponse.success ? plantsResponse.pagination?.total || 0 : 0;
    const totalOrders = ordersResponse.success ? ordersResponse.data?.length || 0 : 0;
    
   const totalRevenue = ordersResponse.success 
    ? ordersResponse.data
        ?.filter((order: any) => order.paymentStatus === 'paid')
        .reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0) 
    : 0;
    const paidOrders = ordersResponse.success 
        ? ordersResponse.data?.filter((order: any) => order.paymentStatus === 'paid').length || 0
        : 0;
    const pendingPayments = ordersResponse.success 
        ? ordersResponse.data?.filter((order: any) => order.paymentStatus === 'pending').length || 0
        : 0;
    const recentOrders = ordersResponse.success ? ordersResponse.data?.slice(0, 5) : [];
    return (
        <div className="p-6 md:p-10 bg-slate-50/30 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                        Admin Dashboard
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Welcome back! Here's an overview of your nursery
                    </p>
                </div>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                   
                  
                    {/* Total Orders */}
                    <Link 
                        href="/admin/orders"
                        className="group bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-emerald-300 transition-all duration-200"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Total Orders</p>
                                <p className="text-3xl font-bold text-slate-800 mt-1">{totalOrders}</p>
                            </div>
                            <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-xs text-emerald-600 mt-3 font-medium group-hover:translate-x-1 transition-transform">
                            View orders →
                        </p>
                    </Link>
                    {/* Total Revenue */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Total Revenue</p>
                                <p className="text-3xl font-bold text-emerald-600 mt-1">Rs {totalRevenue.toFixed(2)}</p>
                            </div>
                            <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-xs text-slate-400 mt-3">
                            All time earnings
                        </p>
                    </div>
                    {/* Paid Orders */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Paid Orders</p>
                                <p className="text-3xl font-bold text-emerald-600 mt-1">{paidOrders}</p>
                            </div>
                            <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-xs text-slate-400 mt-3">
                            Successfully paid
                        </p>
                    </div>
                    {/* Pending Payments */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Pending Payments</p>
                                <p className="text-3xl font-bold text-yellow-600 mt-1">{pendingPayments}</p>
                            </div>
                            <div className="h-12 w-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-xs text-slate-400 mt-3">
                            Awaiting payment
                        </p>
                    </div>
                </div>
                {/* Quick Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Link 
                        href="/admin/users/create"
                        className="flex items-center gap-3 px-5 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        <span className="font-medium">Add User</span>
                    </Link>
                    <Link 
                        href="/admin/plant/create"
                        className="flex items-center gap-3 px-5 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span className="font-medium">Add Plant</span>
                    </Link>
                    <Link 
                        href="/admin/orders"
                        className="flex items-center gap-3 px-5 py-4 bg-slate-700 hover:bg-slate-800 text-white rounded-xl transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span className="font-medium">View Orders</span>
                    </Link>
                    <Link 
                        href="/admin/users"
                        className="flex items-center gap-3 px-5 py-4 bg-slate-700 hover:bg-slate-800 text-white rounded-xl transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <span className="font-medium">Manage Users</span>
                    </Link>
                </div>
                {/* Recent Orders Table */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                        <h2 className="text-lg font-semibold text-slate-800">Recent Orders</h2>
                        <Link 
                            href="/admin/orders"
                            className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                        >
                            View all →
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                        Order ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                        Items
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                        Total
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {recentOrders.map((order: any) => (
                                    <tr key={order._id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">
                                            #{order._id.slice(-8)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                            {order.userId?.email || 'Unknown'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                            {order.items?.length || 0} items
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-emerald-600">
                                            Rs {order.totalAmount?.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                ${order.paymentStatus === 'paid'
                                                    ? 'bg-emerald-100 text-emerald-800'
                                                    : order.paymentStatus === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : order.paymentStatus === 'failed'
                                                    ? 'bg-red-100 text-red-800'
                                                    : order.paymentStatus === 'refunded'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-slate-100 text-slate-800'
                                                }`}
                                            >
                                                {order.paymentStatus || 'pending'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {recentOrders.length === 0 && (
                        <div className="p-8 text-center text-slate-500">
                            No orders yet
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}