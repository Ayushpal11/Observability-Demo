const express = require('express');
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-http');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { trace, metrics } = require('@opentelemetry/api');

// Initialize OpenTelemetry with resource attributes
const resource = new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'tutorial-app',
    [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: 'development',
    'custom.team': 'backend',
});

const sdk = new NodeSDK({
    resource: resource,
    traceExporter: new OTLPTraceExporter({
        url: 'http://localhost:4318/v1/traces',
    }),
    metricExporter: new OTLPMetricExporter({
        url: 'http://localhost:4318/v1/metrics',
    }),
    instrumentations: [getNodeAutoInstrumentations()],
});

// Start OpenTelemetry
sdk.start();

// Create custom metrics
const meter = metrics.getMeter('tutorial-app');
const requestCounter = meter.createCounter('requests_total', {
    description: 'Total number of requests by endpoint and method',
});

const orderValueHistogram = meter.createHistogram('order_value', {
    description: 'Distribution of order values',
    unit: 'USD',
});

const app = express();
app.use(express.json());

// Simulate database operations
const products = [
    { id: 1, name: 'Laptop', price: 999.99, stock: 10, category: 'electronics' },
    { id: 2, name: 'Mouse', price: 29.99, stock: 50, category: 'accessories' },
    { id: 3, name: 'Keyboard', price: 89.99, stock: 25, category: 'accessories' },
    { id: 4, name: 'Monitor', price: 299.99, stock: 15, category: 'electronics' },
    { id: 5, name: 'Headphones', price: 149.99, stock: 30, category: 'accessories' },
];

// In-memory purchase history
const purchaseHistory = [];

