# What-If Revenue Simulation Engine

This is a full-stack simulation engine built for the SkyGeni Internship Assignment. It allows sales leadership to simulate future revenue outcomes based on past Q1 and Q2 data, and adjustable parameters for Q3.

## Tech Stack
* Backend: Node.js, Express.js, TypeScript, csv-parser
* Frontend: ReactJS (Vite), TypeScript, axios, recharts

## How to Run the Project locally

### 1. Backend Setup
1. Open a terminal and navigate to the backend folder: cd backend
2. Install dependencies: npm install
3. Important: Make sure deals.csv is present in the backend folder.
4. Start the server: npm run dev
(Server will run on http://localhost:5000)

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend folder: cd frontend
2. Install dependencies: npm install
3. Start the React app: npm run dev
(App will run on http://localhost:5173)

## Assumptions & Key Inferences
* Baseline Calculation: Baseline metrics (Conversion Rate, Avg Deal Size) are calculated strictly from deals with the stage 'Closed Won' or 'Closed Lost'.
* Q3 Open Deals: Deals that are NOT closed (e.g., Lead, Qualified, Proposal) are considered Q3 open pipeline deals.
* Weekly Distribution: To render the scenario comparison chart, the total simulated revenue is divided equally across 4 weeks for simplicity and clean visualization.

## Demo Video
Link[]