import axios from "axios";

// GOSLING: Updated Base URL to include '/api'
const API_URL = "http://localhost:9000/api";

// --- Auth Helper ---
const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) return {};
    return {
        headers: {
            Authorization: `Bearer ${token}`, // GOSLING: Fixed spacing
        }
    };
}

export const setAuthHeaders = (token) => {
    if (token) {
        localStorage.setItem("token", token);
        axios.defaults.headers.common['Authorization'] = "Bearer " + token;
    } else {
        localStorage.removeItem("token");
        delete axios.defaults.headers.common['Authorization'];
    }
}

// --- Auth & Users API ---

export const register = (user) => {
    return axios.post(`${API_URL}/users/register`, user);
}

export const login = (credentials) => {

    return axios.post(`${API_URL}/authenticate`, credentials);
}

export const fetchCurrentUser = () => {
    return axios.get(`${API_URL}/users/me`, getAuthHeaders());
}

export const updateCurrentUser = (user) => {

    return axios.put(`${API_URL}/users/update`, user, getAuthHeaders());
}

export const deleteCurrentUser = () => {
    return axios.delete(`${API_URL}/users`, getAuthHeaders());
}



export const fetchProducts = async () => {

    const response = await axios.get(`${API_URL}/items`);
    return response.data;
}

export const searchProducts = async (searchTerm) => {
    const response = await axios.get(`${API_URL}/items/search`, {
        params: { name: searchTerm }
    });
    return response.data;
}

export const addProduct = async (item) => {

    const response = await axios.post(`${API_URL}/items`, item, getAuthHeaders());
    return response.data;
}

export const updateProduct = async (item) => {

    const response = await axios.put(`${API_URL}/items`, item, getAuthHeaders());
    return response.data;
}

export const deleteProduct = async (itemId) => {
    // REST Standard: DELETE /items/{id}
    const response = await axios.delete(`${API_URL}/items/${itemId}`, getAuthHeaders());
    return response.data;
}

// --- Orders & Cart API ---

export const sendCartOrder = async (cartItems, address = "Israel") => {

    const orderPayload = {

        items: cartItems.map(p => ({
            item_id: p.item_id || p.id,
            quantity: p.quantity
        })),
        shipping_address: address,
        total_price: 0
    };


    const response = await axios.post(`${API_URL}/orders/add`, orderPayload, getAuthHeaders());
    return response.data;
}
export const addItemToCart = async (safeId, quantity) => {
    
    const payload = {
        items: [
            {
                item_id: safeId,     // שים לב: camelCase כדי שהשרת יזהה
                quantity: quantity
            }
        ]
        
    };
    console.log("Sending payload:", payload);
    // שליחת בקשת POST לשרת
    const response = await axios.post(`${API_URL}/orders/add`, payload, getAuthHeaders());
    return response.data;
}

export const preformServerCheckout = async () => {
    const response = await axios.post(`${API_URL}/orders/checkout`, {}, getAuthHeaders());
    return response.data;
}

export const fetchUserOrders = async () => {
    const response = await axios.get(`${API_URL}/orders/list`, getAuthHeaders());
    return response.data;
}


export const removeCartItem = async (itemId) => {
    const response = await axios.delete(`${API_URL}/orders/remove-item`, {
        headers: getAuthHeaders().headers,
        params: { itemId: itemId }
    });
    return response.data;
}

// --- Favorites API ---

export const addFavorite = async (itemId) => {
    const response = await axios.post(`${API_URL}/favorites/add/${itemId}`, {}, getAuthHeaders());
    return response.data;
}

export const removeFavorite = async (itemId) => {
    const response = await axios.delete(`${API_URL}/favorites/remove/${itemId}`, getAuthHeaders());
    return response.data;
}

export const fetchFavorites = async () => {
    const response = await axios.get(`${API_URL}/favorites/list`, getAuthHeaders());
    return response.data;
}
export const resetPassword = async (resetData) => {

    const response = await axios.post(`${API_URL}/users/reset-password`, resetData);
    return response.data;
};