import axios from "./axios";
import {API} from "./endpoints";

export interface FavoriteItem {
    _id: string; 
    plantId:{
        _id: string; 
        name: string; 
        category: string; 
        price: number; 
        plantImage?: string[];
        image?: string; 
    };
}

export interface Favorites {
    _id: string; 
    userId: string; 
    items?: FavoriteItem[];
    plants?: any[];
}

export const getFavorites = async (): Promise<Favorites> =>{
    try{
        const response = await axios.get(API.FAVORITES.GET_ALL);
        const data = response.data.data;
        
        if (!data) {
            return { _id: '', userId: '', items: [] };
        }
        
        // Backend returns "plants" - transform to "items" format
        const plants = data.plants || [];
        
        const items = plants.map((plant: any) => {
            // If plant is populated (has name, price, etc.)
            if (plant && plant.name) {
                return {
                    _id: plant._id,
                    plantId: plant
                };
            }
            // If plant is just an ObjectId (not populated)
            return {
                _id: plant.toString(),
                plantId: {
                    _id: plant.toString(),
                    name: 'Unknown',
                    category: '',
                    price: 0,
                    plantImage: []
                }
            };
        });
        
        return {
            _id: data._id || '',
            userId: data.userId || '',
            items
        };
    }catch (error: any){
        throw new Error(error.response?.data?.message || error.message || 'Failed to get favorites');
    }
};


export const addToFavorites = async(plantId: string) : Promise<Favorites> =>{
    try {
        const response = await axios.post(API.FAVORITES.CREATE, {plantId});
        return response.data.data; 
    }catch (error: any){
        throw new Error(error.response?.data?.message || error.message || 'Failed to add to favorites');
    }
};

export const removeFromFavorites = async (plantId: string) : Promise<Favorites> =>{
    try {
        const response = await axios.delete(API.FAVORITES.REMOVE(plantId));
        return response.data.data; 
    } catch (error: any){
        throw new Error(error.response?.data?.message || error.message || 'Failed to remove from favorites');
    }
}