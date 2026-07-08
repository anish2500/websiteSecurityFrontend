"use client"

import { Favorites, getFavorites, addToFavorites, removeFromFavorites, FavoriteItem } from "@/lib/api/favorites";
import { useState , useContext, createContext, useEffect, ReactNode } from "react";

interface FavoritesContextType{
    favorites: Favorites | null; 
    loading: boolean; 
    addItem:(plantId: string) =>Promise<void>;
    removeItem:(plantId: string) =>Promise<void>;
    isFavorite:(plantId: string) => boolean; 
    favoritesCount: number; 
    refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children} : {children: ReactNode})=>{
    const [favorites, setFavorites] = useState<Favorites | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshFavorites = async () =>{
        try {
            const data = await getFavorites();
            setFavorites(data);
        }catch (error){
            setFavorites(null);
        }finally {
            setLoading(false);
        }
    };

    const addItem = async(plantId: string) =>{
        await addToFavorites(plantId);
        await refreshFavorites();
    };
    
    const removeItem = async (plantId : string)=>{
        await removeFromFavorites(plantId);
        await refreshFavorites();
    };
    
    const isFavorite = (plantId: string): boolean =>{
        return favorites?.items?.some((item: FavoriteItem) => item.plantId?._id === plantId) || false; 
    };

    useEffect(()=>{
        refreshFavorites();
    }, []);

    const favoritesCount = favorites?.items?.length || 0;

    return (
        <FavoritesContext.Provider value = {{favorites, loading, addItem, removeItem, refreshFavorites, 
            isFavorite, favoritesCount
        }}>
            {children}

        </FavoritesContext.Provider>
    );

    
};

export const useFavorites = () =>{
    const context = useContext(FavoritesContext);
    if (!context) throw new Error("useFavorites must be used within favoritesProvider");
    return context; 
};

