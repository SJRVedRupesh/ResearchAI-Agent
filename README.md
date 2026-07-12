# 📈 InvestIQ Agent - Autonomous AI Investment Researcher

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=node.js)
![AI](https://img.shields.io/badge/AI-Gemini%20%2B%20LangChain-FF6D00?logo=google)

**InvestIQ Agent** is a full-stack AI-powered market intelligence application. It autonomously aggregates real-time company financials, evaluates recent news sentiment, and utilizes Google's Gemini AI (via LangChain) to conduct institutional-grade SWOT analyses on any publicly traded stock.

---

## ✨ Features

- **🧠 AI-Powered SWOT Analysis**: Generates professional Strengths, Weaknesses, Opportunities, and Threats reports using Google Gemini.
- **📰 Real-Time News Sentiment**: Fetches the latest news articles via GNews API and evaluates market sentiment.
- **📊 Live Financial Metrics**: Retrieves real-time stock quotes, market cap, and 52-week highs/lows using Yahoo Finance (with fallback mechanisms for cloud deployment).
- **💯 Custom Investment Score**: Dynamically calculates an investment viability score based on financials, AI analysis, and news sentiment.
- **⚡ Fast & Responsive UI**: Built with React and Vite for a seamless, interactive user experience.

---

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework**: React.js (Vite)
- **Styling**: Vanilla CSS (Modern UI/UX with glassmorphism & gradients)
- **HTTP Client**: Axios
- **Deployment**: Vercel

### Backend (Server)
- **Environment**: Node.js & Express.js
- **AI / LLM Orchestration**: LangChain & Google Gemini API
- **External APIs**: 
  - Yahoo Finance (`yahoo-finance2`) for stock data
  - GNews API for real-time news aggregation
- **Deployment**: Render

---

## ⚙️ Application Workflow

1. **User Request**: The user enters a company name/ticker on the frontend.
2. **Data Collection Pipeline**:
   - The backend concurrently fetches financial data (Yahoo Finance) and the top 5 recent news articles (GNews).
3. **Sentiment Analysis**: Evaluates the news articles to determine current market sentiment (Bullish, Bearish, or Neutral).
4. **AI Processing**: 
   - Financials and news context are passed to a carefully engineered LangChain prompt.
   - Google Gemini evaluates the data to generate a detailed SWOT analysis.
5. **Scoring Engine**: A custom algorithm calculates an investment score out of 100 based on all aggregated data.
6. **Report Generation**: The structured data is returned to the frontend and rendered in an interactive dashboard.

---

## 🚀 Local Setup & Installation

### Prerequisites
- Node.js (v18+)
- npm or yarn
- API Keys for Google Gemini and GNews

### 1. Clone the Repository
```bash
git clone https://github.com/SJRVedRupesh/ResearchAI-Agent.git
cd ResearchAI-Agent
```

### 2. Setup the Backend
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
GNEWS_API_KEY=your_gnews_api_key_here
```
Start the backend server:
```bash
npm run dev
```

### 3. Setup the Frontend
Open a new terminal window:
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api/v1
```
Start the frontend development server:
```bash
npm run dev
```

---

## 🌍 Deployment Guide

### Deploying the Backend (Render)
1. Push your code to GitHub.
2. Create a new **Web Service** on [Render](https://render.com).
3. Connect your GitHub repository.
4. Set the Root Directory to `backend`.
5. Build Command: `npm install`
6. Start Command: `node server.js`
7. **Crucial Step**: Add your `GEMINI_API_KEY` and `GNEWS_API_KEY` in the Environment Variables section on Render.

### Deploying the Frontend (Vercel)
1. Import your GitHub repository to [Vercel](https://vercel.com).
2. Set the Framework Preset to **Vite**.
3. Set the Root Directory to `frontend`.
4. **Crucial Step**: Add an Environment Variable named `VITE_API_URL` and set it to your deployed Render backend URL (e.g., `https://your-backend.onrender.com/api/v1`).
5. Click **Deploy**.

---

## 📝 License

This project is licensed under the MIT License.
