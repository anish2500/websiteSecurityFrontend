export const API = {
    AUTH: {
        REGISTER : "/api/auth/register",
        LOGIN : "/api/auth/login",
        WHOAMI: '/api/auth/whoami',
        UPDATE_PROFILE : "/api/auth/profile",
        REQUEST_PASSWORD_RESET: '/api/auth/request-password-reset',
        RESET_PASSWORD : (token: string) =>`/api/auth/reset-password/${token}`,
        MFA_SETUP: '/api/auth/mfa/setup', 
        MFA_VERIFY_SETUP: '/api/auth/mfa/verify-setup', 
        MFA_CHALLENGE: '/api/auth/mfa/challenge',
        MFA_DISABLE: '/api/auth/mfa/disable', 
    },
    ADMIN: {
        USER: {
            CREATE: '/api/admin/users',
            GET_ALL: '/api/admin/users/all',
            GET_ONE: (userId: string) => `/api/admin/users/${userId}`,
            UPDATE: (userId: string) => `/api/admin/users/${userId}`,
            DELETE: (userId: string) => `/api/admin/users/${userId}`,
        }, 
        PLANT: {
            CREATE: '/api/admin/plants/',
            GET_ALL: '/api/admin/plants/',
            GET_ONE: (plantId: string) => `/api/admin/plants/${plantId}`,
            UPDATE: (plantId: string) => `/api/admin/plants/${plantId}`,
            DELETE: (plantId: string) => `/api/admin/plants/${plantId}`,
            RESTOCK:  (plantId: string) => `/api/admin/plants/${plantId}/restock`,


        },
        ORDER: {
            GET_ALL: '/api/admin/orders/all', 
            GET_ONE: (orderId: string) => `/api/admin/orders/${orderId}`, 
            UPDATE_STATUS: (orderId: string) =>`/api/admin/orders${orderId}/status`,
            UPDATE_PAYMENT: (orderId: string) => `/api/orders/${orderId}/payment`, 
            REFUND : (orderId: string) => `/api/orders/${orderId}/refund`,
            DELETE: (orderId: string) => `/api/orders/${orderId}`,

        },
         
    },

    


    PUBLIC : {
        PLANT: {
            GET_ALL: '/api/plants/',
            GET_ONE:(id: string) => `/api/plants/${id}`,
        },
       
    },

    CART: {
        GET: '/api/cart',
        ADD: '/api/cart',
        UPDATE: (plantId: string) => `/api/cart/${plantId}`,
        REMOVE: (plantId: string) => `/api/cart/${plantId}`,
        CLEAR: '/api/cart',
    },
    ORDER: {
        CREATE: '/api/orders', 
        GET_ALL: '/api/orders', 
        GET_ONE: (orderId: string) =>`/api/orders/${orderId}`,
        // UPDATE: (orderId: string) => `/api/orders/${orderId}`
    },
    FAVORITES: {
        CREATE: '/api/favorites', 
        GET_ALL: '/api/favorites', 
        REMOVE: (plantId: string) =>`/api/favorites/${plantId}`
    }
    
}