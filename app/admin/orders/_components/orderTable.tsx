"use client"

import { Order } from "@/lib/api/admin/order";
import { handleUpdatePaymentStatus, handleReFundOrder, handleDeleteOrder } from "@/lib/actions/admin/order-action";
import { useState } from "react";
import Link from "next/link";
import DeleteModal from "../../../_components/DeleteModal";

interface OrderTableProps {
    orders: Order[];
}

export default function OrderTable({ orders }: OrderTableProps) {
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null);

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        setLoadingId(orderId);
        try {
            await handleUpdatePaymentStatus(orderId, newStatus);
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
        setLoadingId(null);
    };

    const handleRefund = async (orderId: string) => {
        if (!confirm("Are you sure you want to refund this order?")) return;
        setLoadingId(orderId);
        try {
            await handleReFundOrder(orderId);
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
        setLoadingId(null);
    };

    const handleDelete = async (orderId: string) => {
        setDeleteOrderId(null);
        setLoadingId(orderId);
        try {
            await handleDeleteOrder(orderId);
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
        setLoadingId(null);
    };
    return (
        <>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                Order ID
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                Customer Email
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                Items
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                Total Amount
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                Payment Status
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                Payment Method
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {orders.map((order) => (
                            <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">
                                    {order._id.slice(-8)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                    {order.userId?.email || 'No email'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                    {order.items?.length || 0} items
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-emerald-600">
                                    Rs {order.totalAmount?.toFixed(2)}
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
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                    {order.paymentMethod || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                    {new Date(order.createdAt).toLocaleDateString('en-US')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {order.paymentStatus === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleStatusChange(order._id, 'paid')}
                                                disabled={loadingId === order._id}
                                                className="text-emerald-600 hover:text-emerald-800 font-medium mr-3 disabled:opacity-50"
                                            >
                                                {loadingId === order._id ? 'Processing...' : 'Mark Paid'}
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(order._id, 'failed')}
                                                disabled={loadingId === order._id}
                                                className="text-red-600 hover:text-red-800 font-medium mr-3 disabled:opacity-50"
                                            >
                                                Mark Failed
                                            </button>
                                        </>
                                    )}
                                    {order.paymentStatus === 'paid' && (
                                        <>
                                            <button
                                                onClick={() => handleRefund(order._id)}
                                                disabled={loadingId === order._id}
                                                className="text-blue-600 hover:text-blue-800 font-medium mr-3 disabled:opacity-50"
                                            >
                                                Refund
                                            </button>
                                            <button
                                                onClick={() => setDeleteOrderId(order._id)}
                                                disabled={loadingId === order._id}
                                                className="text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                    {(order.paymentStatus === 'failed' || order.paymentStatus === 'refunded') && (
                                        <span className="text-slate-400 text-xs">No actions</span>
                                    )}
                                   
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {orders.length === 0 && (
                <div className="p-8 text-center text-slate-500">
                    No orders found
                </div>
            )}
        </div>
        <DeleteModal
            isOpen={!!deleteOrderId}
            onClose={() => setDeleteOrderId(null)}
            onConfirm={() => deleteOrderId && handleDelete(deleteOrderId)}
            title="Delete Order"
            description="Are you sure you want to delete this order? This action cannot be undone."
        />
        </>
    );
}
