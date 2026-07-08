"use client";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { toast } from "react-toastify";

export default function PlantCard({ plant }: { plant: any }) {
  const { addItem, cart } = useCart();
  
  const isInCart = cart?.items?.some(
    (item) => item.plantId?._id === plant._id
  );

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addItem(plant._id, 1);
      toast.success("Added to cart!");
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  // 1. Fixed Image Logic: Access the first image in the array if plantImage is an array
  const imageUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/plant_images/${plant.plantImage}`;

  return (
    <div className="group bg-white rounded-4xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-xl transition-all border border-gray-50 flex flex-col">
      
      {/* Image Container */}
      <div className="relative h-64 w-full rounded-3xl overflow-hidden mb-5 bg-gray-100">
        <Image
          src={imageUrl}
          alt={plant.name} // Changed from plant.title to plant.name
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-[#3DC352] text-white text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-wider shadow-sm">
          {plant.category}
        </div>
      </div>

      {/* Content Section */}
      <div className="px-2 space-y-1">
        <h3 className="text-xl font-bold text-gray-800 truncate pr-2">
          {plant.name} {/* Changed from plant.title to plant.name */}
        </h3>

        <div className="flex justify-between items-center pt-3">
          <span className="text-[#3DC352] font-black text-2xl">
            Rs {plant.price}
          </span>
          
          <button 
            onClick={handleAddToCart}
            className={`bg-gray-100 p-2.5 rounded-xl transition-colors ${
              isInCart 
                ? 'bg-[#3DC352] text-white cursor-not-allowed' 
                : 'text-gray-600 hover:bg-[#3DC352] hover:text-white'
            }`}
            disabled={isInCart}
          >
            <span className="material-icons text-lg">
              {isInCart ? 'check' : 'add_shopping_cart'}
            </span>
          </button>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-4">
        <Link
          href={`/plant/${plant._id}`}
          className="block text-center w-full py-3 rounded-2xl bg-gray-50 text-[#333] text-sm font-bold hover:bg-[#E8F5E9] hover:text-[#2E7D32] transition-all border border-transparent hover:border-[#3DC352]/20"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}