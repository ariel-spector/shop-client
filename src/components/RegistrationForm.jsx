import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/apiService';
import {
  Paper, Typography, TextField, Button, Grid, Box, IconButton,
  InputAdornment, Alert, MenuItem, Select, FormControl, InputLabel, Avatar, Link, Container
} from '@mui/material';


import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import VpnKeyIcon from '@mui/icons-material/VpnKey';


const inputStyle = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#f9f9f9',
    transition: 'all 0.3s ease',
    '& fieldset': {
      borderColor: '#e0e0e0',
    },
    '&:hover fieldset': {
      borderColor: '#ff4081',
      boxShadow: '0 0 8px rgba(255, 64, 129, 0.2)'
    },
    '&.Mui-focused fieldset': {
      borderColor: '#ff4081',
      borderWidth: '2px'
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#ff4081',
    fontWeight: 'bold'
  },
  '& .MuiInputAdornment-root': {
    color: '#757575'
  },
};

const RegistrationForm = () => {
  const navigate = useNavigate();

  // State
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    username: '',
    password: '',
    role: 'USER'
  });

  const [errors, setErrors] = useState({});
  const [errorFromServer, setErrorFromServer] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { first_name, last_name, email, username, password, phone, address, role } = formData;

  // Regex Logic
  const usernameRegex = /^[a-zA-Z][a-zA-Z0-9]{3,23}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%])[A-Za-z\d!@#$%]{8,24}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]*$/;

  const validateField = (name, value) => {
    let error = '';

    if (!value.trim() && ['first_name', 'last_name', 'email', 'username', 'password'].includes(name)) {
      error = `${name.replace('_', ' ')} is required.`;
    } else if (name === 'username' && !usernameRegex.test(value)) {
      error = 'Username must be 4-24 chars, start with letter.';
    } else if (name === 'password' && !passwordRegex.test(value)) {
      error = "Password: 8-24 chars, Uppercase, Lowercase, Number & Special char.";
    } else if (name === 'email' && !emailRegex.test(value)) {
      error = 'Invalid email format.';
    } else if (name === 'phone' && value && !phoneRegex.test(value)) {
      error = 'Phone number must contain only digits.';
    }
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const isFormValid = Boolean(first_name && last_name && email && username && password) &&
    Object.values(errors).every((err) => !err);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      await register(formData);
      navigate('/login');
    } catch (err) {
      console.error("Registration error:", err);
      let errorMessage = "Registration failed. Please try again.";
      if (err.response && err.response.data) {
        if (typeof err.response.data === "string") {
          errorMessage = err.response.data;

        }
        else if (err.response.data.error) {
          errorMessage = err.response.data.error;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      setErrorFromServer(errorMessage);
      setTimeout(() => setErrorFromServer(''), 5000);
    }
  }

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        backgroundImage: 'url(https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2
      }}
    >
      <Container maxWidth="sm">
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
          <Avatar sx={{ m: 1, bgcolor: '#ff4081', width: 60, height: 60, boxShadow: '0 4px 12px rgba(255, 64, 129, 0.3)' }}>
            <PersonIcon fontSize="large" />
          </Avatar>

          <Typography component="h1" variant="h4" fontWeight="bold" sx={{ mb: 1, color: '#2d2d2d' }}>
            הרשמה לאתר
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            מלא את הפרטים כדי להתחיל בחווית הקנייה
          </Typography>

          {errorFromServer && (
            <Alert severity="error" sx={{ width: '100%', mb: 2, borderRadius: 2 }}>{errorFromServer}</Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <Grid container spacing={2}>

              <Grid item xs={12} sm={6}>
                <TextField
                  name="first_name"
                  required
                  fullWidth
                  label="שם פרטי"
                  value={first_name}
                  onChange={handleChange}
                  error={Boolean(errors.first_name)}
                  helperText={errors.first_name}
                  // 👇 תיקון: שימוש ב-slotProps
                  slotProps={{
                    input: {
                      startAdornment: (<InputAdornment position="start"><PersonIcon color="action" /></InputAdornment>)
                    }
                  }}
                  sx={inputStyle}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="last_name"
                  required
                  fullWidth
                  label="שם משפחה"
                  value={last_name}
                  onChange={handleChange}
                  error={Boolean(errors.last_name)}
                  helperText={errors.last_name}
                  sx={inputStyle}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="אימייל"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  error={Boolean(errors.email)}
                  helperText={errors.email}

                  slotProps={{
                    input: {
                      startAdornment: (<InputAdornment position="start"><EmailIcon color="action" /></InputAdornment>)
                    }
                  }}
                  sx={inputStyle}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="טלפון"
                  name="phone"
                  value={phone}
                  onChange={handleChange}
                  error={Boolean(errors.phone)}
                  helperText={errors.phone}

                  slotProps={{
                    input: {
                      startAdornment: (<InputAdornment position="start"><PhoneIcon color="action" /></InputAdornment>)
                    }
                  }}
                  sx={inputStyle}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={inputStyle}>
                  <InputLabel>תפקיד</InputLabel>
                  <Select
                    name="role"
                    value={role}
                    label="תפקיד"
                    onChange={handleChange}
                  >
                    <MenuItem value="USER">לקוח (User)</MenuItem>
                    <MenuItem value="ADMIN">מנהל (Admin)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="כתובת (אופציונלי)"
                  name="address"
                  value={address}
                  onChange={handleChange}

                  slotProps={{
                    input: {
                      startAdornment: (<InputAdornment position="start"><HomeIcon color="action" /></InputAdornment>)
                    }
                  }}
                  sx={inputStyle}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="שם משתמש"
                  name="username"
                  value={username}
                  onChange={handleChange}
                  error={Boolean(errors.username)}
                  helperText={errors.username}

                  slotProps={{
                    input: {
                      startAdornment: (<InputAdornment position="start"><LockOutlinedIcon color="action" /></InputAdornment>)
                    }
                  }}
                  sx={inputStyle}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="סיסמה"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={handleChange}
                  error={Boolean(errors.password)}
                  helperText={errors.password}

                  slotProps={{
                    input: {
                      startAdornment: (<InputAdornment position="start"><VpnKeyIcon color="action" /></InputAdornment>),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }
                  }}
                  sx={inputStyle}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={!isFormValid}
              sx={{
                mt: 4, mb: 2, py: 1.5,
                fontSize: '1.2rem',
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
              הירשם עכשיו
            </Button>

            <Grid container justifyContent="center">
              <Grid item>
                <Link href="/login" variant="body2" sx={{ fontWeight: 'bold', color: '#555', textDecoration: 'none', '&:hover': { color: '#ff4081' } }}>
                  כבר רשום? התחבר לחשבון
                </Link>
              </Grid>
            </Grid>

          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegistrationForm;






