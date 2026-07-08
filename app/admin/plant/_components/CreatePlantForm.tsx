"use client";

import z from "zod";
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, useTransition } from "react";
import { toast } from "react-toastify";
import { handleCreatePlant } from "@/lib/actions/admin/plant-action";
import {
  PlantData,
  PlantSchema,
  PlantCategoryEnum,
} from "../schema";

export default function CreatePlantForm() {
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PlantData>({
    resolver: zodResolver(PlantSchema),
  });

  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const onSubmit: SubmitHandler<z.input<typeof PlantSchema>> = async (
    data
  ) => {
    setError(null);

    startTransition(async () => {
      try {
        const formData = new FormData();

        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("category", data.category);
        formData.append("price", data.price.toString());
        formData.append("stock", data.stock.toString());

        if (data.plantImage) {
          formData.append("plantImage", data.plantImage);
        }

        const response = await handleCreatePlant(formData);

        if (!response.success) {
          throw new Error(response.message || "Create plant failed");
        }

        reset();
        handleDismissImage();
        toast.success("Plant Created Successfully 🌿");
      } catch (error: any) {
        toast.error(error.message || "Create Plant failed");
        setError(error.message);
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
            <h2 className="text-2xl font-bold text-slate-800">Add New Plant</h2>
            <p className="text-sm text-slate-500 font-medium">Register a new species to your nursery collection</p>
        </div>

        {/* Image Upload Area */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative group">
            {previewImage ? (
              <div className="relative h-40 w-40 overflow-hidden rounded-2xl ring-4 ring-emerald-50 shadow-inner">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <Controller
                  name="plantImage"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <button
                      type="button"
                      onClick={() => handleDismissImage(onChange)}
                      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-rose-500 shadow-lg backdrop-blur-sm transition hover:bg-rose-500 hover:text-white"
                    >
                      ✕
                    </button>
                  )}
                />
              </div>
            ) : (
              <label className="flex h-40 w-40 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-100 bg-emerald-50/30 transition hover:bg-emerald-50">
                <div className="flex flex-col items-center space-y-2">
                  <div className="rounded-full bg-emerald-100 p-3 text-emerald-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700">Upload Photo</span>
                </div>
                <Controller
                  name="plantImage"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept=".jpg,.jpeg,.png"
                      onChange={(e) =>
                        handleImageChange(e.target.files?.[0], onChange)
                      }
                    />
                  )}
                />
              </label>
            )}
          </div>
          {errors.plantImage && (
            <p className="text-xs font-medium text-rose-500">
              {errors.plantImage.message}
            </p>
          )}
        </div>

        {/* Input Fields */}
        <div className="grid gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Plant Name</label>
            <input
              {...register("name")}
              placeholder="e.g. Monstera Deliciosa"
              className="w-full rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 placeholder:text-slate-400"
            />
            {errors.name && (
              <p className="text-xs font-medium text-rose-500 ml-1">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Plant Description</label>
            <textarea
              {...register("description")}
              placeholder="Details about watering, light, and soil requirements..."
              className="min-h-30 w-full rounded-xl border border-slate-100 bg-slate-50/50 p-4 text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 placeholder:text-slate-400"
            />
            {errors.description && (
              <p className="text-xs font-medium text-rose-500 ml-1">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Category</label>
              <select
                {...register("category")}
                className="w-full appearance-none rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
              >
                <option value="">Select Category</option>
                <option value={PlantCategoryEnum.INDOOR}>Indoor</option>
                <option value={PlantCategoryEnum.OUTDOOR}>Outdoor</option>
                <option value={PlantCategoryEnum.FLOWERING}>Flowering</option>
              </select>
              {errors.category && (
                <p className="text-xs font-medium text-rose-500 ml-1">{errors.category.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Price (₹)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
                <input
                  type="number"
                  {...register("price", { valueAsNumber: true })}
                  placeholder="0.00"
                  className="w-full rounded-xl border border-slate-100 bg-slate-50/50 pl-8 pr-4 py-3 text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 placeholder:text-slate-400"
                />
              </div>
              {errors.price && (
                <p className="text-xs font-medium text-rose-500 ml-1">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Stock Quantity</label>
              <input
                type="number"
                {...register("stock", { valueAsNumber: true })}
                placeholder="0"
                className="w-full rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 placeholder:text-slate-400"
              />
              {errors.stock && (
                <p className="text-xs font-medium text-rose-500 ml-1">{errors.stock.message}</p>
              )}
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
                  Processing...
                </>
              ) : (
                "Save Plant Details"
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