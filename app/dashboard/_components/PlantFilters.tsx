"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function PlantFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");

  const updateFilters = (updates: Record<string, string | undefined>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });

    newParams.set("page", "1");
    router.push(`/dashboard?${newParams.toString()}`, { scroll: false });
  };

  return (
    <div className="bg-white p-6 rounded-4xl border border-gray-100 shadow-sm mb-10 transition-all">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* 1. Search by Name (Matches 'name' field in backend) */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
            Search Plants
          </label>
          <div className="relative">
            <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">search</span>
            <input
              type="text"
              placeholder="Search by name..."
              className="w-full h-12 pl-10 pr-4 rounded-2xl bg-gray-50 border border-transparent text-sm focus:outline-none focus:border-[#3DC352] focus:bg-white transition-all"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && updateFilters({ search: searchValue })
              }
            />
          </div>
        </div>

        {/* 2. Category Filter - UPDATED TO MATCH ENUM */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
            Category
          </label>
          <select
            className="w-full h-12 px-4 rounded-2xl bg-gray-50 border border-transparent text-sm focus:outline-none focus:border-[#3DC352] focus:bg-white transition-all appearance-none cursor-pointer"
            value={searchParams.get("category") || ""}
            onChange={(e) => updateFilters({ category: e.target.value })}
          >
            <option value="">All Categories</option>
            {/* Values match PlantCategoryEnum strictly */}
            <option value="INDOOR">Indoor</option>
            <option value="OUTDOOR">Outdoor</option>
            <option value="FLOWERING">Flowering</option>
          </select>
        </div>

        {/* 3. Price Range (Added to make the grid more useful) */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
            Budget
          </label>
          <select
            className="w-full h-12 px-4 rounded-2xl bg-gray-50 border border-transparent text-sm focus:outline-none focus:border-[#3DC352] focus:bg-white transition-all appearance-none cursor-pointer"
            value={searchParams.get("maxPrice") || ""}
            onChange={(e) => updateFilters({  maxPrice: e.target.value})}
          >
            <option value="">Any Price</option>
            <option value="500">Under Rs 500</option>
            <option value="1000">Under Rs 1000</option>
            <option value="2000">Under Rs 2000</option>
            <option value="5000">Under Rs 5000</option>

          </select>
        </div>

        {/* 4. Clear Filters Button */}
        <div className="flex items-end">
          <button
            onClick={() => {
              setSearchValue("");
              router.push("/dashboard");
            }}
            className="w-full h-12 rounded-2xl bg-[#3DC352] text-white text-sm font-bold hover:bg-[#2E7D32] shadow-lg shadow-green-200 transition-all active:scale-95"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
}