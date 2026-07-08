"use client";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { toast } from "react-toastify";
import { useFavorites } from "@/context/FavoritesContext";

export default function PlantCard({ plant }: { plant: any }) {
  const { addItem, cart } = useCart();
  const { addItem: addFavorite, removeItem: removeFavorite, isFavorite } = useFavorites();
 
  const isInCart = cart?.items?.some(
    (item) => item.plantId?._id === plant._id
  );

  const isInFavorites = isFavorite(plant._id);

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

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (isInFavorites) {
        await removeFavorite(plant._id);
        toast.success("Removed from favorites!");
      } else {
        await addFavorite(plant._id);
        toast.success("Added to favorites!");
      }
    } catch (error) {
      toast.error("Failed to update favorites");
    }
  };

  const imageUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/plant_images/${plant.plantImage}`;

  return (
    <div className="group bg-white rounded-4xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-xl transition-all border border-gray-50 flex flex-col">
      <div className="relative h-64 w-full rounded-3xl overflow-hidden mb-5 bg-gray-100">
        <Image
          src={imageUrl}
          alt={plant.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3 bg-[#3DC352] text-white text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-wider shadow-sm">
          {plant.category}
        </div>
        {plant.stock !== undefined && (
          <div className={`absolute top-3 right-3 text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-wider shadow-sm ${
            plant.stock > 5 ? 'bg-green-500 text-white' : 
            plant.stock > 0 ? 'bg-orange-500 text-white' : 
            'bg-red-500 text-white'
          }`}>
            {plant.stock > 0 ? (plant.stock > 5 ? 'In Stock' : `Only ${plant.stock} left`) : 'Out of Stock'}
          </div>
        )}
      </div>

      <div className="px-2 space-y-1">
        <h3 className="text-xl font-bold text-gray-800 truncate pr-2">
          {plant.name}
        </h3>

        <div className="flex justify-between items-center pt-3">
          <span className="text-[#3DC352] font-black text-2xl">
            Rs {plant.price}
          </span>
          
          <div className="flex gap-2">
            <button 
              onClick={handleFavoriteToggle}
              className={`p-2.5 rounded-xl transition-colors ${
                isInFavorites 
                  ? 'bg-red-500 text-white' 
                  : 'text-gray-600 hover:bg-red-500 hover:text-white'
              }`}
            >
              <span className="material-icons text-lg">
                {isInFavorites ? 'favorite' : 'favorite_border'}
              </span>
            </button>

            <button 
              onClick={handleAddToCart}
              className={`bg-gray-100 p-2.5 rounded-xl transition-colors ${
                isInCart || !plant.stock || plant.stock === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'text-gray-600 hover:bg-[#3DC352] hover:text-white'
              }`}
              disabled={isInCart || !plant.stock || plant.stock === 0}
            >
              <span className="material-icons text-lg">
                {isInCart ? 'check' : 'add_shopping_cart'}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <Link
          href={`/plants/${plant._id}`}
          className="block text-center w-full py-3 rounded-2xl bg-gray-50 text-[#333] text-sm font-bold hover:bg-[#E8F5E9] hover:text-[#2E7D32] transition-all border border-transparent hover:border-[#3DC352]/20"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
