# AgrowCrop Deployment Guide

## Architecture
AgrowCrop uses a modern hybrid architecture for production:
- **Frontend**: React (Vercel)
- **Backend**: Spring Boot (Container Platform like Render/Railway)
- **Database**: MongoDB Atlas
- **Auth**: Clerk (Production) / Custom (Local Dev)

## Prerequisites
1.  **GitHub Repo**: Code pushed to GitHub.
2.  **MongoDB Atlas**: Create a cluster and get the connection string (`mongodb+srv://...`).
3.  **Clerk Account**: Create an application at [clerk.com](https://clerk.com) and get keys.
4.  **Vercel Account**: For frontend.
5.  **Render/Railway Account**: For backend.

## 1. Backend Deployment (Render.com)
1.  **New Web Service** -> Connect GitHub Repo.
2.  **Build Command**: `./mvnw clean package`
3.  **Start Command**: `java -jar -Dspring.profiles.active=prod target/*.jar`
4.  **Environment Variables**:
    - `JAVA_HOME`: (Auto-detected usually)
    - `SPRING_DATA_MONGODB_URI`: `mongodb+srv://<user>:<pass>@cluster.../agrowcrop?retryWrites=true&w=majority`
    - `CLERK_ISSUER_URI`: `https://<your-clerk-domain>.clerk.accounts.dev` (Exact value from Clerk Dashboard -> JWT Templates -> Issuer. **Must match exactly**)
    - `SMS_PROVIDER`: `twilio` (Optional, if using SMS)
    - `FRONTEND_URL`: `https://agrowcrop-frontend.vercel.app` (Used for CORS configuration to allow requests from your frontend)
    - `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` (If using Twilio)

## 2. Frontend Deployment (Vercel)
1.  **New Project** -> Import AgrowCrop Repo.
2.  **Root Directory**: `frontend` (Important!)
3.  **Build Command**: `npm run build`
4.  **Output Directory**: `dist`
5.  **Environment Variables**:
    - `VITE_API_BASE_URL`: `https://agrowcrop-backend.onrender.com` (Your Render URL)
    - `VITE_AUTH_MODE`: `clerk`
    - `VITE_CLERK_PUBLISHABLE_KEY`: `pk_test_...` (From Clerk Dashboard)

## 3. Local Development (Hybrid Mode)
- **Backend**: `mvn spring-boot:run` (Default profile `local` is active).
    - Database: Local Mongo or Atlas (set `SPRING_DATA_MONGODB_URI` in .env to override).
    - Auth: Custom local OTP service (Not Clerk). This uses the `ConsoleSmsSender` to log OTPs to the terminal.
- **Frontend**: `npm run dev`
    - Auth: Local phone/OTP form (uses the local backend OTP service).

## 4. Production Auth Setup
1.  In **Clerk Dashboard**, enable **Phone Number Sign-In**. (Clerk handles OTP delivery for production).
2.  In **Backend**, ensure `CLERK_ISSUER_URI` matches your Clerk instance.
3.  The backend will now strictly validate JWTs signed by Clerk.
    - **Prod Simulation**: If you run with `SPRING_PROFILES_ACTIVE=prod` but without a valid Clerk token, API requests will return `401 Unauthorized`.

## 5. Docker Demo (Optional)
For offline demos or judges (runs everything locally):
```bash
docker-compose -f docker-compose.demo.yml up --build
```
