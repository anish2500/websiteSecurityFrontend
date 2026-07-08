"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, useTransition } from "react";
import { toast } from "react-toastify";
import { handleUpdatePlant } from "@/lib/actions/admin/plant-action";
import Image from "next/image";
import { PlantData, PlantSchema } from "../schema";

export default function UpdatePlantForm({ plant }: { plant: any }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Partial<PlantData>>({
    resolver: zodResolver(PlantSchema.partial()),
    defaultValues: {
      name: plant.name || "",
      description: plant.description || "",
      category: plant.category || "",
      price: plant.price ?? "",
      stock: plant.stock || 0,
      plantImage: undefined,
    },
  });

  const handleImageChange = (
    file: File | undefined,
    onChange: (file: File | undefined) => void
  ) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
    onChange(file);
  };

  const handleDismissImage = (
    onChange?: (file: File | undefined) => void
  ) => {
    setPreviewImage(null);
    onChange?.(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: Partial<PlantData>) => {
    setError(null);

    startTransition(async () => {
      try {
        const formData = new FormData();

        if (data.name) formData.append("name", data.name);
        if (data.description) formData.append("description", data.description);
        if (data.category) formData.append("category", data.category);
        if (data.price !== undefined)
          formData.append("price", String(data.price));
        
        if (data.stock !== undefined)
          formData.append("stock", String(data.stock));

        if (data.plantImage) {
          formData.append("plantImage", data.plantImage);
        }

        const response = await handleUpdatePlant(plant._id, formData);

        if (!response.success) {
          throw new Error(response.message || "Update Plant Failed");
        }

        reset(data);
        handleDismissImage();
        toast.success("Plant updated successfully 🌿");
      } catch (err: any) {
        toast.error(err.message || "Update plant failed");
        setError(err.message || "Update plant failed");
      }
    });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 rounded-3xl bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-emerald-50/50"
      >
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Update Plant Details</h2>
          <p className="text-sm text-slate-500 font-medium italic">Editing: {plant.name}</p>
        </div>

        {/* Aesthetic Image Section */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative group">
            <div className="relative h-40 w-40 overflow-hidden rounded-2xl ring-4 ring-emerald-50 shadow-inner bg-slate-50 border border-emerald-100 flex items-center justify-center">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Plant Preview"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : plant.plantImage ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/plant_images/${plant.plantImage}`}
                  alt="Existing Plant"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="text-center p-4">
                  <span className="text-xs font-semibold text-slate-400">No Image Found</span>
                </div>
              )}

              {/* Dismiss/Clear Button */}
              {(previewImage) && (
                <Controller
                  name="plantImage"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <button
                      type="button"
                      onClick={() => handleDismissImage(onChange)}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-rose-500 shadow-lg backdrop-blur-sm hover:bg-rose-500 hover:text-white transition-all"
                    >
                      ✕
                    </button>
                  )}
                />
              )}
            </div>

            {/* Custom File Upload Trigger */}
            <Controller
              name="plantImage"
              control={control}
              render={({ field: { onChange } }) => (
                <label className="absolute -bottom-2 -right-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-emerald-600 text-white shadow-xl hover:bg-emerald-700 hover:scale-110 transition-all border-2 border-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={(e) => handleImageChange(e.target.files?.[0], onChange)}
                  />
                </label>
              )}
            />
          </div>
          {errors.plantImage && (
            <p className="text-xs font-medium text-rose-500">{errors.plantImage.message}</p>
          )}
        </div>

        {/* Input Grid */}
        <div className="grid gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Plant Name</label>
            <input
              {...register("name")}
              placeholder="Botanical Name"
              className="w-full rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 placeholder:text-slate-400"
            />
            {errors.name && <p className="text-xs font-medium text-rose-500 ml-1">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Description & Care Instructions</label>
            <textarea
              {...register("description")}
              placeholder="How should this plant be cared for?"
              className="min-h-30 w-full rounded-xl border border-slate-100 bg-slate-50/50 p-4 text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
            />
            {errors.description && <p className="text-xs font-medium text-rose-500 ml-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Category</label>
              <input
                {...register("category")}
                placeholder="e.g., Indoor"
                className="w-full rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Price (₹)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
                <input
                  type="number"
                  {...register("price", {valueAsNumber : true})}
                  placeholder="0.00"
                  className="w-full rounded-xl border border-slate-100 bg-slate-50/50 pl-8 pr-4 py-3 text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Stock Quantity</label>
              <input
                type="number"
                {...register("stock", { valueAsNumber: true })}
                placeholder="0"
                className="w-full rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 placeholder:text-slate-400"
              />
              {errors.stock && <p className="text-xs font-medium text-rose-500 ml-1">{errors.stock.message}</p>}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting || pending}
            className="group relative flex h-12 w-full items-center justify-center overflow-hidden rounded-xl bg-emerald-600 font-bold text-white shadow-lg shadow-emerald-200 transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:bg-slate-300 disabled:shadow-none"
          >
            <span className="relative z-10 flex items-center gap-2">
              {isSubmitting || pending ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Updating...
                </>
              ) : (
                "Save Plant Changes"
              )}
            </span>
          </button>
        </div>

        {error && (
          <p className="animate-pulse text-center text-xs font-semibold text-rose-500">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}