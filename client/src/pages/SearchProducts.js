import React, { useState } from 'react';
import { Typography, TextField, Button, Box, Grid, Card, CardContent, CircularProgress, Paper } from '@mui/material';
import axios from 'axios';

export default function SearchProducts() {
    const [form, setForm] = useState({ q: '', category: '', minPrice: '', maxPrice: '' });
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResults([]);
        try {
            const res = await axios.get('/api/search', { params: form });
            setResults(res.data.products || []);
        } catch (err) {
            setError('Failed to search products');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Paper sx={{ p: 4, mb: 4 }}>
                <Typography variant="h4" color="primary" fontWeight={600} mb={2}>Search Products</Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField label="Name" name="q" value={form.q} onChange={handleChange} fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField label="Category" name="category" value={form.category} onChange={handleChange} fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField label="Min Price" name="minPrice" value={form.minPrice} onChange={handleChange} type="number" fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField label="Max Price" name="maxPrice" value={form.maxPrice} onChange={handleChange} type="number" fullWidth />
                        </Grid>
                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="primary" disabled={loading} fullWidth>
                                {loading ? 'Searching...' : 'Search'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
            {loading && <Box textAlign="center" mt={2}><CircularProgress /></Box>}
            {error && <Typography color="error">{error}</Typography>}
            {results.length > 0 && (
                <Box>
                    <Typography variant="h6" mb={2}>Results:</Typography>
                    <Grid container spacing={3}>
                        {results.map(product => (
                            <Grid item xs={12} sm={6} md={4} key={product.id}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" fontWeight={700}>{product.name}</Typography>
                                        <Typography color="text.secondary">Category: {product.category}</Typography>
                                        <Typography color="text.secondary">Price: ${product.price}</Typography>
                                        <Typography color="text.secondary">Stock: {product.stock}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}
        </Box>
    );
} 