import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/UserContext';
import { fetchUserOrders } from '../services/apiService';
import { useNavigate } from 'react-router-dom';
import { deleteCurrentUser } from '../services/apiService';


import {
  Container, Grid, Paper, Typography, Box, Avatar, Tab, Tabs,
  Chip, Button, Divider, CircularProgress, Accordion,
  AccordionSummary, AccordionDetails, Stack, AccordionActions
} from '@mui/material';


import PersonIcon from '@mui/icons-material/Person';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LogoutIcon from '@mui/icons-material/Logout';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const ProfilePage = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const [tabValue, setTabValue] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const loadData = async () => {
      if (user) {
        try {
          const ordersData = await fetchUserOrders();
          setOrders(ordersData);
        } catch (error) {
          console.error("Failed to fetch orders", error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadData();
  }, [user]);

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };
  const handleDeleteAccount = async () => {
    if (window.confirm("ARE YOU SURE? 😱\nThis will delete your account and all your orders permanently!")) {
      try {
        await deleteCurrentUser();
        logoutUser();
        navigate('/');
        alert("Your account has been deleted.");
      } catch (error) {
        console.error("Failed to delete", error);
        alert("Failed to delete account.");
      }
    }
  };

  const handleTabChange = (event, newValue) => setTabValue(newValue);

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'CLOSED': return 'success';
      case 'PENDING': return 'warning';
      case 'TEMP': return 'info';
      default: return 'default';
    }
  };


  const sortedOrders = [...orders].sort((a, b) => {
    if (a.status === 'TEMP') return -1;
    if (b.status === 'TEMP') return 1;
    return new Date(b.orderPlaced) - new Date(a.orderPlaced);
  });

  if (!user) return <Container sx={{ mt: 10, textAlign: 'center' }}><CircularProgress /></Container>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>


      <Paper
        elevation={3}
        sx={{
          p: 4, mb: 4, borderRadius: 4,
          background: 'linear-gradient(135deg, #1a1a1a 0%, #333 100%)',
          color: 'white', display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap'
        }}
      >
        <Avatar sx={{ width: 100, height: 100, bgcolor: '#ff4081', fontSize: '3rem', boxShadow: '0 0 20px rgba(255, 64, 129, 0.5)' }}>
          {user.username?.charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight="bold">Hello, {user.username} 👋</Typography>
          <Typography variant="body1" sx={{ opacity: 0.8 }}>{user.email || "No email provided"}</Typography>
          <Chip label={user.role || "MEMBER"} size="small" sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }} />
        </Box>
        <Button
          variant="outlined" color="error" startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
        >
          Logout
        </Button>
      </Paper>


      <Grid container spacing={3}>
        <Grid item xs={12} sx={{ width: '100%' }}>


          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange} textColor="primary" indicatorColor="primary">
              <Tab icon={<ShoppingBagIcon />} iconPosition="start" label="My Orders" />
              <Tab icon={<PersonIcon />} iconPosition="start" label="Account Details" />
            </Tabs>
          </Box>


          {tabValue === 0 && (
            <Box>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>
              ) : sortedOrders.length === 0 ? (
                <Typography textAlign="center" color="text.secondary" sx={{ py: 5 }}>
                  You haven't placed any orders yet. Time to go shopping! 🛍️
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {sortedOrders.map((order) => (
                    <Accordion

                      key={order.orderId || order.order_id}
                      sx={{
                        borderRadius: '16px !important',
                        overflow: 'hidden',
                        boxShadow: 2,
                        borderLeft: order.status === 'TEMP' ? '8px solid #ff4081' : 'none',
                        bgcolor: order.status === 'TEMP' ? 'rgba(255, 64, 129, 0.05)' : '#fff'
                      }}
                    >
                      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: order.status === 'TEMP' ? 'transparent' : '#fafafa' }}>
                        <Grid container alignItems="center" spacing={2} sx={{ width: '100%' }}>
                          <Grid item xs={6} md={3}>
                            <Typography variant="subtitle2" color="text.secondary">Date</Typography>
                            <Typography fontWeight="bold">
                              {(order.orderPlaced || order.order_placed)
                                ? new Date(order.orderPlaced || order.order_placed).toLocaleDateString()
                                : 'N/A'}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} md={3}>
                            <Typography variant="subtitle2" color="text.secondary">Total</Typography>

                            <Typography fontWeight="bold" color="primary">
                              ${(order.totalPrice || order.total_price || 0).toFixed(2)}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} md={3}>
                            <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                            <Chip
                              label={order.status === 'TEMP' ? "CART (Pending)" : order.status}
                              color={getStatusColor(order.status)}
                              size="small" variant="outlined" sx={{ fontWeight: 'bold' }}
                            />
                          </Grid>
                          <Grid item xs={6} md={3} sx={{ display: { xs: 'none', md: 'block' } }}>

                            <Typography variant="caption" color="text.secondary">Order #{order.orderId}</Typography>
                          </Grid>
                        </Grid>
                      </AccordionSummary>

                      <AccordionDetails sx={{ bgcolor: '#fff', p: 3, borderTop: '1px solid #eee' }}>
                        <Typography variant="subtitle2" sx={{ mb: 2, color: 'gray', textTransform: 'uppercase', letterSpacing: '1px' }}>
                          Items in this order
                        </Typography>
                        <Stack spacing={2}>
                          {order.items && order.items.map((itemObj) => (
                            <Box key={itemObj.item_id || itemObj.itemId || Math.random()} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, borderRadius: 2, '&:hover': { bgcolor: '#f9f9f9' } }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar src={itemObj.photo_url || itemObj.photoUrl} variant="rounded" sx={{ width: 56, height: 56, bgcolor: '#f0f0f0' }}>
                                  {(!itemObj.photo_url && !itemObj.photoUrl) && <ShoppingBagIcon />}
                                </Avatar>
                                <Box>
                                  <Typography variant="body2" fontWeight="bold">
                                    {itemObj.item_name || itemObj.itemName || `Item #${itemObj.item_id}`}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    Price: ${(itemObj.price || 0).toFixed(2)} | Qty: {itemObj.quantity}
                                  </Typography>
                                </Box>
                              </Box>
                              <Typography variant="body2" fontWeight="bold">
                                {((itemObj.price || 0) * (itemObj.quantity || 0)).toFixed(2)}
                              </Typography>
                            </Box>
                          ))}
                        </Stack>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                            <LocalShippingIcon fontSize="small" />
                            <Typography variant="caption">Shipped to: {order.shipping_address || order.shippingAddress || "N/A"}</Typography>
                          </Box>
                          <Typography variant="h6" fontWeight="bold">
                            Total: ${(order.totalPrice || order.total_price || 0).toFixed(2)}
                          </Typography>
                        </Box>
                      </AccordionDetails>


                      {order.status === 'TEMP' && (
                        <AccordionActions sx={{ justifyContent: 'flex-end', p: 2, bgcolor: '#fff' }}>
                          <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<ShoppingBagIcon />}
                            onClick={() => navigate('/cart')}
                            sx={{ bgcolor: '#ff4081', '&:hover': { bgcolor: '#f50057' } }}
                          >
                            Resume Checkout / Edit Cart
                          </Button>
                        </AccordionActions>
                      )}

                    </Accordion>
                  ))}
                </Stack>
              )}
            </Box>
          )}

          {/* --- TAB 1: Account Details --- */}
          {tabValue === 1 && (
            <Paper elevation={0} sx={{ p: 4, border: '1px solid #eee', borderRadius: 4 }}>
              <Typography variant="h6" gutterBottom>Personal Information</Typography>
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Username</Typography>
                  <Typography variant="body1">{user.username}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Email Address</Typography>
                  <Typography variant="body1">{user.email || "Not provided"}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Shipping Address</Typography>
                  <Typography variant="body1">{user.address || "No address saved"}</Typography>
                </Grid>
              </Grid>
              <Box sx={{ mt: 4 }}>
                <Button variant="outlined" disabled>Edit Profile (Coming Soon)</Button>
              </Box>
              <Divider sx={{ my: 4 }} />
              <Box
                sx={{
                  p: 3,
                  border: '1px solid #ef5350',
                  borderRadius: 2,
                  bgcolor: '#ffebee',
                  mt: 4
                }}
              >
                <Typography variant="h6" color="error" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  ⚠️ Danger Zone
                </Typography>

                <Typography variant="body2" color="text.secondary" paragraph>
                  Once you delete your account, there is no going back. All your orders, history, and saved items will be permanently removed.
                </Typography>

                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDeleteAccount}
                  startIcon={<LogoutIcon sx={{ transform: 'rotate(180deg)' }} />}
                  sx={{
                    bgcolor: '#d32f2f',
                    fontWeight: 'bold',
                    '&:hover': { bgcolor: '#b71c1c' }
                  }}
                >
                  Delete My Account Permanently
                </Button>
              </Box>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfilePage;