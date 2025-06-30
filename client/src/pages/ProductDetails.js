import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Typography, Card, CardContent, Button, CircularProgress, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import api from '../api';

export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.get(`/api/products/${id}`)
            .then(res => {
                setProduct(res.data.product || res.data);
                setLoading(false);
            })
            .catch(() => {
                setError('Product not found');
                setLoading(false);
            });
    }, [id]);

    if (loading) return <Box textAlign="center" mt={4}><CircularProgress /></Box>;
    if (error) return <Typography color="error">{error}</Typography>;
    if (!product) return null;

    return (
        <Box>
            <Button component={Link} to="/products" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
                Back to Products
            </Button>
            <Card>
                <CardContent>
                    <Typography variant="h5" fontWeight={700}>{product.name}</Typography>
                    <Typography color="text.secondary">Category: {product.category}</Typography>
                    <Typography color="text.secondary">Price: ${product.price}</Typography>
                    <Typography color="text.secondary">Stock: {product.stock}</Typography>
                    <Typography color="text.secondary">ID: {product.id}</Typography>
                </CardContent>
            </Card>
        </Box>
    );
} 