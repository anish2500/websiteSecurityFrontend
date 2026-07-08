"use server"

import { getAllPlants, getPlantDetails } from "../api/plant"


export const handleGetAllPlant = async (
    page: string, 
    size: string, 
    search? : string,
    name? : string, 
    category?:string, 
    minPrice?:string, 
    maxPrice?:string
    
) =>{
    try {
        const currentPage = parseInt(page) || 1;
        const currentSize = parseInt(size) || 12;

        const response = await getAllPlants( currentPage, currentSize, search, name,category, minPrice ? parseInt(minPrice):undefined, maxPrice ? parseInt(maxPrice) : undefined);

        if(response.success){
            return {
                success: true, 
                message : 'Plants Fetched Successfully',
                data : response.data, 
                pagination : response.pagination
            };
        }
        return {
            success: false, 
            message : response.message || 'Failed to fetch plants'

        };

    } catch (error: any){
        return {
            success: false, 
            message: error.message || 'Public plant fetch action failed'
        };
    }
}

export const handleGetPlantDetails = async(id:string)=>{
    try{
        const response = await getPlantDetails(id);

        if(response.success){
            return {
                success: true, 
                message: 'Plant Details fetched Successfully',
                data: response.data
            };
        }

        return {
            success: false,
            message: response.message || 'Failed to fetch plant details'
        };
    } catch (error: any){
        return {
            success: false, 
            message: error.message || 'Public plant details fetch action failed'
        };
    }
}
