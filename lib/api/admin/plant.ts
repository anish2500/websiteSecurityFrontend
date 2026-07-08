import { API } from "../endpoints";

import axios from "../axios";


export const createPlant = async (plantData : any) =>{
    try {
        const response = await axios.post(
            API.ADMIN.PLANT.CREATE, 
            plantData, 
            {
                headers : {
                    'Content-Type' : 'multipart/form-data', 
                }
            }
        );
        return response.data; 
    }catch (error: Error | any){
        throw new Error (error.response?.data?.message|| error.message || 'Create Plant Failed');
    }
}

export const getPlantById = async (id: string) => {
    try {
        const response = await axios.get(
            API.ADMIN.PLANT.GET_ONE(id)
        );
        return response.data;
    } catch (error: Error | any){
        throw new Error(error.response?.data?.message
            || error.message || "Get plant by id failed"
        );
    }
}


export const getAllPlant = async (page: number, size: number, search ?:string)=>{
    try{
        const response = await axios.get(
            API.ADMIN.PLANT.GET_ALL, 
            {
                params: {page, size, search}
            }
        );
        return response.data;
    }catch (error: Error | any){
        throw new Error(error.response?.data?.message
            || error.message || "Get all plant failed"
        );
    }
}

export const updatePlant  = async (id: string, updateData: any) =>{
    try {
        const response = await axios.put(
            API.ADMIN.PLANT.UPDATE(id),
            updateData, 
            {
                headers : {
                    'Content-Type' : 'multipart/form-data', 
                }
            }
        );
        return response.data;
    }
    catch (error: Error | any){
        throw new Error (error.response?.data?.message
            || error.message || 'Update Plant Failed'
        );
    }
}


export const deletePlant = async (id: string) =>{
    try {
        const response = await axios.delete(
            API.ADMIN.PLANT.DELETE(id)

        );
        return response.data;
    } catch (error: Error | any){
        throw new Error (error.response?.data?.message
            || error.message || 'Delete plant failed'
        );
    }
}


export const restockPlant = async(id: string, stock:number) =>{
    try {
        const response = await axios.patch(API.ADMIN.PLANT.RESTOCK(id), {stock});
        return response.data;  

    }catch (error: any){
        throw new Error (error.response?.data?.message || 'Restock Failed');
    }
}