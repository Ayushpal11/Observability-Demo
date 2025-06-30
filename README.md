# Zero to Observable: Full-Stack Observability Demo with OpenTelemetry & SigNoz

A modern, observable e-commerce demo app with a Node.js backend and a React (MUI) frontend. Designed for experienced developers at mid-scale companies looking to implement observability after facing downtime.

---

## 🚀 Features

- **Node.js Express backend** with OpenTelemetry instrumentation
- **React + Material-UI frontend** (creative, modern, responsive)
- **Product management**: List, create, search, and view products
- **Purchase flow**: Buy products, track purchase history
- **Purchase history**: View all past purchases in a table
- **Health check**: See backend status
- **Observability**: Traces, metrics, and logs sent to self-hosted SigNoz

---

## 🛠️ Project Structure

```
.
├── app.js                  # Node.js backend (OpenTelemetry instrumented)
├── package.json            # Backend dependencies
├── Dockerfile              # For containerizing the backend
├── client/                 # React frontend (MUI, creative UI)
│   ├── src/pages/          # All main UI pages
│   └── package.json        # Frontend dependencies
├── docker-compose.yml      # SigNoz stack
├── otel-collector-config.yaml
├── prometheus.yml
├── alertmanager.yml
└── README.md               # This file
```

---

## 🏁 Quick Start

### 1. **Install Dependencies**

```bash
npm install
cd client
npm install
```

### 2. **Start the Backend**

```bash
cd .. # if in client
npm start
# Backend runs on http://localhost:5000
```

### 3. **Start the Frontend**

```bash
cd client
npm start
# Frontend runs on http://localhost:3000
```

### 4. **(Optional) Start SigNoz for Observability**

```bash
docker-compose up -d
# Access SigNoz UI at http://localhost:3301 (admin/admin)
```

---

## 🌟 App Features & Endpoints

### **Frontend (React/MUI)**
- **Homepage**: Quick links to all features
- **Product List**: Browse all products
- **Product Details**: View details for a single product
- **Create Product**: Add new products
- **Purchase Product**: Buy a product
- **Search Products**: Filter by name, category, price
- **Health Check**: See backend status
- **Purchase History**: Table of all past purchases

### **Backend (Node.js/Express)**
- `GET /api/products` — List all products
- `GET /api/products/:id` — Get product details
- `POST /api/products` — Create a new product
- `POST /api/purchase` — Purchase a product
- `GET /api/search` — Search products
- `GET /api/purchases` — Get purchase history
- `GET /health` — Health check

---

## 🔍 Observability with OpenTelemetry & SigNoz

- **OpenTelemetry** auto-instruments the backend for traces, metrics, and logs
- **SigNoz** (self-hosted, via Docker Compose) collects and visualizes all telemetry
- **Dashboards**: View service health, request traces, error rates, and more
- **Alerts**: Set up in SigNoz for error rates, latency, etc.

---

## 📝 Tutorial: Zero to Observable

### **Why Observability?**
After repeated downtime, you need more than logs—you need to see, trace, and measure everything. Observability lets you:
- Detect issues before users do
- Debug root causes across services
- Measure and improve reliability

### **Stack Overview**
- **OpenTelemetry**: Standard for collecting traces, metrics, logs
- **SigNoz**: Open-source, self-hosted observability platform
- **Node.js + React**: Modern, real-world demo app

### **Step-by-Step Setup**

1. **Clone the repo and install dependencies**
2. **Start SigNoz stack**
   ```bash
   docker-compose up -d
   # Wait for all services to be healthy
   ```
3. **Start backend and frontend**
   ```bash
   npm start         # backend (http://localhost:5000)
   cd client && npm start   # frontend (http://localhost:3000)
   ```
4. **Explore the app**
   - Add, browse, and purchase products
   - View purchase history
   - Check health status
5. **Open SigNoz UI**
   - http://localhost:3301 (admin/admin)
   - See traces, metrics, and logs for all API calls
   - Create dashboards and alerts

### **Best Practices**
- Use distributed tracing for all API endpoints
- Track business metrics (purchases, errors)
- Set up alerts for error rates and latency
- Review purchase history for business insights

---

## 🧑‍💻 For Experienced Devs at Mid-Scale Companies
- **No vendor lock-in**: All open-source, self-hosted
- **Scalable**: Add more services, endpoints, or metrics as you grow
- **Production ready**: Add persistent storage, authentication, and CI/CD as needed

---

## 📚 Resources
- [OpenTelemetry Docs](https://opentelemetry.io/docs/)
- [SigNoz Docs](https://signoz.io/docs/)
- [Material-UI Docs](https://mui.com/)

---

**Ready to go from zero to observable? Start the app, open SigNoz, and see your system in action!** 
