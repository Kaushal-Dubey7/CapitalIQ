<div align="center">
  <div style="background-color: #0F1628; border-radius: 12px; padding: 20px; display: inline-block;">
    <h1 style="color: #00E5A0; margin: 0; font-size: 36px; font-family: sans-serif;">♦ CapitalIQ</h1>
  </div>
  <h3>Your AI-Powered Personal Finance & Wealth Architect</h3>

  <p align="center">
    <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black&style=for-the-badge" alt="React" /></a>
    <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-Express-339933?logo=nodedotjs&logoColor=white&style=for-the-badge" alt="Node.js" /></a>
    <a href="https://www.mongodb.com/"><img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white&style=for-the-badge" alt="MongoDB" /></a>
    <a href="https://www.anthropic.com/claude"><img src="https://img.shields.io/badge/AI-Claude_3.5_Sonnet-D97757?logo=anthropic&logoColor=white&style=for-the-badge" alt="Claude AI" /></a>
  </p>
  
  <p align="center">
    <em>Built for India's modern investors to decode taxes, master asset allocation, and achieve Financial Independence.</em>
  </p>
</div>

---

## 🚀 The Vision
Navigating the Indian financial landscape—with its complex tax codes, aggressive inflation, and infinite investment options—can be overwhelming. **CapitalIQ** is a state-of-the-art MERN-stack platform that brings institutional-grade financial planning to your fingertips. 

Powered by **Anthropic's Claude AI**, CapitalIQ doesn't just show you numbers; it creates personalized, deterministic strategies aimed at one ultimate goal: **Building Generational Wealth securely and optimally.**

## ✨ Engineering & Features

CapitalIQ is built as a high-performance Single Page Application (SPA), utilizing custom mathematical engines and AI integrations.

### 🧠 1. AI Financial Mentor (Context-Aware)
- **Deep Contextual Memory**: The AI reads your exact financial state (Income, SIPs, Tax brackets) before answering.
- **Regulatory Aligned**: Tailored exclusively to Indian SEBI guidelines and Income Tax (IT) Act sections (80C, 80D, 80CCD, etc.).

### 🔥 2. FIRE Planner Engine (Financial Independence, Retire Early)
- Dynamically calculates the exact **Corpus Target** required to retire early based on current inflation (6%+), existing savings, and risk profile.
- Plots **Stochastic Asset Projections** over 30+ years using `Recharts` and generates tailored AI roadmaps.

### 🛡️ 3. Money Health & Portfolio X-Ray
- Uses proprietary algorithms to generate a **0-100 Health Score** evaluating Debt-to-Income, Emergency Funds, and Asset Allocation.
- Automatically grades Equity-to-Debt ratios and provides strict SIP step-up guidance.

### ⚖️ 4. Tax Wizard & Couples Planner
- Compares **Old vs. New Tax Regimes** to find exact absolute ₹ tax savings.
- Calculates optimized joint-SIP structures, HRA splits, and tax harvesting strategies for dual-income couples.

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** React 18, Vite, Framer Motion (Fluid 60fps animations), Recharts (Data visualization), Lucide React (Icons). Glassmorphic premium UI written in pure CSS.
- **Backend Architecture:** Node.js, Express.js architecture pattern with separated Controllers, Services, and Middlewares.
- **AI Integration:** `@anthropic-ai/sdk` executing real-time system prompt injections and streaming fallbacks.
- **Database Layer:** MongoDB Atlas with Mongoose ODM. Aggregation pipelines for financial metrics.
- **Security:** JWT (JSON Web Tokens) native authentication, `express-rate-limit`, `helmet` for HTTP headers, and Bcrypt hashing.

---

## ⚙️ Running Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/Kaushal-Dubey7/CapitalIQ.git
   cd CapitalIQ
   ```

2. **Environment Setup**
   _Backend (`/server/.env`):_
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   AI_API_KEY=your_anthropic_api_key
   ```
   _Frontend (`/client/.env`):_
   ```env
   VITE_API_URL=http://localhost:5000/api/v1
   ```

3. **Install Dependencies & Run**
   Open two terminals:
   
   **Terminal 1 (Backend):**
   ```bash
   cd server
   npm install
   npm run dev
   ```
   
   **Terminal 2 (Frontend):**
   ```bash
   cd client
   npm install
   npm run dev
   ```

4. **Access the App**
   Open `http://localhost:5173` in your browser.

---

## 🎯 Why CapitalIQ Stands Out
Unlike generic expense trackers, CapitalIQ is a **forward-looking architect**. The UI is meticulously designed with a dark-mode glassmorphic aesthetic to feel instantly premium. The backend isn't just fetching CRUD data; it’s running intensive financial modeling on the fly, and integrating LLM-driven insights natively into the core layout. It's built cleanly, scales effortlessly, and solves a massive real-world problem.

---

<div align="center">
  <b>Built with ❤️ by Kaushal Dubey</b>
</div>
