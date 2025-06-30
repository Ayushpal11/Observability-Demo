import React, { useEffect, useState } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Box } from '@mui/material';
import api from '../api';

export default function PurchaseHistory() {
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.get('/api/purchases')
            .then(res => {
                setPurchases(res.data.purchases || []);
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to fetch purchase history');
                setLoading(false);
            });
    }, []);

    if (loading) return <Box textAlign="center" mt={4}><CircularProgress /></Box>;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box>
            <Typography variant="h4" color="primary" fontWeight={600} mb={2}>Purchase History</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Order ID</TableCell>
                            <TableCell>Product</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell>Timestamp</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {purchases.map((p, idx) => (
                            <TableRow key={p.orderId + idx}>
                                <TableCell>{p.orderId}</TableCell>
                                <TableCell>{p.productName} (ID: {p.productId})</TableCell>
                                <TableCell>{p.quantity}</TableCell>
                                <TableCell>${p.total}</TableCell>
                                <TableCell>{p.customerId}</TableCell>
                                <TableCell>{new Date(p.timestamp).toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {purchases.length === 0 && <Typography mt={2}>No purchases yet.</Typography>}
        </Box>
    );
} 