import React, { useState, useEffect } from "react";
import {  useAuth } from "../contexts/UserContext";
import FavoritesContext from '../contexts/FavoritesContext';
import { addFavorite, fetchFavorites, removeFavorite } from '../services/apiService';

export const FavoritesProvider = ({ children }) => {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState([]); 

    
    useEffect(() => {
        const loadFavorites = async () => {
            if (user) {
                try {
                    const data = await fetchFavorites();
                   
                    const ids = data.map(item => item.item_id); 
                    setFavorites(ids);
                } catch (error) {
                    console.error("Error fetching favorites:", error);
                }
            } else {
                setFavorites([]); 
            }
        };
        loadFavorites();
    }, [user]);

  
    const toggleFavorite = async (itemId) => {
        const isAlreadyFavorite = favorites.includes(itemId);
        
    
        setFavorites(prev => 
            isAlreadyFavorite 
                ? prev.filter(id => id !== itemId) 
                : [...prev, itemId]
        );

        try {
            
            if (isAlreadyFavorite) {
                await removeFavorite(itemId);
            } else {
                await addFavorite(itemId);
            }
        } catch (error) {
            console.error("Action failed, rolling back:", error);
            
            
            setFavorites(prev => 
                isAlreadyFavorite 
                    ? [...prev, itemId] 
                    : prev.filter(id => id !== itemId)
            );
            alert("פעולה נכשלה. אנא בדוק חיבור אינטרנט.");
        }
    };

    const isFavorite = (itemId) => favorites.includes(itemId);

    
    const value = { favorites, toggleFavorite, isFavorite };

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
};

export default FavoritesProvider;
    
    
      
    
       
    
    
       
    
    
    
    
    
 



