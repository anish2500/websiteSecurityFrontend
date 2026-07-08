import axios from "./axios";
import { API } from "./endpoints";


export interface CartItem{
    _id: string; 
    plantId: {
        _id: string; 
        name: string; 
        price: number; 
        plantImage?: string[];
        image?: string;
    };
    quantity: number; 
    price?: number;
}

export interface Cart {
    _id: string; 
    userId: string; 
    items: CartItem[];
    totalAmount: number; 
}


export const getCart = async (): Promise<Cart> =>{
    try{
        const response = await axios.get(API.CART.GET);
        return response.data.data; 
    }catch(error: any){
        throw new Error (error.response?.data?.message || error.message || 'Failed to get Cart');
    }
};

export const addToCart = async(plantId: string , quantity:number =1): Promise<Cart> =>{
    try {
        const response = await axios.post(API.CART.ADD, {plantId, quantity});
        return response.data.data; 
    }catch (error:any){
        throw new Error(error.response?.data?.message || error.message || 'Failed to add to cart');
    }

};


export const updateCartItem = async(plantId : string, quantity: number) : Promise<Cart> =>{
    try{
        const response = await axios.put(API.CART.UPDATE(plantId), {quantity});
        return response.data.data;
    }catch (error:any){
        throw new Error(error.message?.data?.message || error.message || 'Failed to update cart');
    }
};

export const removeFromCart = async (plantId:string) : Promise<Cart> =>{
    try{
        const response = await axios.delete(API.CART.REMOVE(plantId));
        return response.data.data;
    }catch (error:any){
        throw new Error(error.response?.data?.message || error.message || 'Failed to remove from the cart');
    }
};

