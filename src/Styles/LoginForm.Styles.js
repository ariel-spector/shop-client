import { styled } from '@mui/material/styles';
import { Box, Button, Avatar } from '@mui/material';

// יצירת "קופסה" מעוצבת הראשית
export const LoginContainer = styled(Box)({
    marginTop: 64, // הערך 8 ב-MUI שווה בערך ל-64px
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '30px',
    borderRadius: '15px',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
    maxWidth: '400px',
    marginLeft: 'auto',
    marginRight: 'auto',
});

// יצירת האייקון המעוצב
export const StyledAvatar = styled(Avatar)({
    margin: '8px',
    backgroundColor: '#1976d2', // כחול
});

// יצירת הטופס המעוצב
export const StyledForm = styled(Box)({
    width: '100%', 
    marginTop: '8px',
});

// יצירת הכפתור המעוצב
export const StyledButton = styled(Button)({
    marginTop: '24px',
    marginBottom: '16px',
    height: '45px',
    fontSize: '1rem',
    fontWeight: 'bold',
    textTransform: 'none',
});