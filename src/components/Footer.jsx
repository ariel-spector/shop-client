import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#1a1a1a', 
        color: '#fff',
        py: 6, 
        mt: 'auto', 
        borderTop: '4px solid #ff4081' 
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#ff4081' }}>
              ARIELSHOP
            </Typography>
            <Typography variant="body2" sx={{ color: '#aaa' }}>
              החנות המובילה למוצרי אלקטרוניקה ואופנה. 
              אנחנו מתחייבים למחירים הטובים ביותר ולשירות ללא תחרות.
            </Typography>
          </Grid>

          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              קישורים מהירים
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/" color="inherit" underline="hover">דף הבית</Link>
              <Link href="/favorites" color="inherit" underline="hover">המועדפים שלי</Link>
              <Link href="/login" color="inherit" underline="hover">התחברות</Link>
              <Link href="/register" color="inherit" underline="hover">הרשמה</Link>
            </Box>
          </Grid>

          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              עקבו אחרינו
            </Typography>
            <Typography variant="body2" sx={{ color: '#aaa', mb: 2 }}>
              הישארו מעודכנים במבצעים החדשים שלנו!
            </Typography>
            <Box>
              <IconButton color="inherit" aria-label="Facebook">
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram">
                <InstagramIcon sx={{ color: '#E1306C' }} /> 
              </IconButton>
              <IconButton color="inherit" aria-label="Twitter">
                <TwitterIcon sx={{ color: '#1DA1F2' }} />
              </IconButton>
            </Box>
          </Grid>

        </Grid>

        
        <Box sx={{ textAlign: 'center', mt: 4, pt: 2, borderTop: '1px solid #333' }}>
          <Typography variant="body2" sx={{ color: '#666' }}>
            © {new Date().getFullYear()} ArielShop. כל הזכויות שמורות. נבנה על ידי אריאל.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;