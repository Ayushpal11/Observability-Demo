import React, { useEffect, useState } from 'react';
import { Typography, Grid, Card, CardContent, CardActions, Button, CircularProgress, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import api from '../api';

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.get('/api/products')
            .then(res => {
                setProducts(res.data.products || res.data);
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to fetch products');
                setLoading(false);
            });
    }, []);

    if (loading) return <Box textAlign="center" mt={4}><CircularProgress /></Box>;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box>
            <Typography variant="h4" gutterBottom fontWeight={600} color="primary">Product List</Typography>
            <Grid container spacing={3}>
                {products.map(product => (
                    <Grid item xs={12} sm={6} md={4} key={product.id}>
                        <Card sx={{ minHeight: 200 }}>
                            <CardContent>
                                <Typography variant="h6" fontWeight={700}>{product.name}</Typography>
                                <Typography color="text.secondary">Category: {product.category}</Typography>
                                <Typography color="text.secondary">Price: ${product.price}</Typography>
                                <Typography color="text.secondary">Stock: {product.stock}</Typography>
                            </CardContent>
                            <CardActions>
                                <Button component={Link} to={`/products/${product.id}`} size="small" color="primary">View Details</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
} 