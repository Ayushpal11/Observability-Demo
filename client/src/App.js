import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AddBoxIcon from '@mui/icons-material/AddBox';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HomeIcon from '@mui/icons-material/Home';
import HistoryIcon from '@mui/icons-material/History';

import HomePage from './pages/HomePage';
import ProductList from './pages/ProductList';
import ProductDetails from './pages/ProductDetails';
import CreateProduct from './pages/CreateProduct';
import PurchaseProduct from './pages/PurchaseProduct';
import SearchProducts from './pages/SearchProducts';
import HealthCheck from './pages/HealthCheck';
import PurchaseHistory from './pages/PurchaseHistory';

function App() {
  return (
    <Router>
      <AppBar position="static" color="primary" enableColorOnDark>
        <Toolbar>
          <StorefrontIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}>
            Observability Demo Shop
          </Typography>
          <Button color="inherit" component={Link} to="/" startIcon={<HomeIcon />}>Home</Button>
          <Button color="inherit" component={Link} to="/products" startIcon={<StorefrontIcon />}>Products</Button>
          <Button color="inherit" component={Link} to="/create" startIcon={<AddBoxIcon />}>Add Product</Button>
          <Button color="inherit" component={Link} to="/purchase" startIcon={<ShoppingCartIcon />}>Purchase</Button>
          <Button color="inherit" component={Link} to="/search" startIcon={<SearchIcon />}>Search</Button>
          <Button color="inherit" component={Link} to="/health" startIcon={<FavoriteIcon />}>Health</Button>
          <Button color="inherit" component={Link} to="/history" startIcon={<HistoryIcon />}>History</Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="md">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/create" element={<CreateProduct />} />
            <Route path="/purchase" element={<PurchaseProduct />} />
            <Route path="/search" element={<SearchProducts />} />
            <Route path="/health" element={<HealthCheck />} />
            <Route path="/history" element={<PurchaseHistory />} />
          </Routes>
        </Container>
      </Box>
    </Router>
  );
}

export default App;
