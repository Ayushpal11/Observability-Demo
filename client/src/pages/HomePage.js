import React from 'react';
import { Box, Typography, Button, Grid, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AddBoxIcon from '@mui/icons-material/AddBox';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';

const features = [
    { label: 'Browse Products', icon: <StorefrontIcon />, to: '/products' },
    { label: 'Add Product', icon: <AddBoxIcon />, to: '/create' },
    { label: 'Purchase', icon: <ShoppingCartIcon />, to: '/purchase' },
    { label: 'Search', icon: <SearchIcon />, to: '/search' },
    { label: 'Health Check', icon: <FavoriteIcon />, to: '/health' },
];

export default function HomePage() {
    return (
        <Box textAlign="center" mt={4}>
            <Typography variant="h3" gutterBottom fontWeight={700} color="primary">
                Welcome to the Observability Demo Shop
            </Typography>
            <Typography variant="h6" color="text.secondary" mb={4}>
                Explore, create, and monitor products with full observability powered by OpenTelemetry & SigNoz.
            </Typography>
            <Grid container spacing={3} justifyContent="center">
                {features.map((f) => (
                    <Grid item xs={12} sm={6} md={4} key={f.label}>
                        <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                            <Button
                                component={Link}
                                to={f.to}
                                variant="contained"
                                color="primary"
                                startIcon={f.icon}
                                size="large"
                                fullWidth
                                sx={{ fontWeight: 600, fontSize: '1.1rem', py: 2 }}
                            >
                                {f.label}
                            </Button>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
} 