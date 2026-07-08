"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function PlantFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category") || "";

  const categories = [
    { value: "", label: "All Plants" },
    { value: "INDOOR", label: "Indoor" },
    { value: "OUTDOOR", label: "Outdoor" },
    { value: "FLOWERING", label: "Flowering" },
  ];

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
    router.push(`/plants?${newParams.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-wrap gap-3">
      {categories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => updateFilters({ category: cat.value })}
          className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all ${
            activeCategory === cat.value
              ? "bg-[#3DC352] text-white shadow-lg shadow-green-200"
              : "bg-white text-gray-600 border border-gray-100 hover:border-[#3DC352] hover:text-[#3DC352]"
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
