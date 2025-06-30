import React, { useEffect, useState } from 'react';
import { Typography, Box, CircularProgress, Alert, Paper } from '@mui/material';
import axios from 'axios';

export default function HealthCheck() {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('/health')
            .then(res => {
                setStatus(res.data.status);
                setLoading(false);
            })
            .catch(() => {
                setError('Backend is not healthy or unreachable');
                setLoading(false);
            });
    }, []);

    return (
        <Paper sx={{ p: 4, maxWidth: 500, mx: 'auto', textAlign: 'center' }}>
            <Typography variant="h4" color="primary" fontWeight={600} mb={2}>Health Check</Typography>
            {loading && <CircularProgress />}
            {error && <Alert severity="error">{error}</Alert>}
            {status && (
                <Alert severity={status === 'healthy' ? 'success' : 'warning'}>
                    Backend status: <b>{status}</b>
                </Alert>
            )}
        </Paper>
    );
} 