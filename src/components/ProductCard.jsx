import React, { useState } from 'react';
import { useFavorites } from '../contexts/FavoritesContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
  Chip,
  Box,
  Rating,
  Stack
} from '@mui/material';

// Icons
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Navigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { user } = useAuth();
  const Navigate = useNavigate();
  
  // בדיקה אם המוצר במועדפים (בהתאם ללוגיקה שלך)
  const isLiked = isFavorite(product.item_id);

  const [quantityToAdd, setQuantityToAdd] = useState(1);
  const isOutOfStock = product.item_quantity === 0;

  // חישוב מחיר "מקורי" פיקטיבי בשביל הרושם (אופציונלי)
  const originalPrice = (product.item_price * 1.2).toFixed(2);

  const handleIncrement = () => {
    if (quantityToAdd < product.item_quantity) {
      setQuantityToAdd(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantityToAdd > 1) {
      setQuantityToAdd(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantityToAdd);
    setQuantityToAdd(1);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();

    if(!user){
      Navigate('/login');
      alert("אתה חייב להתחבר כדי להוסיף מוצרים למועדפים");
      return;
    }

    toggleFavorite(product.item_id);

  }

  return (
    <Card 
      sx={{ 
        maxWidth: 345, 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        position: 'relative',
        borderRadius: '20px', // פינות עגולות
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        transition: 'all 0.3s ease',
        overflow: 'visible', // כדי שהצללית לא תיחתך
        '&:hover': {
            transform: 'translateY(-10px)', // עולה למעלה
            boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
        }
      }}
    >
      {/* --- אזור התמונה --- */}
      <Box sx={{ position: 'relative', height: 260, overflow: 'hidden', borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
        
        {/* כפתור מועדפים צף עם אפקט זכוכית */}
        <IconButton
          onClick={handleFavoriteClick}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(4px)',
            transition: '0.3s',
            '&:hover': { backgroundColor: 'white', color: '#ff4081', transform: 'scale(1.1)' }
          }}
        >
          {isLiked ? <FavoriteIcon sx={{ color: '#ff4081' }} /> : <FavoriteBorderIcon />}
        </IconButton>

        {/* תגית מלאי / מבצע */}
        {isOutOfStock ? (
             <Chip label="SOLD OUT" color="error" size="small" sx={{ position: 'absolute', top: 12, left: 12, fontWeight: 'bold' }} />
        ) : (
             <Chip label="SALE" size="small" sx={{ position: 'absolute', top: 12, left: 12, bgcolor: '#1a1a1a', color: 'white', fontWeight: 'bold' }} />
        )}

        {/* התמונה עצמה */}
        <CardMedia
          component="img"
          height="100%"
          image={product.photo_url || "https://via.placeholder.com/300?text=No+Image"}
          alt={product.item_name}
          sx={{ 
            objectFit: 'cover', 
            transition: 'transform 0.5s ease',
            filter: isOutOfStock ? 'grayscale(100%) opacity(0.8)' : 'none',
            '&:hover': { transform: !isOutOfStock ? 'scale(1.1)' : 'none' } // זום רק אם יש מלאי
          }}
        />
      </Box>

      {/* --- תוכן הכרטיס --- */}
      <CardContent sx={{ flexGrow: 1, pt: 3, px: 2 }}>
        
        {/* דירוג כוכבים (סטטי כרגע, ליופי) */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                {product.category || 'Collection'}
            </Typography>
            <Rating value={4.5} readOnly size="small" sx={{ color: '#ffb400' }} />
        </Box>

        <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {product.item_name}
        </Typography>

        {/* מחיר */}
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 2 }}>
             <Typography variant="h5" color="#ff4081" fontWeight="bold">
                ${product.item_price}
            </Typography>
            <Typography variant="body2" sx={{ textDecoration: 'line-through', color: '#ccc' }}>
                ${originalPrice}
            </Typography>
        </Box>

        {/* סטטוס מלאי טקסטואלי */}
        {isOutOfStock ? (
           <Typography variant='caption' color='error' fontWeight="bold" sx={{ display: 'block', mb: 1 }}>
              🚫 0 items left in stock
           </Typography>
        ) : (
           <Typography variant='caption' color='success.main' fontWeight="bold" sx={{ display: 'block', mb: 1 }}>
              ✅ Only {product.item_quantity} left in stock
           </Typography>
        )}
      </CardContent>

      {/* --- אזור הפעולות (כמות + כפתור) --- */}
      {!isOutOfStock && (
        <Box sx={{ px: 2, mb: 2 }}>
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ bgcolor: '#f5f5f5', borderRadius: '50px', p: 0.5, mb: 2 }}>
                <IconButton size='small' onClick={handleDecrement} disabled={quantityToAdd <= 1} sx={{ color: '#1a1a1a' }}>
                    <RemoveIcon fontSize="small" />
                </IconButton>
                <Typography variant="body1" fontWeight="bold" sx={{ minWidth: '20px', textAlign: 'center' }}>
                    {quantityToAdd}
                </Typography>
                <IconButton size='small' onClick={handleIncrement} disabled={quantityToAdd >= product.item_quantity} sx={{ color: '#1a1a1a' }}>
                    <AddIcon fontSize="small" />
                </IconButton>
            </Stack>
        </Box>
      )}

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<ShoppingCartIcon />}
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          sx={{
            bgcolor: '#1a1a1a', // שחור
            color: 'white',
            borderRadius: '50px',
            py: 1.5,
            textTransform: 'none',
            fontWeight: 'bold',
            boxShadow: 'none',
            transition: '0.3s',
            '&:hover': {
                bgcolor: '#ff4081', // ורוד
                boxShadow: '0 8px 20px rgba(255, 64, 129, 0.4)',
                transform: 'scale(1.02)'
            },
            '&.Mui-disabled': {
                bgcolor: '#e0e0e0',
                color: '#999'
            }
          }}
        >
          {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;