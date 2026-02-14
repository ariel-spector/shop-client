import { createContext, useState, useContext } from "react";
// 1. ייבוא ההקשר של המשתמש כדי לדעת אם אנחנו מחוברים
import { useAuth } from './UserContext';
// 2. ייבוא הפונקציות לתקשורת עם השרת
import { addItemToCart } from '../services/apiService';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const { user } = useAuth();

    const addToCart = async (productToAdd, amount = 1) => {


        // 2. חילוץ ה-ID בצורה בטוחה (בודק את כל האפשרויות)
        const safeId = productToAdd.itemId || productToAdd.item_id || productToAdd.id;

        console.log("Extracted Safe ID:", safeId);

        if (!safeId) {
            console.error("CRITICAL ERROR: Product ID is missing/undefined/0!");
            alert("System Error: Could not add item. Missing Product ID.");
            return;
        }


        const existingProduct = cart.find(item => {
            const currentItemId = item.itemId || item.item_id || item.id;
            return currentItemId === safeId;
        });

        if (existingProduct) {

            if (existingProduct.quantity + amount > existingProduct.item_quantity) {
                alert(`Sorry, only ${existingProduct.item_quantity} units available`);
                return;
            }

            const updatedCart = cart.map(item => {
                const currentItemId = item.itemId || item.item_id || item.id;
                return currentItemId === safeId
                    ? { ...item, quantity: item.quantity + amount }
                    : item;
            });
            setCart(updatedCart);
        } else {

            setCart([...cart, { ...productToAdd, item_id: safeId, quantity: amount }]);
        }


        if (user) {
            try {

                await addItemToCart(safeId, amount);
                console.log(`Server updated successfully with ID: ${safeId}`);
            } catch (error) {
                console.error("Failed to add item to server:", error);
            }
        }
    };

    const removeFromCart = (itemId) => {
        setCart(cart.filter(item => item.item_id !== itemId));
    };


    const clearCart = () => {
        setCart([]);
    };

    const decreaseQuantity = (itemId) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.item_id === itemId && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        );

    };


    const getCartTotal = () => {
        return cart.reduce((total, item) => total + (item.item_price * item.quantity), 0);
    };


    const updateCartItemQuantity = (itemId, delta) => {
        setCart(prevCart => prevCart.map(item => {
            if (item.item_id === itemId) {
                const currentQty = item.quantity || 1;
                const newQty = currentQty + delta;

                if (newQty < 1) return item;

                if (newQty > item.item_quantity) {
                    alert(`Sorry, only ${item.item_quantity} units available`);
                    return item;
                }


                if (user) {
                    addItemToCart(item.item_id, delta).catch(error => {
                        console.error("Failed to update item quantity on server:", error);
                        alert("Failed to update quantity. Please try again.");
                    });

                }

                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const value = {
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        updateCartItemQuantity,
        getCartTotal,
        decreaseQuantity
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;