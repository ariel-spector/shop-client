import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';


import AvilabileItemsGrid from '../components/AvilabileItemsGrid';
const HeroSection = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        height: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: '#fff',

        backgroundImage: 'url("https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        marginBottom: 4,
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
      }}
    >

      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 1
        }}
      />


      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: 800,
            mb: 2,
            letterSpacing: '2px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            fontSize: { xs: '2.5rem', md: '4rem' }
          }}
        >
          WELCOME TO <span style={{ color: '#ff4081' }}>ARIELSHOP</span>
        </Typography>

        <Typography variant="h5" sx={{ mb: 4, fontWeight: 300, opacity: 0.9 }}>
          המותגים הכי שווים, המחירים הכי טובים. התחילו לקנות עכשיו!
        </Typography>

        <Button
          variant="contained"
          size="large"
          sx={{
            backgroundColor: '#ff4081',
            padding: '12px 36px',
            fontSize: '1.2rem',
            borderRadius: '50px',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#f50057',
              transform: 'scale(1.05)',
              transition: 'all 0.3s ease'
            }
          }}
          onClick={() => {

            window.scrollTo({ top: window.innerHeight * 0.7, behavior: 'smooth' });
          }}
        >
          Explore Collection 🛍️
        </Button>
      </Container>
    </Box>
  );
};




const Home = () => {
  return (
    <>
      <HeroSection />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{
            textAlign: 'center',
            mb: 6,
            position: 'relative',
            display: 'inline-block',
            left: '50%',
            transform: 'translateX(-50%)',
            '&::after': { // פס ורוד מתחת לכותרת
              content: '""',
              display: 'block',
              width: '60px',
              height: '4px',
              backgroundColor: '#ff4081',
              margin: '10px auto 0',
              borderRadius: '2px'
            }
          }}
        >
          Featured Products
        </Typography>
      </Container>
      <AvilabileItemsGrid />
    </>
  )
}

export default Home