// Middleware to add request tracking
app.use((req, res, next) => {
    const span = trace.getActiveSpan();
    if (span) {
        span.setAttributes({
            'http.url': req.url,
            'http.method': req.method,
            'user.agent': req.get('User-Agent'),
            'request.id': Math.random().toString(36).substr(2, 9),
        });
    }
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Product listing endpoint
app.get('/api/products', async (req, res) => {
    const span = trace.getActiveSpan();

    try {
        // Increment request counter
        requestCounter.add(1, { endpoint: '/api/products', method: 'GET' });

        // Simulate database delay
        await new Promise(resolve => setTimeout(resolve, Math.random() * 100));

        // Simulate occasional errors (5% error rate)
        if (Math.random() < 0.05) {
            throw new Error('Database connection failed');
        }

        // Add span attributes
        if (span) {
            span.setAttributes({
                'products.count': products.length,
                'request.query': JSON.stringify(req.query),
            });
            span.addEvent('products.retrieved', { count: products.length });
        }

        res.json({
            products,
            total: products.length,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        if (span) {
            span.recordException(error);
            span.setStatus({ code: 2, message: error.message }); // ERROR status
        }
        res.status(500).json({
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Product detail endpoint
app.get('/api/products/:id', async (req, res) => {
    const span = trace.getActiveSpan();

    try {
        const productId = parseInt(req.params.id);

        // Increment request counter
        requestCounter.add(1, { endpoint: '/api/products/:id', method: 'GET' });

        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, Math.random() * 200));

        const product = products.find(p => p.id === productId);

        if (!product) {
            if (span) {
                span.setStatus({ code: 1, message: 'Product not found' }); // ERROR status
            }
            return res.status(404).json({
                error: 'Product not found',
                timestamp: new Date().toISOString()
            });
        }

        // Add span attributes
        if (span) {
            span.setAttributes({
                'product.id': productId,
                'product.category': product.category,
                'product.price': product.price,
            });
            span.addEvent('product.retrieved', { productId, name: product.name });
        }

        res.json({
            product,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        if (span) {
            span.recordException(error);
            span.setStatus({ code: 2, message: error.message });
        }
        res.status(500).json({
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Purchase endpoint
app.post('/api/purchase', async (req, res) => {
    const span = trace.getActiveSpan();

    try {
        const { productId, quantity, customerId } = req.body;

        // Increment request counter
        requestCounter.add(1, { endpoint: '/api/purchase', method: 'POST' });

        // Validate input
        if (!productId || !quantity || quantity <= 0) {
            return res.status(400).json({
                error: 'Invalid product ID or quantity',
                timestamp: new Date().toISOString()
            });
        }

        const product = products.find(p => p.id === productId);
        if (!product) {
            if (span) {
                span.setStatus({ code: 1, message: 'Product not found' });
            }
            return res.status(404).json({
                error: 'Product not found',
                timestamp: new Date().toISOString()
            });
        }

        if (product.stock < quantity) {
            if (span) {
                span.setStatus({ code: 1, message: 'Insufficient stock' });
            }
            return res.status(400).json({
                error: 'Insufficient stock',
                available: product.stock,
                requested: quantity,
                timestamp: new Date().toISOString()
            });
        }

        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, Math.random() * 500));

        // Simulate occasional payment failures (3% failure rate)
        if (Math.random() < 0.03) {
            throw new Error('Payment processing failed');
        }

        // Calculate order value
        const orderValue = product.price * quantity;

        // Record order value metric
        orderValueHistogram.record(orderValue, {
            product_category: product.category,
            product_id: productId.toString(),
        });

        // Update stock
        product.stock -= quantity;

        const orderId = Math.random().toString(36).substr(2, 9);

        // Log purchase to history
        purchaseHistory.push({
            orderId,
            productId,
            productName: product.name,
            quantity,
            total: orderValue,
            customerId: customerId || 'anonymous',
            timestamp: new Date().toISOString()
        });

        // Add span attributes
        if (span) {
            span.setAttributes({
                'order.id': orderId,
                'order.value': orderValue,
                'order.quantity': quantity,
                'customer.id': customerId || 'anonymous',
                'product.category': product.category,
            });
            span.addEvent('order.completed', {
                orderId,
                value: orderValue,
                productName: product.name
            });
        }

        res.json({
            success: true,
            orderId,
            total: orderValue,
            product: {
                id: product.id,
                name: product.name,
                price: product.price,
            },
            quantity,
            remainingStock: product.stock,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        if (span) {
            span.recordException(error);
            span.setStatus({ code: 2, message: error.message });
        }
        res.status(500).json({
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Get purchase history endpoint
app.get('/api/purchases', (req, res) => {
    res.json({ purchases: purchaseHistory });
});

// Search products endpoint
app.get('/api/search', async (req, res) => {
    const span = trace.getActiveSpan();

    try {
        const { q, category, minPrice, maxPrice } = req.query;

        // Increment request counter
        requestCounter.add(1, { endpoint: '/api/search', method: 'GET' });

        // Simulate search delay
        await new Promise(resolve => setTimeout(resolve, Math.random() * 150));

        let filteredProducts = [...products];

        // Apply filters
        if (q) {
            filteredProducts = filteredProducts.filter(p =>
                p.name.toLowerCase().includes(q.toLowerCase())
            );
        }

        if (category) {
            filteredProducts = filteredProducts.filter(p =>
                p.category === category
            );
        }

        if (minPrice) {
            filteredProducts = filteredProducts.filter(p =>
                p.price >= parseFloat(minPrice)
            );
        }

        if (maxPrice) {
            filteredProducts = filteredProducts.filter(p =>
                p.price <= parseFloat(maxPrice)
            );
        }

        // Add span attributes
        if (span) {
            span.setAttributes({
                'search.query': q || '',
                'search.category': category || '',
                'search.min_price': minPrice || '',
                'search.max_price': maxPrice || '',
                'search.results_count': filteredProducts.length,
            });
            span.addEvent('search.completed', {
                query: q,
                results: filteredProducts.length
            });
        }

        res.json({
            products: filteredProducts,
            total: filteredProducts.length,
            filters: { q, category, minPrice, maxPrice },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        if (span) {
            span.recordException(error);
            span.setStatus({ code: 2, message: error.message });
        }
        res.status(500).json({
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Create product endpoint
app.post('/api/products', (req, res) => {
    const { name, price, stock, category } = req.body;
    if (!name || !price || !stock || !category) {
        return res.status(400).json({ error: 'Missing required fields: name, price, stock, category' });
    }
    const newProduct = {
        id: products.length ? Math.max(...products.map(p => p.id)) + 1 : 1,
        name,
        price: parseFloat(price),
        stock: parseInt(stock),
        category
    };
    products.push(newProduct);
    res.status(201).json({ product: newProduct });
});

// Error handling middleware
app.use((err, req, res, next) => {
    const span = trace.getActiveSpan();
    if (span) {
        span.recordException(err);
        span.setStatus({ code: 2, message: err.message });
    }

    console.error('Unhandled error:', err);
    res.status(500).json({
        error: 'Internal server error',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        path: req.path,
        timestamp: new Date().toISOString()
    });
});

const PORT = process.env.PORT || 5000;

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    sdk.shutdown().then(() => {
        console.log('OpenTelemetry SDK shut down');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    sdk.shutdown().then(() => {
        console.log('OpenTelemetry SDK shut down');
        process.exit(0);
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 OpenTelemetry enabled - sending data to SigNoz`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    console.log(`🛍️  API endpoints:`);
    console.log(`   GET  /api/products`);
    console.log(`   GET  /api/products/:id`);
    console.log(`   POST /api/purchase`);
    console.log(`   GET  /api/search`);
    console.log(`   GET  /api/purchases`);
}); 