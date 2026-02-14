import React, { useState } from "react";
import { addProduct } from "../services/apiService";
import { useNavigate } from "react-router-dom";
import { 
  TextField, 
  Button, 
  Container, 
  Typography, 
  Box, 
  Paper,
  Alert 
} from "@mui/material";

const AddProduct = () => {
    const navigate = useNavigate();

   
    
    const [productData, setProductData] = useState({
        item_name: "",
        item_price: "",
        item_quantity: "",
        photo_url: "",
        brand_name: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        
        if (parseFloat(productData.item_price) <= 0) {
            setError("Price must be a positive number");
            setLoading(false);
            return;
        }

        try {
            // המרת המחרוזות למספרים בשביל ה-Backend (Java מצפה ל-Double ו-Int)
            const dataToSend = {
                ...productData,
                item_price: parseFloat(productData.item_price),
                item_quantity: parseInt(productData.item_quantity)
            };
            
            // GOSLING: Calling apiService without passing token manually
            await addProduct(dataToSend);
            
            alert("Product added successfully!"); // אפשר להחליף ב-Snackbar בעתיד
            navigate("/home"); // חזרה לדף הבית לראות את המוצר החדש
            
        } catch (error) {
            console.error("Add Product Error:", error);
            // הצגת הודעה ברורה מהשרת (אם יש) או הודעה כללית
            setError(error.response?.data || "Failed to add product. Please check your inputs.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm"> 
            <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
                
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    Add New Product 📦
                </Typography>

                {/* הצגת שגיאות בצורה יפה */}
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    
                    <TextField
                        label="Item Name"
                        name="item_name"
                        value={productData.item_name}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        required
                    />

                    <Box sx={{ display: "flex", gap: 2 }}>
                        <TextField
                            label="Price ($)"
                            name="item_price"
                            type="number"
                            value={productData.item_price}
                            onChange={handleChange}
                            fullWidth
                            required
                            inputProps={{ min: "0", step: "0.01" }} // HTML5 Validations
                        />
                        <TextField
                            label="Quantity"
                            name="item_quantity"
                            type="number"
                            value={productData.item_quantity}
                            onChange={handleChange}
                            fullWidth
                            required
                            inputProps={{ min: "1" }}
                        />
                    </Box>

                    <TextField
                        label="Image URL"
                        name="photo_url"
                        value={productData.photo_url}
                        onChange={handleChange}
                        fullWidth
                        placeholder="http://example.com/image.jpg"
                    />
                    
                    {/* Image Preview Logic */}
                    {productData.photo_url && (
                        <Box sx={{ mt: 1, textAlign: 'center', p: 1, border: '1px dashed #ccc', borderRadius: 1 }}>
                            <Typography variant="caption" display="block" gutterBottom>Preview</Typography>
                            <img 
                                src={productData.photo_url} 
                                alt="Preview" 
                                style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }} 
                                onError={(e) => e.target.style.display = 'none'} 
                            />
                        </Box>
                    )}

                    <TextField
                        label="Brand Name"
                        name="brand_name"
                        value={productData.brand_name}
                        onChange={handleChange}
                        fullWidth
                    />

                    <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary" 
                        size="large"
                        disabled={loading}
                        sx={{ mt: 2 }}
                    >
                        {loading ? "Adding..." : "Add Product"}
                    </Button>

                </Box>
            </Paper>
        </Container>
    );
};

export default AddProduct;
        

