
import React, { useState, useContext } from 'react';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import { fetchCurrentUser, login, setAuthHeaders } from '../services/apiService';
import UserContext from '../contexts/UserContext';


// Material UI Imports
import {
  Paper, Typography, TextField, Button, Box, IconButton,
  InputAdornment, Alert, Avatar, Link, Container, Checkbox, FormControlLabel
} from '@mui/material';

// Icons
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';


const inputStyle = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#f9f9f9',
    transition: 'all 0.3s ease',
    '& fieldset': { borderColor: '#e0e0e0' },
    '&:hover fieldset': {
      borderColor: '#ff4081', 
      boxShadow: '0 0 8px rgba(255, 64, 129, 0.2)'
    },
    '&.Mui-focused fieldset': {
      borderColor: '#ff4081', 
      borderWidth: '2px'
    },
  },
  '& .MuiInputLabel-root.Mui-focused': { color: '#ff4081', fontWeight: 'bold' },
  '& .MuiInputAdornment-root': { color: '#757575' },
};

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { loginUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();



  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    try {
      
      const loginResponse = await login({ username, password });


      const token = loginResponse.data.jwt || loginResponse.data; 

     
      setAuthHeaders(token);

      
      try {
        const userResponse = await fetchCurrentUser();
        console.log('Fetched user:', userResponse.data);

       
        loginUser(userResponse.data, token);
        const origin = location.state?.from || '/'; 
        navigate(origin, { replace: true });


      } catch (userError) {
        console.error('Failed to fetch current user:', userError);
        setError('Login successful, but failed to load user data.');
      }

    } catch (err) {
      console.error('Login failed:', err);

      if (err.response && (err.response.status === 403 || err.response.status === 401)) {
        setError("Invalid username or password.");
      } else if (err.code === "ERR_NETWORK") {
        setError("Network error: Please check your internet connection.");
      } else {
        setError("Login failed. Please try again.");
      }

      
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)', 
        backgroundImage: 'url(https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={10}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.96)', 
            backdropFilter: 'blur(5px)' 
          }}
        >
          
          <Avatar sx={{ m: 1, bgcolor: '#ff4081', width: 56, height: 56, boxShadow: '0 4px 10px rgba(255, 64, 129, 0.4)' }}>
            <LockOutlinedIcon fontSize="large" />
          </Avatar>

          <Typography component="h1" variant="h4" fontWeight="bold" sx={{ mb: 1, color: '#333' }}>
            Sign In
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Welcome back! Please login to continue.
          </Typography>

          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>

            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              
              slotProps={{
                input: {
                  startAdornment: (<InputAdornment position="start"><PersonIcon color="action" /></InputAdornment>)
                }
              }}
              sx={inputStyle}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              
              slotProps={{
                input: {
                  startAdornment: (<InputAdornment position="start"><LockOutlinedIcon color="action" /></InputAdornment>),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
              sx={inputStyle}
            />

            {error && <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>{error}</Alert>}

            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
              <FormControlLabel
                control={<Checkbox value="remember" sx={{ color: '#ff4081', '&.Mui-checked': { color: '#ff4081' } }} />}
                label={<Typography variant="body2" color="text.secondary">Remember me</Typography>}
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              startIcon={<LoginIcon />}
              sx={{
                mt: 3, mb: 2, py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                backgroundColor: '#ff4081',
                borderRadius: '50px',
                boxShadow: '0 8px 20px rgba(255, 64, 129, 0.3)',
                transition: '0.3s',
                '&:hover': {
                  backgroundColor: '#f50057',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 25px rgba(255, 64, 129, 0.5)'
                }
              }}
            >
              Sign In
            </Button>
            <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
              שכחת סיסמה?
              <Button onClick={() => navigate('/reset-password')} size="small">
                לחץ כאן לאיפוס
              </Button>
            </Typography>

            
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link
                  component={RouterLink}
                  to="/register"
                  sx={{
                    fontWeight: 'bold',
                    color: '#333',
                    textDecoration: 'none',
                    '&:hover': { color: '#ff4081' }
                  }}
                >
                  Sign Up
                </Link>
              </Typography>
            </Box>

          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginForm;