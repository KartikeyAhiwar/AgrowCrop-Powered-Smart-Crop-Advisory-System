# 🚀 AgroCrop Market Price Dashboard

**Production-Ready | Docker-Powered | SIH/Startup Grade**

Helping farmers answer: *"Where should I sell my crop today to earn more per quintal?"*

---

## 🎯 One Command Deploy

```bash
docker-compose up --build
```

**That's it.**  
Everything runs together: MongoDB, Spring Boot Backend, React Frontend.

---

## 📂 Architecture

```
AgroCrop/
├── java-service/          # Spring Boot Backend (Java 17)
│   ├── Dockerfile         # Multi-stage Maven build
│   └── src/              
├── frontend/              # React + Tailwind UI
│   ├── Dockerfile         # Node 20, Vite dev server
│   └── src/
├── docker-compose.yml     # ⭐ Full stack orchestration
└── README.md
```

---

## 🌐 Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:3000 | Market Price Dashboard UI |
| **Backend API** | http://localhost:8080 | REST endpoints |
| **MongoDB** | localhost:27017 | Price data storage |

| **WebsiteLink** | https://agrowcrop.codefastweb.online/ | Hosted |
---

## 🧠 Tech Stack

**Backend:**
- ✅ Spring Boot 3.1.5
- ✅ MongoDB (with compound indexing)
- ✅ Scheduled data fetching (@Scheduled)
- ✅ Price optimization algorithm

**Frontend:**  
- ✅ React 18
- ✅ Tailwind CSS (light green theme)
- ✅ Recharts (7-day trend visualization)
- ✅ Responsive design

**DevOps:**
- ✅ Docker multi-stage builds
- ✅ Health checks (mongo → backend → frontend)
- ✅ Service-based networking (no hardcoded IPs)
- ✅ Volume persistence

---

## 📊 Features

### 1. Price Optimization Algorithm

```
Total Score = (Price × 0.6) + (Proximity × 0.3) + (Trend × 0.1)
```

- **Price Score:** Higher price = Better score
- **Proximity Score:** Same district = 100, Different = 50
- **Trend Score:** Rising 7-day trend = Better score

### 2. Input Fields

1. **Crop Name** - Select from 12 major crops
2. **State** - 7 states covered
3. **City/District** - Optional for proximity optimization

### 3. Output Display

- 🥇 **Recommended Mandi** with optimization score
- 📊 **Price Comparison Table** (all mandis ranked)
- 📈 **7-Day Trend Chart** (price movement visualization)
- 💰 **Score Breakdown** (detailed metrics)

---

## 🔧 Without Docker (Local Development)

### Prerequisites
- Java 17+
- Node.js 20+
- MongoDB running on localhost:27017

### Backend (Spring Boot)

```bash
cd java-service
./mvnw spring-boot:run
```

### Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/market-prices/optimize` | Get optimized mandi recommendation |
| GET | `/api/market-prices/today` | Today's prices for crop + state |
| GET | `/api/market-prices/trend` | 7-day price history |
| GET | `/api/market-prices/compare` | Compare all mandis |
| POST | `/api/market-prices/fetch-now` | Manual data fetch trigger |
| GET | `/api/market-prices/health` | Health check |

---

## 🗄️ Data Model

**MongoDB Collection:** `mandi_prices`

```java
{
  "mandiName": "Ujjain Mandi",
  "crop": "Wheat",
  "pricePerQuintal": 2180,
  "date": "2026-01-23",
  "state": "Madhya Pradesh",
  "district": "Ujjain"
}
```

**Compound Index:**
```java
@CompoundIndex(
  name = "crop_location_date_idx",
  def = "{'crop':1, 'state':1, 'district':1, 'date':-1}"
)
```

---

## 📱 Demo Flow

**Farmer: Ramesh (Indore, Wheat Farmer)**

1. Opens Dashboard → Selects:
   - Crop: Wheat
   - State: Madhya Pradesh
   - City: Indore

2. System shows:

| Rank | Mandi | Price (₹/Q) | Score |
|------|-------|-------------|-------|
| 🥇 | Ujjain Mandi | 2,180 | 89.5 |
| 🥈 | Bhopal Mandi | 2,170 | 82.1 |
| 🥉 | Indore Mandi | 2,150 | 85.2 |

3. **Decision:** Travel to Ujjain (30km), earn ₹180 more per quintal  
   ✅ Even after fuel cost, net profit increases

---

## 🎤 Presentation Line for SIH/Investors

> *"We containerized our entire agricultural price intelligence platform using Docker Compose, enabling the backend, database, and frontend to run together seamlessly with a single command—ensuring portability, scalability, and production readiness for deployment anywhere."*

**Judges love this.** 🔥

---

## 🐳 Docker Details

### Why Service Names?

❌ **Bad (Breaks in Docker):**
```javascript
fetch("http://localhost:8080/api/prices")
```

✅ **Good (Docker-safe):**
```javascript
fetch("/api/prices")  // Uses Vite proxy
```

Vite proxy config (`vite.config.js`):
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:8080',
    changeOrigin: true
  }
}
```

In Docker, environment variables override:
- `VITE_API_URL` → Docker uses backend service name internally
- Proxy handles routing to `backend:8080`

---

## 📈 Scheduled Data Fetching

Runs **daily at 6:00 AM:**

```java
@Scheduled(cron = "0 0 6 * * *")
public void fetchMandiPrices() {
    // Fetches prices for 12 crops × 7 states
    // Stores in MongoDB
}
```

**Trigger Manual Fetch:**
```bash
curl -X POST http://localhost:8080/api/market-prices/fetch-now
```

---

## 🛠️ Environment Variables

**Backend (`docker-compose.yml`):**
```yaml
environment:
  SPRING_DATA_MONGODB_URI: mongodb://mongo:27017/agrocrop
  SPRING_DATA_MONGODB_DATABASE: agrocrop
```

**Frontend:**
```yaml
environment:
  VITE_API_BASE_URL: http://backend:8080
```

---

## 🔥 Production Deployment

### Cloud Providers:

**AWS:**
```bash
docker-compose -f docker-compose.prod.yml up -d
# Use RDS for MongoDB or MongoDB Atlas
# Deploy to ECS/Fargate
```

**Azure:**
```bash
# Use Azure Container Instances
az container create --resource-group agrocrop-rg \
  --file docker-compose.yml
```

**DigitalOcean:**
```bash
# Use App Platform with Docker Compose
doctl apps create --spec docker-compose.yml
```

---

## 🧩 Mock Data (Demo Mode)

If backend is unavailable, frontend auto-switches to demo mode:

- ✅ Mock data for 3 states × 3 crops
- ✅ Full UI functionality
- ✅ 7-day trends
- ⚠️ No real-time updates

**Enable:** System auto-detects backend failure

---

## 📝 License

MIT License - Free for educational and commercial use.

---

## 👥 Team

Built for **AgroCrop** - Smart Agricultural Market Intelligence Platform

**Tech Stack Credits:**
- Spring Boot Team
- React & Vite Teams
- MongoDB Team
- Docker Team

---

## 🏆 Competitive Edge

✅ **Real government data** (Agmarknet API ready)  
✅ **Mathematical optimization** (not just price sorting)  
✅ **Production-ready Docker setup**  
✅ **Modern UI** (Tailwind + Recharts)  
✅ **Scheduled automation** (Daily price updates)  
✅ **Scalable architecture** (MongoDB indexing)

**Result:** Farmers make data-driven decisions → Higher income 📈

---

**Made with 💚 for Indian Farmers**
