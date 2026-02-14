import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; 

import { fetchProducts, searchProducts } from '../services/apiService';


import {
    Grid, 
    CircularProgress,
    Typography,
    Button,
    Container,
    Box
} from '@mui/material';

import SearchOffIcon from '@mui/icons-material/SearchOff';
import ProductCard from './ProductCard';

const AvilabileItemsGrid = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const location = useLocation();
    const navigate = useNavigate(); 

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            try {
                // חילוץ פרמטר החיפוש מה-URL
                const searchParams = new URLSearchParams(location.search);
                const searchTerm = searchParams.get('search');

                let data;
                if (searchTerm) {
                    console.log("searching for:", searchTerm);
                    data = await searchProducts(searchTerm);
                } else {
                    console.log("fetching all products");
                    data = await fetchProducts();
                }
                
               
                setProducts(Array.isArray(data) ? data : []);

            } catch (error) {
                console.error("Error loading products:", error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [location.search]); 

    
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    
    if (products.length === 0) {
        return (
            <Container sx={{ textAlign: 'center', mt: 5 }}>
                <SearchOffIcon sx={{ fontSize: 60, color: 'gray', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                    לא נמצאו מוצרים תואמים לחיפוש שלך 😕
                </Typography>
                <Button 
                    variant="outlined" 
                    onClick={() => navigate('/')} 
                >
                    נקה חיפוש והצג הכל
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ padding: 3 }}>
            <Typography variant='h4' fontWeight="bold" sx={{ mb: 4, textAlign: "center" }}>
                {location.search ? "תוצאות חיפוש 🔍" : "המוצרים שלנו 🛍️"}
            </Typography>

            
            <Grid container spacing={3}>
                {products.map((item) => (
                   
                    <Grid key={item.item_id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                        <ProductCard product={item} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default AvilabileItemsGrid;