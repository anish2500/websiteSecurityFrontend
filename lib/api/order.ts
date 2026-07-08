import axios from './axios';
import { API } from './endpoints';


export interface CreateOrderItem {
    plantId: string; 
    quantity: number; 
    price : number;
}

export interface OrderItem {
    plantId:{
        _id: string; 
        name: string; 
        plantImage?: string[];
        image?:string; 
    }
    quantity: number; 
    price : number; 
}

export interface Order {
    _id: string; 
    userId: string; 
    items: OrderItem[];
    totalAmount: number; 
    createdAt: string; 
    updatedAt: string; 
 
}

export const createOrder = async (items: CreateOrderItem[], totalAmount : number) =>{
    try {
        const response = await axios.post(API.ORDER.CREATE, {items, totalAmount});
        return response.data; 
    }catch (error: any){
        throw new Error(error.response?.data?.message || error.message || 'Failed to place order');
    }
};

export const getOrders = async(): Promise<Order[]> => {
    try {
        const response = await axios.get(API.ORDER.GET_ALL);
        return response.data.data;
    }catch(error:any){
        throw new Error(error.response?.data?.message || error.message || 'Failed to get orders');
    }
};

export const getOrderById = async(orderId: string) : Promise<Order> =>{
    try {
        const response = await axios.get(API.ORDER.GET_ONE(orderId));
        return response.data.data;
    }catch(error: any){
        throw new Error(error.response?.data?.message || error.message || 'Failed to get order');
    }
}

export const cancelOrder = async (orderId: string) =>{
    try {
        const response = await axios.delete(`${API.ORDER.GET_ALL}/${orderId}`);
        return response.data; 
    }catch (error: any){
        throw new Error(error.response?.data?.message || error.message || 'Failed to cancel order');
    }
};



