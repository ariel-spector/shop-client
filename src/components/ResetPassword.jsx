import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Alert } from '@mui/material';
import { resetPassword } from '../services/apiService';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        newPassword: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

        if (!passwordRegex.test(formData.newPassword)) {
            setStatus({
                type: 'error',
                message: 'הסיסמה חייבת להיות באורך 8 תווים לפחות ולשלב אותיות (A, a) ומספרים.'
            });
            return;
        }
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            await resetPassword(formData);
            setStatus({ type: 'success', message: 'הסיסמה שונתה בהצלחה! מועבר לדף התחברות...' });
            setTimeout(() => navigate('/login'), 3000);
        } catch (error) {
            const errorMsg = error.response?.data || "חלה שגיאה באיפוס הסיסמה. וודא שהפרטים נכונים.";
            setStatus({ type: 'error', message: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    שחזור סיסמה 🔒
                </Typography>

                {status.message && (
                    <Alert severity={status.type} sx={{ mb: 2 }}>{status.message}</Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="שם משתמש"
                        name="username"
                        fullWidth
                        required
                        onChange={handleChange}
                    />
                    <TextField
                        label="אימייל"
                        name="email"
                        type="email"
                        fullWidth
                        required
                        onChange={handleChange}
                    />
                    <TextField
                        label="סיסמה חדשה"
                        name="newPassword"
                        type="password"
                        fullWidth
                        required
                        onChange={handleChange}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={loading}
                        sx={{ mt: 2 }}
                    >
                        {loading ? 'מעדכן...' : 'שנה סיסמה'}
                    </Button>
                    <Button color="secondary" onClick={() => navigate('/login')}>
                        חזור להתחברות
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default ResetPassword;