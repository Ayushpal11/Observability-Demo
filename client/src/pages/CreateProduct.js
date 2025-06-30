import React, { useState } from 'react';
import { Typography, TextField, Button, Box, Alert, Paper } from '@mui/material';
import axios from 'axios';

export default function CreateProduct() {
    const [form, setForm] = useState({ name: '', price: '', stock: '', category: '' });
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
            const res = await axios.post('/api/products', form);
            setSuccess(`Product "${res.data.product.name}" created!`);
            setForm({ name: '', price: '', stock: '', category: '' });
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
            <Typography variant="h4" color="primary" fontWeight={600} mb={2}>Add New Product</Typography>
            <form onSubmit={handleSubmit}>
                <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth margin="normal" required />
                <TextField label="Price" name="price" value={form.price} onChange={handleChange} type="number" fullWidth margin="normal" required />
                <TextField label="Stock" name="stock" value={form.stock} onChange={handleChange} type="number" fullWidth margin="normal" required />
                <TextField label="Category" name="category" value={form.category} onChange={handleChange} fullWidth margin="normal" required />
                <Box mt={2}>
                    <Button type="submit" variant="contained" color="primary" disabled={loading} fullWidth>
                        {loading ? 'Creating...' : 'Create Product'}
                    </Button>
                </Box>
            </form>
            {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </Paper>
    );
} 