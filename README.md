# 📋 ai-cost-projection-app
An interactive cost calculation and forecasting tool designed to help developers, teams, and enterprises estimate, simulate, and optimize their token-based spending. Built natively around variable AI model token structures, cache pricing matrices, and API usage variables, this application takes the guesswork out of usage-based pricing.
## ✨ Features
 * **Multi-Model Support:** Compare projections across standard AI models or custom LLM token profiles.
 * **Token Tier Architecture:** Granular input for Input Tokens, Cache Write/Read Tokens, and Output Tokens to mimic real-world usage patterns.
 * **Dynamic Growth Forecasting:** Project daily, monthly, and yearly infrastructure costs based on compounding traffic or monthly active users (MAUs).
 * **Interactive Visualizations:** High-quality charts mapping cost thresholds, fixed subscription tiers vs. usage-based overages, and cost-per-request tracking.
 * **Scenario Simulation:** Instantly switch between "Hobby", "Pro", and "Enterprise" base plan profiles to identify exactly when it's optimal to upgrade.
## 🚀 Tech Stack
 * **Framework:** Next.js (App Router)
 * **UI & Styling:** Tailwind CSS & shadcn/ui
 * **Charts & Visuals:** Recharts
 * **Deployment Platform:** Vercel
## 🛠️ Local Development Setup
Follow these steps to spin up the application locally on your machine.
### Prerequisites
Ensure you have the following installed:
 * Node.js (v18+ recommended)
 * npm, pnpm, or yarn
### Installation
 1. **Clone the repository:**
   ```bash
   
   ```
git clone https://github.com/your-username/ai-cost-projection-app.git
cd ai-cost-projection-app
```

2. **Install dependencies:**
   ```bash
npm install
# or
pnpm install
# or
yarn install

```
 3. **Run the development server:**
   ```bash
   
   ```
npm run dev
# or
pnpm dev
# or
yarn dev
```

4. **Open the browser:**
   Open [http://localhost:3000](http://localhost:3000) with your browser to view the interactive dashboard.

---

## 📖 How It Works

1. **Configure Model Metrics:** Input specific per-million token costs ($) for inputs, cache hits/misses, and outputs.
2. **Define Usage Benchmarks:** Provide average tokens consumed per user session or per API query.
3. **Scale the Traffic:** Use the traffic sliders or input fields to adjust daily or monthly request volumes.
4. **Analyze Data Output:** Review the automatically generated graphs to pinpoint your monthly spending breaks, serverless execution limits, and credit exhaustion thresholds.

---

## 🌐 Deploying to Vercel

The easiest way to host this application is to use the Vercel Platform. 

Deploy directly via the Vercel CLI:

```bash
npm install -g vercel
vercel

```
Alternatively, you can connect your forked GitHub repository to Vercel for automatic continuous deployment (CD) on every git push.
## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
docker push desirelovell25/desirelovell:tagname 
