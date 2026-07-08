"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";
import { handleDeletePlant } from "@/lib/actions/admin/plant-action";
import DeleteModal from "@/app/_components/DeleteModal";

const PlantTable = ({
  plants,
  pagination,
  search,
}: {
  plants: any[];
  pagination: any;
  search?: string;
}) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(search || "");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleSearchChange = () => {
    router.push(
      `/admin/plant?page=1&size=${pagination.size}` +
        (searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : "")
    );
  };

  const makePagination = (): React.ReactElement[] => {
    const pages = [];
    const currentPage = pagination.page;
    const totalPages = pagination.totalPages;
    const delta = 2;

    const prevHref =
      `/admin/plant?page=${currentPage - 1}&size=${pagination.size}` +
      (searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : "");

    pages.push(
      <Link
        key="prev"
        className={`px-4 py-2 text-sm font-medium transition-all rounded-lg border 
        ${
          currentPage === 1
            ? "bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed pointer-events-none"
            : "bg-white text-emerald-700 border-gray-200 hover:border-emerald-500 hover:bg-emerald-50"
        }`}
        href={currentPage === 1 ? "#" : prevHref}
      >
        Previous
      </Link>
    );

    let startPage = Math.max(1, currentPage - delta);
    let endPage = Math.min(totalPages, currentPage + delta);

    if (startPage > 1) {
      const href =
        `/admin/plant?page=1&size=${pagination.size}` +
        (searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : "");

      pages.push(
        <Link
          key={1}
          className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg bg-white text-emerald-700 hover:bg-emerald-50"
          href={href}
        >
          1
        </Link>
      );
      if (startPage > 2) {
        pages.push(<span key="e1" className="px-2 text-gray-400">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      const href =
        `/admin/plant?page=${i}&size=${pagination.size}` +
        (searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : "");

      pages.push(
        <Link
          key={i}
          className={`px-4 py-2 text-sm font-medium transition-all rounded-lg border 
          ${
            i === currentPage
              ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
              : "bg-white text-emerald-700 border-gray-200 hover:bg-emerald-50"
          }`}
          href={href}
        >
          {i}
        </Link>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="e2" className="px-2 text-gray-400">...</span>);
      }
      const href =
        `/admin/plant?page=${totalPages}&size=${pagination.size}` +
        (searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : "");

      pages.push(
        <Link
          key={totalPages}
          className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg bg-white text-emerald-700 hover:bg-emerald-50"
          href={href}
        >
          {totalPages}
        </Link>
      );
    }

    const nextHref =
      `/admin/plant?page=${currentPage + 1}&size=${pagination.size}` +
      (searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : "");

    pages.push(
      <Link
        key="next"
        className={`px-4 py-2 text-sm font-medium transition-all rounded-lg border 
        ${
          currentPage === totalPages
            ? "bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed pointer-events-none"
            : "bg-white text-emerald-700 border-gray-200 hover:border-emerald-500 hover:bg-emerald-50"
        }`}
        href={currentPage === totalPages ? "#" : nextHref}
      >
        Next
      </Link>
    );

    return pages;
  };

  const onDelete = async () => {
    try {
      await handleDeletePlant(deleteId!);
      toast.success("Plant deleted successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete plant");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="mt-8 bg-white border border-emerald-100 rounded-2xl shadow-sm overflow-hidden">
      <DeleteModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={onDelete}
        title="Delete Plant"
        description="Are you sure you want to delete this plant? This action cannot be undone."
      />

      {/* Aesthetic Search Bar */}
      <div className="p-5 bg-linear-to-r from-emerald-50/50 to-white flex flex-wrap items-center justify-between gap-4 border-b border-emerald-50">
        <h2 className="text-xl font-semibold text-emerald-900">Plant Inventory</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearchChange()}
            placeholder="Search botanical name..."
            className="w-full sm:w-80 px-4 py-2.5 bg-white border border-emerald-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-400"
          />
          <button
            onClick={handleSearchChange}
            className="px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 shadow-md shadow-emerald-200 transition-all active:scale-95"
          >
            Search
          </button>
        </div>
      </div>

      {/* Table Design */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-emerald-50/30 text-emerald-800">
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Preview</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Plant Name</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Price</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Stock</th>
               
              <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-emerald-50">
            {plants.length > 0 ? (
              plants.map((plant) => (
                <tr key={plant._id} className="hover:bg-emerald-50/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white border border-emerald-100 shadow-sm group-hover:scale-105 transition-transform">
                   {plant.plantImage ? (
  <Image
   src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/plant_images/${plant.plantImage}`}
  alt={plant.name}
  fill
  className="object-cover"
  />
) : (

                        <div className="flex flex-col items-center justify-center h-full bg-slate-50 text-[10px] text-slate-400">
                          <span>No Image</span>
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-800 truncate max-w-xs">{plant.name}</div>
                    <div className="text-[10px] text-emerald-600 font-medium">Verified Species</div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {plant.category}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm font-bold text-emerald-700">
                    ₹{Number(plant.price).toLocaleString()}
                  </td>

                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                      (plant.stock ?? 0) > 5 ? 'bg-green-100 text-green-700' :
                      (plant.stock ?? 0) > 0 ? 'bg-orange-100 text-orange-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {plant.stock ?? 0}
                    </span>
                  </td>

                  

                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center justify-center gap-4">
                      <Link
                        href={`/admin/plant/${plant._id}/edit`}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors font-medium"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/plant/${plant._id}/edit`}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors font-medium"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => setDeleteId(plant._id)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center justify-center opacity-40">
                    <span className="text-4xl mb-2">🌿</span>
                    <p className="text-gray-500 italic">No plants found in your nursery.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Design */}
      <div className="p-6 flex flex-col sm:flex-row justify-between items-center gap-6 bg-white border-t border-emerald-50">
        <div className="text-sm text-emerald-900/60 font-medium">
          Showing page <span className="text-emerald-600 font-bold">{pagination.page}</span> of {pagination.totalPages}
        </div>
        <div className="flex items-center gap-2">{makePagination()}</div>
      </div>
    </div>
  );
};

export default PlantTable;