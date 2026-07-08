import z from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export enum PlantCategoryEnum {
  INDOOR = "INDOOR",
  OUTDOOR = "OUTDOOR",
  FLOWERING = "FLOWERING",
  
}

export const PlantSchema = z.object({
  name: z
    .string()
    .min(3, "Plant name must be at least 3 characters"),

  description: z
    .string()
    .min(20, "Description must be at least 20 characters"),

  category: z.enum(
    [
      PlantCategoryEnum.INDOOR,
      PlantCategoryEnum.OUTDOOR,
      PlantCategoryEnum.FLOWERING,

    ],
    {
      message: "Please select a valid plant category",
    }
  ),

  price: z
    .number()
    .positive("Price must be a positive number"),

  stock: z
    .number()
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative"),

  plantImage: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "Max file size is 5MB",
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Only .jpg, .jpeg, .png formats are supported",
    })
    .optional(),
});

export type PlantData = z.infer<typeof PlantSchema>;

// For Update (Edit)
export const PlantEditSchema = PlantSchema.partial();
export type PlantEditData = z.infer<typeof PlantEditSchema>;
