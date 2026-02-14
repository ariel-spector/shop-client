import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Box, CircularProgress, Button, Stack } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { fetchFavorites } from '../services/apiService';
import ProductCard from '../components/ProductCard';
import { useFavorites } from '../contexts/FavoritesContext';
import { useAuth } from '../contexts/UserContext';

const FavoritesPage = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { favorites } = useFavorites();
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const loadData = async () => {
            try {
                const data = await fetchFavorites();
                setItems(data);
            } catch (error) {
                console.error("Error fetching favorites:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [user, navigate, favorites]);


    if (loading) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                <CircularProgress color="secondary" size={60} />
                <Typography sx={{ mt: 2, color: 'text.secondary', fontWeight: 500 }}>
                    Fetching your favorites...
                </Typography>
            </Box>
        );
    }


    if (items.length === 0) {
        return (
            <Container maxWidth="md" sx={{ textAlign: 'center', mt: 10 }}>
                <Stack spacing={3} alignItems="center">
                    <FavoriteIcon sx={{ fontSize: 80, color: '#e0e0e0' }} />
                    <Typography variant="h5" fontWeight="bold">Your wishlist is empty</Typography>
                    <Typography color="text.secondary">
                        Found something you like? Tap the heart icon to save it here.
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/')}
                        sx={{ borderRadius: '50px', px: 4, bgcolor: '#1a1a1a' }}
                    >
                        Back to Shop
                    </Button>
                </Stack>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>

            <Box sx={{ mb: 6, textAlign: 'center' }}>
                <Typography variant="h3" component="h1" fontWeight="800" gutterBottom>
                    My Favorites
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    All the items you’ve saved in one place.
                </Typography>
            </Box>


            <Grid container spacing={4}>
                {items.map((item) => (
                    <Grid key={item.item_id} size={{ xs: 12, sm: 6, md: 4 }}>
                        <ProductCard product={item} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default FavoritesPage;