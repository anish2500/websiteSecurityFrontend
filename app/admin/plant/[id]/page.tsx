import { handleGetOnePlant } from "@/lib/actions/admin/plant-action";
import Link from "next/link";
import Image from "next/image";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const response = await handleGetOnePlant(id);
  if (!response.success) {
    throw new Error(response.message || "Failed to load plant");
  }
  const plant = response.data;
  return (
    <div className="p-6 md:p-10 bg-slate-50/30 min-h-screen">
      <div className="max-w-3xl mx-auto">
        {/* Navigation Breadcrumbs */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/admin/plant" 
            className="group flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-1"><path d="m15 18-6-6 6-6"/></svg>
            Back to Plants
          </Link>
        </div>
        {/* Plant Header Card */}
        <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-emerald-50/50">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-8 border-b border-slate-100">
            <div className="flex items-center gap-5">
              <div className="h-20 w-20 rounded-2xl bg-emerald-100 flex items-center justify-center overflow-hidden shadow-inner">
                {plant.plantImage ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/plant_images/${plant.plantImage}`}
                    alt={plant.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="text-emerald-600 text-3xl font-bold">🌿</span>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">{plant.name}</h1>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-wider mt-1">
                  {plant.category}
                </span>
              </div>
            </div>
            <Link 
              href={`/admin/plant/${id}/edit`} 
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold rounded-xl transition-all active:scale-95 shadow-lg shadow-slate-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
              Edit Plant
            </Link>
          </div>
          {/* Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Plant Name</p>
              <p className="text-slate-700 font-medium">{plant.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Category</p>
              <p className="text-slate-700 font-medium">{plant.category}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Price</p>
              <p className="text-slate-700 font-medium">₹{plant.price}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Stock Quantity</p>
              <p className="text-slate-700 font-medium">{plant.stock}</p>
            </div>
            <div className="space-y-1 md:col-span-2">
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Description & Care Instructions</p>
              <p className="text-slate-700 font-medium">{plant.description}</p>
            </div>
            <div className="space-y-1 md:col-span-2">
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Plant ID</p>
              <p className="text-slate-700 text-xs font-mono bg-slate-50 p-1.5 rounded border border-slate-100 inline-block">
                {id}
              </p>
            </div>
          </div>
        </div>
        {/* Decorative Footer Note */}
        <p className="text-center text-slate-400 text-xs mt-8">
          Plant information is strictly for administrative use only.
        </p>
      </div>
    </div>
  );
}
