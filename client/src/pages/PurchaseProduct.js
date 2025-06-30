import React, { useState } from 'react';
import { Typography, TextField, Button, Box, Alert, Paper } from '@mui/material';
import axios from 'axios';

export default function PurchaseProduct() {
    const [form, setForm] = useState({ productId: '', quantity: '', customerId: '' });
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(null);
        setError(null);
        try {
            const res = await axios.post('/api/purchase', {
                productId: parseInt(form.productId),
                quantity: parseInt(form.quantity),
                customerId: form.customerId || undefined,
            });
            setSuccess(`Order placed! Order ID: ${res.data.orderId}, Total: $${res.data.total}`);
            setForm({ productId: '', quantity: '', customerId: '' });
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to purchase product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
            <Typography variant="h4" color="primary" fontWeight={600} mb={2}>Purchase Product</Typography>
            <form onSubmit={handleSubmit}>
                <TextField label="Product ID" name="productId" value={form.productId} onChange={handleChange} type="number" fullWidth margin="normal" required />
                <TextField label="Quantity" name="quantity" value={form.quantity} onChange={handleChange} type="number" fullWidth margin="normal" required />
                <TextField label="Customer ID (optional)" name="customerId" value={form.customerId} onChange={handleChange} fullWidth margin="normal" />
                <Box mt={2}>
                    <Button type="submit" variant="contained" color="primary" disabled={loading} fullWidth>
                        {loading ? 'Purchasing...' : 'Purchase'}
                    </Button>
                </Box>
            </form>
            {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </Paper>
    );
} 