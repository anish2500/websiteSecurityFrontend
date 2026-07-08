'use client';

import { useEffect, useState } from 'react';
import { useAuth } from "@/context/AuthContext";
import Header from "../(public)/_components/Header";
import Body from "../(public)/_components/body";
import Footer from "../(public)/_components/footer";
import { handleGetAllPlant } from '@/lib/actions/plant-action';
import { Suspense } from 'react';

import PlantFilters from './_components/PlantFilters';
import PlantGrid from './_components/PlantGrid';
import { useSearchParams } from 'next/navigation';

export default function Dashboard() {

  
  const [showWelcome, setShowWelcome] = useState(true);
  const { loading, isAuthenticated } = useAuth();
  const searchParams = useSearchParams();

  const [plants, setPlants] = useState([]);
  const [fetchingPlants, setFetchingPlants] = useState(false);


  const page = searchParams.get("page")|| "1";
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const name = searchParams.get("name") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";


  useEffect(()=>{
    const fetchPlants = async() =>{
      setFetchingPlants(true);
      try{
        const response = await handleGetAllPlant(page, "12", search, name, category, minPrice, maxPrice);
        console.log("API Response:", response);
        
        const plantsData = response.success ? response.data : [];
        console.log("Plants data:", plantsData);
        setPlants(plantsData || []);
      }catch (error){
        console.error("Failed to fetch plants:", error);
      }finally {
        setFetchingPlants(false);
      }
    };

    if(isAuthenticated){
      fetchPlants();
    }
  }, [page, search, category, name,minPrice, maxPrice,  isAuthenticated]);

  useEffect(() => {
    // Hide welcome message after 3 seconds
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

 if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FCFCFC]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3DC352]"></div>
      </div>
    );
  }

 if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FCFCFC]">
        <div className="text-center p-8 bg-white rounded-4xl shadow-sm border border-gray-100">
          <h1 className="text-2xl font-black mb-4 text-gray-800">Access Denied</h1>
          <p className="mb-6 text-gray-500">Please log in to access your nursery dashboard.</p>
          <a href="/login" className="px-8 py-3 bg-[#3DC352] text-white font-bold rounded-2xl hover:bg-[#2E7D32] transition-all">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

 return (
    <div className="bg-[#FCFCFC] min-h-screen">
      <Header />
      
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Welcome Alert */}
        {showWelcome && (
          <div className="p-4 bg-green-50 border border-green-100 text-[#2E7D32] rounded-2xl text-center font-bold animate-pulse">
            🌱 Login successful! Welcome back to your garden.
          </div>
        )}

        {/* 3. The Hero/Showcase Section (Body) */}
        <Body showManualCards={false} />

        {/* 4. Filters Section wrapped in Suspense */}
        <div className="space-y-6">
          <header>
            <h2 className="text-3xl font-black text-gray-900">Explore Catalog</h2>
            <p className="text-gray-500 font-medium">Find the perfect addition to your space.</p>
          </header>

          <Suspense fallback={<div className="h-20 bg-gray-100 animate-pulse rounded-4xl" />}>
            <PlantFilters />
          </Suspense>

          {/* 5. The Grid Section */}
          {fetchingPlants ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-80 bg-gray-100 animate-pulse rounded-4xl" />
              ))}
            </div>
          ) : (
            <PlantGrid plants={plants} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}