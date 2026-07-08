"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "../../(public)/_components/Header";
import Footer from "../../(public)/_components/footer";
import { handleGetPlantDetails } from "@/lib/actions/plant-action";
import { useCart } from "@/context/CartContext";
import { toast } from "react-toastify";

export default function PlantDetailsPage() {
  const params = useParams();
  const [plant, setPlant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { addItem, cart } = useCart();
  
  const isInCart = cart?.items?.some(
    (item) => item.plantId?._id === plant?._id
  );

  const handleAddToCart = async () => {
    try {
      await addItem(plant._id, 1);
      toast.success("Added to cart!");
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  useEffect(() => {
    const fetchPlantDetails = async () => {
      try {
        const response = await handleGetPlantDetails(params.id as string);
        if (response.success) {
          setPlant(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch plant details:", error);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) {
      fetchPlantDetails();
    }
  }, [params.id]);
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FCFCFC] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3DC352]"></div>
      </div>
    );
  }
  if (!plant) {
    return (
      <div className="min-h-screen bg-[#FCFCFC] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Plant not found</h2>
          <Link href="/plants" className="text-[#3DC352] font-bold mt-4 inline-block">
            Back to Plants
          </Link>
        </div>
      </div>
    );
  }
  const imageUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/plant_images/${plant.plantImage}`;
  return (
    <div className="bg-[#FCFCFC] min-h-screen">
      <Header />
      
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <Link 
          href="/plants" 
          className="inline-flex items-center text-gray-600 hover:text-[#3DC352] mb-8 font-medium"
        >
          <span className="material-icons mr-2">arrow_back</span>
          Back to Plants
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <div className="relative h-96 lg:h-125 rounded-4xl overflow-hidden bg-gray-100">
            <Image
              src={imageUrl}
              alt={plant.name}
              fill
              className="object-cover"
            />
            <div className="absolute top-4 left-4 bg-[#3DC352] text-white text-xs px-4 py-2 rounded-full font-black uppercase tracking-wider">
              {plant.category}
            </div>
          </div>
          {/* Details Section */}
          <div className="space-y-6">
            <h1 className="text-4xl font-black text-gray-900">{plant.name}</h1>
            
            <div className="text-4xl font-black text-[#3DC352]">
              Rs {plant.price}
            </div>
            {plant.stock !== undefined && (
              <div className="flex items-center gap-2">
                <span className="text-gray-500 font-medium">Availability:</span>
                <span className={`font-bold ${plant.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {plant.stock > 0 ? (plant.stock > 5 ? 'In Stock' : `Only ${plant.stock} available`) : 'Out of Stock'}
                </span>
              </div>
            )}
            {plant.description && (
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-gray-800">Description</h3>
                <p className="text-gray-600 leading-relaxed">{plant.description}</p>
              </div>
            )}
            {plant.careInstructions && (
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-gray-800">Care Instructions</h3>
                <p className="text-gray-600 leading-relaxed">{plant.careInstructions}</p>
              </div>
            )}
            {plant.lightRequirement && (
              <div className="flex items-center gap-2">
                <span className="text-gray-500 font-medium">Light Requirement:</span>
                <span className="text-gray-800">{plant.lightRequirement}</span>
              </div>
            )}
            {plant.wateringFrequency && (
              <div className="flex items-center gap-2">
                <span className="text-gray-500 font-medium">Watering:</span>
                <span className="text-gray-800">{plant.wateringFrequency}</span>
              </div>
            )}
            {plant.plantType && (
              <div className="flex items-center gap-2">
                <span className="text-gray-500 font-medium">Plant Type:</span>
                <span className="text-gray-800">{plant.plantType}</span>
              </div>
            )}
            <button 
              onClick={handleAddToCart}
              disabled={isInCart || !plant.stock || plant.stock === 0}
              className={`w-full lg:w-auto px-8 py-4 font-bold rounded-2xl transition-all shadow-lg ${
                isInCart || !plant.stock || plant.stock === 0
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                  : 'bg-[#3DC352] text-white hover:bg-[#2E7D32] shadow-green-200'
              }`}
            >
              {isInCart ? 'Already in Cart' : !plant.stock || plant.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}