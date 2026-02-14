import React, { useContext, useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, Container, Badge, IconButton,
  InputBase, Paper, List, ListItem, Avatar, ListItemText, ListItemButton, Stack, Divider
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import UserContext from '../contexts/UserContext';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { searchProducts } from '../services/apiService';


import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#aaa',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    color: '#fff',
    [theme.breakpoints.up('md')]: {
      width: '30ch',
    },
  },
}));
// ----------------------------------------------------

const NavBar = () => {
  const { user, logoutUser } = useContext(UserContext);
  const isAdmin = user && (user.role === 'ADMIN' || user?.roles?.includes('ADMIN'));
  const { cart } = useCart();
  const navigate = useNavigate();
  const cartItemCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);
  const { favorites } = useFavorites();


  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropDown, setShowDropDown] = useState(false);

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length > 1) {
      try {
        const results = await searchProducts(value);
        setSearchResults(results);
        setShowDropDown(true);
      } catch (error) {
        console.log("Live Search Failed", error)
      }
    } else {
      setSearchResults([]);
      setShowDropDown(false);
    }
  }

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      if (!searchTerm || searchTerm.trim() === "") return;
      setShowDropDown(false);
      navigate(`/search?search=${searchTerm}`);
    }
  }

  const handleResultClick = (itemName) => {
    setSearchTerm(itemName);
    setShowDropDown(false);
    navigate(`/search?search=${itemName}`);
  }

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#1a1a1a', boxShadow: '0 4px 20px rgba(0,0,0,0.4)', borderBottom: '1px solid #333' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>


          <Box
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => navigate('/home')}
          >
            <ShoppingBagIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: '#ff4081', fontSize: 32 }} />
            <Typography variant="h6" noWrap sx={{ mr: 2, display: { xs: 'flex' }, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '.1rem', color: 'white', textDecoration: 'none' }}>
              ARIEL<span style={{ color: '#ff4081' }}>SHOP</span>
            </Typography>
          </Box>


          <Box sx={{ position: 'relative', flexGrow: 1, maxWidth: '600px', mx: 2 }}>
            <Search>
              <SearchIconWrapper><SearchIcon /></SearchIconWrapper>
              <StyledInputBase
                placeholder="Search items..."
                inputProps={{ 'aria-label': 'search' }}
                value={searchTerm}
                onChange={handleInputChange}
                onKeyDown={handleSearch}
                onBlur={() => setTimeout(() => setShowDropDown(false), 200)}
              />
            </Search>

            {showDropDown && searchResults.length > 0 && (
              <Paper sx={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10, mt: 1, bgcolor: '#2d2d2d', color: 'white', boxShadow: '0 8px 16px rgba(0,0,0,0.5)' }}>
                <List dense>
                  {searchResults.map((item) => (
                    <ListItem key={item.item_id} disablePadding>
                      <ListItemButton onClick={() => handleResultClick(item.item_name)} sx={{ '&:hover': { bgcolor: '#3d3d3d' } }}>
                        <Avatar src={item.item_image || item.photo_url} variant='rounded' sx={{ width: 30, height: 30, mr: 2 }} />
                        <ListItemText primary={item.item_name} secondaryTypographyProps={{ color: '#aaa' }} secondary={`$${item.item_price}`} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </Box>


          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>


            {isAdmin && (
              <Button component={Link} to="/add-product" startIcon={<AdminPanelSettingsIcon />} sx={{ color: '#ffd700', fontWeight: 'bold', borderColor: '#ffd700', display: { xs: 'none', md: 'flex' }, mr: 2, '&:hover': { bgcolor: 'rgba(255, 215, 0, 0.1)' } }} variant="outlined" size="small">
                Admin Panel
              </Button>
            )}


            {user && (
              <>
                <IconButton onClick={() => navigate('/profile')} sx={{ color: 'white', '&:hover': { color: '#2196f3', transform: 'scale(1.1)' } }} title="My Orders">
                  <ShoppingBagIcon />
                </IconButton>

                <IconButton onClick={() => navigate('/favorites')} sx={{ color: 'white', '&:hover': { color: '#ff4081', transform: 'scale(1.1)' } }}>
                  <Badge badgeContent={favorites.length} color="error">
                    <FavoriteIcon />
                  </Badge>
                </IconButton>
              </>
            )}


            <IconButton onClick={() => navigate('/cart')} sx={{ color: 'white', mr: 2, '&:hover': { color: '#4caf50', transform: 'scale(1.1)' } }}>
              <Badge badgeContent={cartItemCount} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            <Divider orientation="vertical" flexItem sx={{ bgcolor: '#444', display: { xs: 'none', md: 'block' } }} />


            {user ? (
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 2, gap: 1 }}>
                <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/profile')}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: '#ff4081', mr: 1, fontSize: '0.9rem' }}>
                    {user.first_name ? user.first_name[0].toUpperCase() : <AccountCircleIcon />}
                  </Avatar>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'white' }}>
                    {user.first_name || user.username}
                  </Typography>
                </Box>
                <IconButton onClick={handleLogout} sx={{ color: '#aaa', '&:hover': { color: 'white' } }}>
                  <LogoutIcon />
                </IconButton>
              </Box>
            ) : (
              <Stack direction="row" spacing={1} sx={{ ml: 2 }}>
                <Button component={Link} to="/login" color="inherit" sx={{ fontWeight: 'bold' }}>Login</Button>
                <Button component={Link} to="/register" variant="contained" sx={{ bgcolor: '#ff4081', borderRadius: '20px', fontWeight: 'bold', textTransform: 'none', '&:hover': { bgcolor: '#f50057' } }}>Sign Up</Button>
              </Stack>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;