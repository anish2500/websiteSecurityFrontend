"use client";
import { useEffect, useState } from "react";
import { cancelOrder, getOrders, Order } from "@/lib/api/order";
import { useAuth } from "@/context/AuthContext";
import Header from "../(public)/_components/Header";
import Footer from "../(public)/_components/footer";
import Image from "next/image";
import {toast } from "react-toastify";
import Link from "next/link";
import DeleteModal from "../_components/DeleteModal";
export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling , setCancelling] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState<{orderId: string | null}>({ orderId: null });
  const { user } = useAuth();
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchOrders();
  }, [user]);
  if (!user) {
    return (
      <div className="bg-[#FCFCFC] min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <p>Please login to view your orders.</p>
          <Link href="/login" className="text-[#3DC352] font-bold">Login</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleCancelOrder = async (orderId: string) =>{
    setShowCancelModal({ orderId: null });
    setCancelling(orderId);
    try{
        await cancelOrder(orderId);
        toast.success("Order cancelled successfully");
        const data = await getOrders();
        setOrders(data);
    }catch (error: any){
        toast.error(error.message || "Failed to cancel orders");
    }finally{
        setCancelling(null);
    }
  }
  return (
    <div className="bg-[#FCFCFC] min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-black text-gray-900 mb-8">My Orders</h1>
        
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3DC352]"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">No orders yet.</p>
            <Link href="/plants" className="text-[#3DC352] font-bold">Browse Plants</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-4xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-gray-50">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-400">Order ID</p>
                    <p className="font-mono text-sm">{order._id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Date</p>
                    <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-[#3DC352]">Rs {order.totalAmount}</p>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-4">
                  <h3 className="font-bold text-gray-800 mb-3">Items</h3>
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden relative">
                          {/* Add image if available */}
                            <Image
                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/plant_images/${
                              item.plantId?.plantImage?.[0] ||
                              item.plantId?.image ||
                              "default-plant.jpg"
                            }`}
                            alt={item.plantId?.name || "Plant"}
                            fill
                            className="object-cover"
                          />
                        </div>
                         <div>
                          {/* ✅ INTEGRATED NAME LOGIC HERE */}
                          <p className="font-medium">
                            {item.plantId?.name || "Unknown Plant"}
                          </p>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity} × Rs {item.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setShowCancelModal({ orderId: order._id })}
                    disabled={cancelling === order._id}
                    className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {cancelling === order._id
                      ? "Cancelling..."
                      : "Cancel Order"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <DeleteModal
        isOpen={!!showCancelModal.orderId}
        onClose={() => setShowCancelModal({ orderId: null })}
        onConfirm={() => showCancelModal.orderId && handleCancelOrder(showCancelModal.orderId)}
        title="Cancel Order"
        description="Are you sure you want to cancel this order? This action cannot be undone."
      />
      <Footer />
    </div>
  );
}