'use client';
import { useEffect, useState } from 'react';
import Header from "../(public)/_components/Header";
import Footer from "../(public)/_components/footer";
import Body from "../(public)/_components/body";
import { handleGetAllPlant } from '@/lib/actions/plant-action';
import { useAuth } from "@/context/AuthContext";
import { Suspense } from 'react';
import PlantFilters from './_components/PlantFilters';
import PlantGrid from './_components/PlantGrid';
import { useSearchParams } from 'next/navigation';
export default function PlantsPage() {
  const [plants, setPlants] = useState([]);
  const [fetchingPlants, setFetchingPlants] = useState(true);
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const page = searchParams.get("page") || "1";
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const name = searchParams.get("name") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  useEffect(() => {
    const fetchPlants = async () => {
      setFetchingPlants(true);
      try {
        const response = await handleGetAllPlant(page, "12", search, name, category, minPrice, maxPrice);
        const plantsData = response.success ? response.data : [];
        setPlants(plantsData || []);
      } catch (error) {
        console.error("Failed to fetch plants:", error);
      } finally {
        setFetchingPlants(false);
      }
    };
    if (isAuthenticated) {
      fetchPlants();
    }
  }, [page, search, category, name, minPrice, maxPrice, isAuthenticated]);
  const getCategoryTitle = () => {
    switch (category) {
      case 'INDOOR':
        return 'Indoor Plants';
      case 'OUTDOOR':
        return 'Outdoor Plants';
      case 'FLOWERING':
        return 'Flowering Plants';
      default:
        return 'All Plants';
    }
  };
  return (
    <div className="bg-[#FCFCFC] min-h-screen">
      <Header />
      
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-gray-900">Our Plant Collection</h1>
          <p className="text-gray-500 font-medium">Discover the perfect plants for your space.</p>
        </div>
        {isAuthenticated ? (
          <>
            <Suspense fallback={<div className="h-40 bg-gray-100 animate-pulse rounded-4xl" />}>
              <PlantFilters />
            </Suspense>
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">{getCategoryTitle()}</h2>
              
              {fetchingPlants ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <div key={n} className="h-96 bg-gray-100 animate-pulse rounded-4xl" />
                  ))}
                </div>
              ) : (
                <PlantGrid plants={plants} />
              )}
            </div>
          </>
        ) : (
          <div className="space-y-12">
    <Body showManualCards={true} showHero={false} showTitle = {false} />
  </div>
        )}
      </main>
      <Footer />
    </div>
  );
}