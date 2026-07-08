"use server"

import { getAllOrders, getOrderById, updatePaymentStatus, refundOrder, deleteOrder } from "@/lib/api/admin/order"

export const handleGetAllOrders = async () =>{
    try {
        const response = await getAllOrders();
        if(response.success){
            return {
                success: true, 
                message: 'Get all orders successful', 
                data: response.data
            };
        }
        return {
            success: false, 
            message: response.message || 'Get all orders failed'
        };
    }catch(error: Error | any){
        return {
            success: false,
            message: error.message || 'Get all orders action failed'
        };
    }
};

export const handleOrderById = async(orderId: string) =>{
    try {
        const response = await getOrderById(orderId);
        if (response.success){
            return {
                success: true, 
                message: 'Get Order Successful', 
                data: response.data
            };
        }return {
            success: false, 
            message: response.message || 'Get order failed'
        };
    }catch (error: Error | any){
        return {
            success: false, 
            message: error.message || 'Get order action failed'
        };
    }
};

export const handleUpdatePaymentStatus = async (orderId: string, paymentStatus: string, paymentMethod?:string, transactionId?:string)=>{
    try {
        const response = await updatePaymentStatus(orderId, paymentStatus, paymentMethod, transactionId);
        if(response.success){
            return {success: true, message: 'Payment status updated', data: response.data};

        }
        return {success: false, message: response.message || 'Update payment status failed '};
    }catch(error: Error | any) {
        return {success: false, message: error.message || 'Update payment status failed'};
    }
};

export const handleReFundOrder = async (orderId: string) =>{
    try {
        const response = await refundOrder(orderId);
        if(response.success){
            return {
                success: true, 
                message: 'Order Refunded', 
                data: response.data
            };

        }
        return {
            success: false, 
            message: response.message || 'Refund failed'
        };
    }catch(error: Error | any){
        return {
            success: false, 
            message: error.message || 'Refund action failed'
            
        };
    }
};

export const handleDeleteOrder = async (orderId: string) =>{
    try {
        const response = await deleteOrder(orderId);
        if(response.success){
            return {
                success: true, 
                message: 'Order deleted successfully', 
                data: response.data
            };
        }
        return {
            success: false, 
            message: response.message || 'Delete failed'
        };
    }catch(error: Error | any){
        return {
            success: false, 
            message: error.message || 'Delete action failed'
        };
    }
};