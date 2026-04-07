import { useState } from 'react';
import axios from 'axios';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function App() {

  const [convChange, setConvChange] = useState(0); 
  const [dealSizeChange, setDealSizeChange] = useState(0);
  const [simData, setSimData] = useState<any>(null); 

  const runSimulation = async () => {
    try {

      const response = await axios.post('http://localhost:5000/api/simulate', {
        conversion_change: convChange,
        deal_size_change: dealSizeChange
      });

      setSimData(response.data); 
    } catch (error) {
      console.error("Backend can't be reached", error);
      alert("Error? Once check the backend");
    }
  };

  let chartData: any[] = [];
  if (simData) {
    chartData = [
      { name: 'Week 1', Baseline: simData.baseline.weekly_revenue[0], Scenario: simData.scenario.weekly_revenue[0] },
      { name: 'Week 2', Baseline: simData.baseline.weekly_revenue[1], Scenario: simData.scenario.weekly_revenue[1] },
      { name: 'Week 3', Baseline: simData.baseline.weekly_revenue[2], Scenario: simData.scenario.weekly_revenue[2] },
      { name: 'Week 4', Baseline: simData.baseline.weekly_revenue[3], Scenario: simData.scenario.weekly_revenue[3] },
    ];
  }

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>What-If Revenue Simulator</h1>

      {}
      <div style={{ border: '2px solid #ddd', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
        <h3>🎛️ Simulation Controls</h3>

        {}
        <div style={{ marginBottom: '15px' }}>
          <label>Conversion Rate Change: <b>{convChange}%</b></label><br/>
          <input 
            type="range" min="-50" max="50" 
            value={convChange} 
            onChange={(e) => setConvChange(Number(e.target.value))} 
            style={{ width: '100%', cursor: 'pointer' }} 
          />
        </div>

        {}
        <div style={{ marginBottom: '20px' }}>
          <label>Avg Deal Size Change: <b>{dealSizeChange}%</b></label><br/>
          <input 
            type="range" min="-50" max="50" 
            value={dealSizeChange} 
            onChange={(e) => setDealSizeChange(Number(e.target.value))} 
            style={{ width: '100%', cursor: 'pointer' }} 
          />
        </div>

        {}
        <button 
          onClick={runSimulation} 
          style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%' }}>
          Run Simulation
        </button>
      </div>

      {}
      {simData && (
        <div>
          {}
          <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '10px', marginBottom: '20px', borderLeft: '5px solid #007bff' }}>
            <h3>🧾 Insights</h3>
            <p><b>Baseline Revenue (Old):</b> ₹{simData.baseline.total_revenue.toLocaleString()}</p>
            <p><b>Scenario Revenue (New):</b> ₹{simData.scenario.total_revenue.toLocaleString()}</p>
            <h4 style={{ color: simData.impact.absolute >= 0 ? 'green' : 'red' }}>
              Impact: {simData.impact.absolute >= 0 ? '+' : ''}₹{simData.impact.absolute.toLocaleString()} ({simData.impact.percentage}%)
            </h4>
            <p style={{ color: 'gray', fontSize: '14px' }}>
              <i>Drivers: {simData.drivers.join(' & ')}</i>
            </p>
          </div>

          {}
          <div style={{ height: '350px', width: '100%' }}>
            <h3>📈 Scenario Comparison (Weekly)</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {}
                <Line type="monotone" dataKey="Baseline" stroke="#8884d8" strokeWidth={3} />
                {}
                <Line type="monotone" dataKey="Scenario" stroke="#82ca9d" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;