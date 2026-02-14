import  {  createContext, useContext} from 'react'




const FavoritesContext = createContext();
export const useFavorites = () => { return useContext(FavoritesContext); };



export default FavoritesContext










