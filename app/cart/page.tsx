"use client";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import Header from "../(public)/_components/Header";
import Footer from "../(public)/_components/footer";
import { useRouter } from "next/navigation";

import { createOrder, CreateOrderItem} from "@/lib/api/order";

export default function CartPage() {
  const { cart, loading, updateItem, removeItem } = useCart();
  const router = useRouter();



  if (loading) {
    return (
      <div className="bg-[#FCFCFC] min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3DC352]"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="bg-[#FCFCFC] min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Looks like you haven't added any plants yet.</p>
            <Link 
              href="/plants" 
              className="inline-flex items-center px-6 py-3 bg-[#3DC352] text-white font-bold rounded-2xl hover:bg-[#2E7D32] transition-colors"
            >
              Browse Plants
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleQuantityChange = async (plantId: string, quantity: number) => {
    if (quantity < 1) return;
    try {
      await updateItem(plantId, quantity);
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  const handleRemove = async (plantId: string) => {
    try {
      await removeItem(plantId);
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const handleCheckout = async () =>{
    try {
      const items: CreateOrderItem [] = cart.items.map((item)=>({
        plantId: item.plantId._id, 
        quantity: item.quantity, 
        price: item.plantId.price


      }));

      await createOrder(items, cart.totalAmount);
      toast.success('Order placed successfully!');
      router.push('/orders');
    }catch (error:any){
      toast.error(error.message || 'Failed to place orders');
    }
  }

  return (
    <div className="bg-[#FCFCFC] min-h-screen">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900">Shopping Cart</h1>
          <p className="text-gray-500 font-medium mt-1">{cart.items.length} {cart.items.length === 1 ? 'item' : 'items'} in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div 
                key={item.plantId._id} 
                className="bg-white rounded-4xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-xl transition-all border border-gray-50 flex items-center gap-4"
              >
                {/* Plant Image */}
                <div className="relative h-28 w-28 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/plant_images/${(item.plantId as any).plantImage?.[0] || (item.plantId as any).image || 'default-plant.jpg'}`}
                    alt={item.plantId.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Plant Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-800 truncate">
                    {item.plantId.name}
                  </h3>
                  <p className="text-[#3DC352] font-black text-xl mt-1">
                    Rs {item.plantId.price}
                  </p>
                  <p className="text-gray-400 text-sm font-medium">
                    Subtotal: Rs {item.plantId.price * item.quantity}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityChange(item.plantId._id, item.quantity - 1)}
                    className="w-10 h-10 rounded-xl bg-gray-100 text-gray-600 font-bold hover:bg-[#3DC352] hover:text-white transition-colors flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-bold text-gray-800">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(item.plantId._id, item.quantity + 1)}
                    className="w-10 h-10 rounded-xl bg-gray-100 text-gray-600 font-bold hover:bg-[#3DC352] hover:text-white transition-colors flex items-center justify-center"
                  >
                    +
                  </button>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemove(item.plantId._id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Remove item"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-4xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-gray-50 sticky top-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
              
              <div className="space-y-4 pb-6 border-b border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-bold">Rs {cart.totalAmount}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="font-medium">Shipping</span>
                  <span className="font-bold text-[#3DC352]">Free</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-6">
                <span className="text-lg font-bold text-gray-800">Total</span>
                <span className="text-2xl font-black text-[#3DC352]">Rs {cart.totalAmount}</span>
              </div>

              <button 
              onClick={handleCheckout}
              className="w-full py-4 bg-[#3DC352] text-white font-bold rounded-2xl hover:bg-[#2E7D32] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Proceed to Checkout
              </button>

              <Link 
                href="/plants" 
                className="block text-center mt-4 text-gray-500 font-medium hover:text-[#3DC352] transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
