const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Configuration
const CONFIG = {
    requestInterval: 100, // ms between requests
    maxConcurrentRequests: 5,
    testDuration: 0, // 0 = run indefinitely
    errorThreshold: 0.1, // 10% error rate threshold
};

// Statistics tracking
const stats = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    startTime: Date.now(),
    errors: [],
};

// Product data for realistic testing
const testProducts = [
    { id: 1, name: 'Laptop', price: 999.99 },
    { id: 2, name: 'Mouse', price: 29.99 },
    { id: 3, name: 'Keyboard', price: 89.99 },
    { id: 4, name: 'Monitor', price: 299.99 },
    { id: 5, name: 'Headphones', price: 149.99 },
];

// Test scenarios
const scenarios = [
    {
        name: 'Browse Products',
        weight: 0.4, // 40% of requests
        execute: async () => {
            return axios.get(`${BASE_URL}/api/products`);
        }
    },
    {
        name: 'View Product Details',
        weight: 0.3, // 30% of requests
        execute: async () => {
            const productId = Math.floor(Math.random() * testProducts.length) + 1;
            return axios.get(`${BASE_URL}/api/products/${productId}`);
        }
    },
    {
        name: 'Search Products',
        weight: 0.2, // 20% of requests
        execute: async () => {
            const searchTerms = ['laptop', 'mouse', 'keyboard', 'monitor', 'headphones'];
            const searchTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
            const category = Math.random() > 0.5 ? 'electronics' : 'accessories';

            return axios.get(`${BASE_URL}/api/search`, {
                params: {
                    q: searchTerm,
                    category: category,
                    minPrice: Math.random() > 0.5 ? '50' : undefined,
                    maxPrice: Math.random() > 0.5 ? '500' : undefined,
                }
            });
        }
    },
    {
        name: 'Make Purchase',
        weight: 0.1, // 10% of requests
        execute: async () => {
            const productId = Math.floor(Math.random() * testProducts.length) + 1;
            const quantity = Math.floor(Math.random() * 3) + 1;
            const customerId = `customer_${Math.floor(Math.random() * 1000)}`;

            return axios.post(`${BASE_URL}/api/purchase`, {
                productId,
                quantity,
                customerId,
            });
        }
    }
];

// Helper function to select scenario based on weights
function selectScenario() {
    const random = Math.random();
    let cumulativeWeight = 0;

    for (const scenario of scenarios) {
        cumulativeWeight += scenario.weight;
        if (random <= cumulativeWeight) {
            return scenario;
        }
    }

    return scenarios[0]; // fallback
}

// Helper function to add random delay
function randomDelay(min, max) {
    return new Promise(resolve => {
        setTimeout(resolve, Math.random() * (max - min) + min);
    });
}

// Execute a single request
async function executeRequest() {
    const scenario = selectScenario();
    const startTime = Date.now();

    try {
        const response = await scenario.execute();
        const duration = Date.now() - startTime;

        stats.totalRequests++;
        stats.successfulRequests++;

        console.log(`✅ ${scenario.name} - ${response.status} (${duration}ms)`);

        return { success: true, duration, status: response.status };
    } catch (error) {
        const duration = Date.now() - startTime;

        stats.totalRequests++;
        stats.failedRequests++;
        stats.errors.push({
            scenario: scenario.name,
            error: error.message,
            status: error.response?.status,
            timestamp: new Date().toISOString(),
        });

        console.log(`❌ ${scenario.name} - ${error.response?.status || 'NETWORK'} (${duration}ms) - ${error.message}`);

        return { success: false, duration, error: error.message };
    }
}

// Print statistics
function printStats() {
    const elapsed = (Date.now() - stats.startTime) / 1000;
    const rps = stats.totalRequests / elapsed;
    const errorRate = stats.failedRequests / stats.totalRequests;

    console.log('\n📊 Load Test Statistics:');
    console.log('========================');
    console.log(`⏱️  Duration: ${elapsed.toFixed(1)}s`);
    console.log(`📈 Total Requests: ${stats.totalRequests}`);
    console.log(`✅ Successful: ${stats.successfulRequests}`);
    console.log(`❌ Failed: ${stats.failedRequests}`);
    console.log(`🚀 Requests/sec: ${rps.toFixed(2)}`);
    console.log(`⚠️  Error Rate: ${(errorRate * 100).toFixed(2)}%`);

    if (stats.errors.length > 0) {
        console.log('\n🔍 Recent Errors:');
        stats.errors.slice(-5).forEach(error => {
            console.log(`   ${error.timestamp} - ${error.scenario}: ${error.error}`);
        });
    }

    console.log('\n' + '='.repeat(50));
}

// Main load testing function
async function runLoadTest() {
    console.log('🚀 Starting Load Test');
    console.log('====================');
    console.log(`📡 Target: ${BASE_URL}`);
    console.log(`⏱️  Interval: ${CONFIG.requestInterval}ms`);
    console.log(`🔗 Max Concurrent: ${CONFIG.maxConcurrentRequests}`);
    console.log(`⏰ Duration: ${CONFIG.testDuration === 0 ? 'Indefinite' : CONFIG.testDuration + 's'}`);
    console.log('');

    const startTime = Date.now();
    let isRunning = true;

    // Set up periodic stats printing
    const statsInterval = setInterval(() => {
        printStats();
    }, 10000); // Print stats every 10 seconds

    // Set up duration limit if specified
    if (CONFIG.testDuration > 0) {
        setTimeout(() => {
            isRunning = false;
            console.log('\n⏰ Test duration reached, stopping...');
        }, CONFIG.testDuration * 1000);
    }

    // Main request loop
    while (isRunning) {
        const promises = [];

        // Create concurrent requests
        for (let i = 0; i < CONFIG.maxConcurrentRequests; i++) {
            promises.push(executeRequest());
        }

        // Wait for all requests to complete
        await Promise.all(promises);

        // Add delay between batches
        await randomDelay(CONFIG.requestInterval, CONFIG.requestInterval * 2);
    }

    // Cleanup
    clearInterval(statsInterval);

    // Final statistics
    console.log('\n🏁 Load Test Completed');
    console.log('=====================');
    printStats();

    // Check if error rate is too high
    const errorRate = stats.failedRequests / stats.totalRequests;
    if (errorRate > CONFIG.errorThreshold) {
        console.log(`\n⚠️  WARNING: Error rate (${(errorRate * 100).toFixed(2)}%) exceeds threshold (${(CONFIG.errorThreshold * 100).toFixed(2)}%)`);
    }

    process.exit(0);
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Received SIGINT, stopping load test...');
    printStats();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Received SIGTERM, stopping load test...');
    printStats();
    process.exit(0);
});

// Check if target is available before starting
async function checkTarget() {
    try {
        const response = await axios.get(`${BASE_URL}/health`, { timeout: 5000 });
        console.log(`✅ Target is healthy: ${response.data.status}`);
        return true;
    } catch (error) {
        console.error(`❌ Target is not available: ${error.message}`);
        console.log('Make sure the application is running on http://localhost:3000');
        return false;
    }
}

// Start the load test
async function start() {
    const isAvailable = await checkTarget();
    if (!isAvailable) {
        process.exit(1);
    }

    // Small delay to ensure target is ready
    await new Promise(resolve => setTimeout(resolve, 1000));

    runLoadTest().catch(error => {
        console.error('💥 Load test failed:', error);
        process.exit(1);
    });
}

// Start if this file is run directly
if (require.main === module) {
    start();
}

module.exports = { runLoadTest, stats }; 