"use client";
import { useFavorites } from "@/context/FavoritesContext";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import Header from "../(public)/_components/Header";
import Footer from "../(public)/_components/footer";
export default function FavoritesPage() {
  const { favorites, loading, removeItem } = useFavorites();
  if (loading) {
    return (
      <div className="bg-[#FCFCFC] min-h-screen">
        <Header />
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3DC352]"></div>
        </div>
        <Footer />
      </div>
    );
  }
  if (!favorites || !favorites.items || favorites.items.length === 0) {
    return (
      <div className="bg-[#FCFCFC] min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
            <span className="material-icons text-4xl text-gray-400">favorite_border</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No favorites yet</h2>
          <p className="text-gray-500 mb-8">Start adding plants you love!</p>
          <Link href="/plants" className="inline-flex px-6 py-3 bg-[#3DC352] text-white font-bold rounded-2xl hover:bg-[#2E7D32]">
            Browse Plants
          </Link>
        </div>
        <Footer />
      </div>
    );
  }
  const handleRemove = async (plantId: string) => {
    try {
      await removeItem(plantId);
      toast.success("Removed from favorites");
    } catch (error) {
      toast.error("Failed to remove");
    }
  };
  return (
    <div className="bg-[#FCFCFC] min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-black text-gray-900">My Favorites</h1>
        <p className="text-gray-500 mt-1 mb-8">{favorites?.items?.length || 0} plants you love</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites?.items?.map((item) => (
            <div key={item.plantId._id} className="bg-white rounded-4xl p-4 shadow-md border border-gray-50">
              <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-gray-100 mb-4">
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/plant_images/${item.plantId.plantImage?.[0] || 'default-plant.jpg'}`}
                  alt={item.plantId.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="px-2">
                <span className="text-xs bg-[#3DC352] text-white px-2 py-1 rounded-full">{item.plantId.category}</span>
                <h3 className="text-lg font-bold text-gray-800 mt-2">{item.plantId.name}</h3>
                <p className="text-[#3DC352] font-black text-xl">Rs {item.plantId.price}</p>
                <div className="flex gap-2 mt-4">
                  <Link href={`/plants/${item.plantId._id}`} className="flex-1 text-center py-2 bg-gray-50 rounded-xl text-sm font-bold hover:bg-[#E8F5E9]">
                    View
                  </Link>
                  <button onClick={() => handleRemove(item.plantId._id)} className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl">
                    <span className="material-icons">favorite</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}