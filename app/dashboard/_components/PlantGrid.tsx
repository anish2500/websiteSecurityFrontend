"use client";

import PlantCard from "./PlantCard";

export default function PlantGrid({ plants }: { plants: any[] }) {
  // Empty State Logic
  if (!plants || plants.length === 0) {
    return (
      <div className="text-center py-24 border-2 border-dashed border-green-100 rounded-4xl bg-white shadow-sm">
        <div className="mb-4 flex justify-center">
          <span className="material-icons text-6xl text-green-100">
            local_florist
          </span>
        </div>
        <h3 className="text-xl font-bold text-gray-800">No Plants Found</h3>
        <p className="text-gray-400 mt-2 max-w-xs mx-auto">
          We couldn't find any plants matching your current filters. Try adjusting your search!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Responsive Grid: 
          - 1 column on mobile
          - 2 columns on small tablets
          - 3 columns on small desktops
          - 4 columns on large screens (to match our dashboard aesthetic)
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {plants.map((item) => (
          <PlantCard key={item._id} plant={item} />
        ))}
      </div>
      
      {/* Subtle result count indicator */}
      <div className="pt-8 text-center">
        <p className="text-sm text-gray-400 font-medium">
          Showing <span className="text-gray-700">{plants.length}</span> plants
        </p>
      </div>
    </div>
  );
}