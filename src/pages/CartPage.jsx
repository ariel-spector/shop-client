import React, { useState } from 'react';
import { sendCartOrder, preformServerCheckout } from '../services/apiService';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';


import {
  Container, Typography, Button, Box, Paper, IconButton, TextField, Grid, Divider, Avatar, Stack, Alert
} from '@mui/material';


import DeleteIcon from '@mui/icons-material/DeleteOutline';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBagOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LoginIcon from '@mui/icons-material/Login';

const CartPage = () => {
  const { cart, removeFromCart, clearCart, addToCart, decreaseQuantity } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();


  const [address, setAddress] = useState(user?.address || "Tel Aviv, Israel");


  const subtotal = cart.reduce((total, item) => total + (item.item_price || 0) * (item.quantity || 1), 0);
  const shipping = subtotal > 100 ? 0 : 15;
  const total = subtotal + shipping;


  const handleIncrement = (item) => addToCart(item, 1);
  const handleDecrement = (item) => {
    if (item.quantity > 1) decreaseQuantity(item.item_id);
  };


  const handleCheckoutClick = async () => {
    if (!user) {

      navigate('/login', { state: { from: '/cart' } });
      return;
    }


    if (cart.length === 0) return;
    try {
      console.log("Sending order...");
      await sendCartOrder(cart, address);
      await preformServerCheckout();
      clearCart();
      alert("Checkout completed successfully! 🎉");
      navigate('/profile');
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Checkout failed. Please try again.");
    }
  };


  if (cart.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar sx={{ width: 100, height: 100, bgcolor: '#f5f5f5', mb: 3 }}>
          <ShoppingBagIcon sx={{ fontSize: 50, color: '#999' }} />
        </Avatar>
        <Typography variant="h4" fontWeight="bold" gutterBottom>Your Cart is Empty</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Looks like you haven't added anything yet.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/')}
          sx={{
            bgcolor: '#1a1a1a',
            color: 'white',
            borderRadius: '50px',
            px: 5,
            '&:hover': { bgcolor: '#ff4081' }
          }}
        >
          Start Shopping
        </Button>
      </Container>
    );
  }


  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 8 }}>


      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" fontWeight="bold">Shopping Cart ({cart.length})</Typography>
      </Box>

      {/* באנר לאורחים בלבד */}
      {!user && (
        <Alert severity="info" sx={{ mb: 4, borderRadius: 2 }}>
          אתה גולש כאורח. <b>התחבר עכשיו</b> כדי לשמור את העגלה ולצבור נקודות!
        </Alert>
      )}

      <Grid container spacing={4}>


        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid #eee', overflow: 'hidden' }}>
            {cart.map((item, index) => (
              <Box key={item.item_id}>
                <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>


                  <Avatar
                    src={item.photo_url || item.item_image}
                    variant="rounded"
                    sx={{ width: 100, height: 100, borderRadius: 2 }}
                  />


                  <Box sx={{ flexGrow: 1, minWidth: '200px' }}>
                    <Typography variant="h6" fontWeight="bold">{item.item_name}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Item ID: {item.item_id}
                    </Typography>
                    <Typography variant="body1" color="#ff4081" fontWeight="bold">
                      ${item.item_price}
                    </Typography>
                  </Box>


                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Stack direction="row" alignItems="center" sx={{ border: '1px solid #ddd', borderRadius: '50px', px: 1 }}>
                      <IconButton size="small" onClick={() => handleDecrement(item)} disabled={item.quantity <= 1}>
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <Typography variant="body1" fontWeight="bold" sx={{ mx: 2 }}>
                        {item.quantity || 1}
                      </Typography>
                      <IconButton size="small" onClick={() => handleIncrement(item)}>
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Stack>

                    <Typography variant="h6" fontWeight="bold" sx={{ minWidth: '80px', textAlign: 'right' }}>
                      ${(item.item_price * (item.quantity || 1)).toFixed(2)}
                    </Typography>

                    <IconButton color="error" onClick={() => removeFromCart(item.item_id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                {index < cart.length - 1 && <Divider />}
              </Box>
            ))}
          </Paper>

          <Button
            startIcon={<DeleteIcon />}
            color="error"
            sx={{ mt: 2 }}
            onClick={clearCart}
          >
            Clear Shopping Cart
          </Button>
        </Grid>


        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 4, bgcolor: '#fafafa', position: 'sticky', top: 100 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>Order Summary</Typography>
            <Divider sx={{ mb: 2 }} />

            <Stack spacing={2} sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Subtotal</Typography>
                <Typography fontWeight="bold">${subtotal.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Shipping</Typography>
                <Typography fontWeight="bold" color={shipping === 0 ? 'success.main' : 'text.primary'}>
                  {shipping === 0 ? 'Free' : `$${shipping}`}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Typography variant="h6" fontWeight="bold">Total</Typography>
                <Typography variant="h5" fontWeight="bold" color="#ff4081">${total.toFixed(2)}</Typography>
              </Box>
            </Stack>


            <Box sx={{ mb: 3, bgcolor: 'white', p: 2, borderRadius: 2, border: '1px solid #eee' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: '#666' }}>
                <LocalShippingIcon fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="subtitle2">Shipping Address</Typography>
              </Box>
              <TextField
                fullWidth
                variant="standard"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={!user}
                placeholder={!user ? "Login to set address" : "Enter address"}
                InputProps={{ disableUnderline: true, style: { fontWeight: 'bold' } }}
              />
            </Box>


            <Button
              variant="contained"
              fullWidth
              size="large"
              startIcon={user ? <CreditCardIcon /> : <LoginIcon />}
              onClick={handleCheckoutClick}
              sx={{
                bgcolor: user ? '#1a1a1a' : '#ff4081',
                color: 'white',
                py: 1.5,
                borderRadius: '50px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                transition: '0.3s',
                '&:hover': {
                  bgcolor: user ? '#ff4081' : '#f50057',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              {user ? 'Checkout' : 'Login to Checkout'}
            </Button>

            <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 2, color: '#999' }}>
              <LocalShippingIcon fontSize="small" />
              <Typography variant="caption">Secure Checkout & Fast Shipping</Typography>
            </Stack>

          </Paper>
        </Grid>

      </Grid>
    </Container>
  );
};

export default CartPage;