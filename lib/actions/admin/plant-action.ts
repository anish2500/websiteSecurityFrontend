"use server"
import { createPlant, getAllPlant, getPlantById, deletePlant, updatePlant, restockPlant } from "@/lib/api/admin/plant"
import { revalidatePath } from "next/cache"

export const handleCreatePlant = async (data: FormData)=>{
    try{
        const response = await createPlant(data)
        if(response.success){
            revalidatePath('/admin/plants');
            return {
                success: true, 
                message: "Plant created Successfully",
                data: response.data
            }
        }

        return {
            success: false, 
            message: response.message || 'Plant creation failed'

        }

    }catch (error : Error | any){
        return {
            success: false, message : error.message || 'Plant creation action failed'
        }
    }


}

export const handleGetAllPlant = async (
    page: string, size : string, search?:string
)=>{
    try{
        const currentPage = parseInt(page) || 1;
        const currentSize = parseInt(size) || 12;

        const response = await getAllPlant(currentPage, currentSize, search);

        if (response.success){
            return {
                success: true, 
                message: 'Get All Plant Successful',
                data: response.data, 
                pagination : response.pagination
            }
        }

        return {
            success: false, 
            message: response.message || "Get all plants failed"

        }


    }catch (error: Error | any){
        return {
            success: false, 
            message: error.message || 'Get all plant action failed'
        }
    }

}

export const handleGetOnePlant = async (id: string) =>{
    try{
        const response = await getPlantById(id);
        if(response.success){
            return {
                success: true, 
                message: 'Get plant by id successful',
                data: response.data
            }
        }return {
            success: false, 
            message: response.message || 'Get plant by id action failed'
        }

    }catch (error: Error | any){
        return {
            success: false, 
            message: error.message || 'Get plant by id action failed'
        }
    }
}

export const handleUpdatePlant = async (id: string, data: FormData) =>{
    try{
        const response = await updatePlant(id, data)

        if(response.success){
            revalidatePath('/admin/plants');
            return {
                success: true, 
                message: 'Update plants successful',
                data: response.data
            }
        }
        return {
            success: false, 
            message: response.message || 'Update plant failed'
        }
    }catch (error: Error | any){
        return { success: false, message: error.message || 'Update plant action failed'}
    }
}

export const handleDeletePlant = async (id: string)=>{
    try{
        const response = await deletePlant(id)
        if (response.success){
            revalidatePath('/admin/plants');
            return {
                success: true, 
                message: 'Delete plants successful'
            }
        }
        return {
            success: false, 
            message: response.message || 'Delete plants failed'

        }
    } catch (error: Error | any){
        return { success: false, message: error.message || 'Delete plant action failed'}
    }
}


export const handleRestockPlant = async (id: string, stock : number) =>{
    try {
        const response = await restockPlant(id, stock);
        if(response.success){
            revalidatePath('/admin/plants');
            return {success: true, message: "Plant restocked successfully"};
        }
        return { success: false, message : response.message };
    }catch (error: Error | any){
        return {success: false, message : error.message};
    }
}