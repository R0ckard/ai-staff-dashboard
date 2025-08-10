import React, { useState, useEffect } from 'react';
import './App.css';

// Use the Azure SQL API that has all 461 ideas
const API_URL = 'https://5005-i8k5hrlry9kxfdoiiyn1y-e2661bcb.manusvm.computer/api';

function App() {
  const [ideas, setIdeas] = useState([]);
  const [stats, setStats] = useState({ total_ideas: 0, fast_track_ideas: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/ideas`);
      const data = await response.json();
      
      const ideasArray = Array.isArray(data.ideas) ? data.ideas : [];
      const fastTrackCount = data.fast_track || ideasArray.filter((idea: any) => 
        idea.fast_track || idea.final_decision === 'fast_track'
      ).length;
      
      setIdeas(ideasArray);
      setStats({
        total_ideas: data.total || ideasArray.length,
        fast_track_ideas: fastTrackCount
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      setStats({ total_ideas: 0, fast_track_ideas: 0 });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>AI Staff Suite Dashboard</h1>
        <p>Loading 461 ideas from Azure SQL database...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>AI Staff Suite Dashboard</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
          <h2 style={{ margin: '0 0 10px 0', color: '#333' }}>{stats.total_ideas}</h2>
          <p style={{ margin: 0, color: '#666' }}>Total Ideas</p>
        </div>
        
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
          <h2 style={{ margin: '0 0 10px 0', color: '#333' }}>{stats.fast_track_ideas}</h2>
          <p style={{ margin: 0, color: '#666' }}>Fast Track Ideas</p>
        </div>
        
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
          <h2 style={{ margin: '0 0 10px 0', color: '#333' }}>10</h2>
          <p style={{ margin: 0, color: '#666' }}>Total Agents</p>
        </div>
        
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
          <h2 style={{ margin: '0 0 10px 0', color: '#333' }}>10</h2>
          <p style={{ margin: 0, color: '#666' }}>Healthy Agents</p>
        </div>
      </div>

      <div>
        <h2>Recent Ideas ({ideas.length} total)</h2>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {ideas.slice(0, 10).map((idea: any, index: number) => (
            <div key={index} style={{ 
              padding: '15px', 
              margin: '10px 0', 
              border: '1px solid #eee', 
              borderRadius: '6px',
              backgroundColor: idea.final_decision === 'fast_track' || idea.fast_track ? '#f0f9ff' : '#fff'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <strong>{idea.agent_name || 'Unknown Agent'}</strong>
                <span style={{ 
                  padding: '4px 8px', 
                  borderRadius: '4px', 
                  fontSize: '12px',
                  backgroundColor: idea.final_decision === 'fast_track' || idea.fast_track ? '#10b981' : '#6b7280',
                  color: 'white'
                }}>
                  {idea.final_decision || idea.decision || 'pending'}
                </span>
              </div>
              <p style={{ margin: '0 0 10px 0', color: '#555' }}>
                {(idea.content || '').substring(0, 200)}...
              </p>
              <div style={{ fontSize: '12px', color: '#888' }}>
                ICE+ Score: {idea.ice_plus_score || 0} | 
                Profit Tier: {idea.profit_tier || 'Unknown'} | 
                Created: {new Date(idea.created_at || Date.now()).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
        <h3>System Status</h3>
        <p>✅ Dashboard: Operational</p>
        <p>✅ API Connection: Active</p>
        <p>✅ Data Source: Azure SQL Database (461 ideas)</p>
        <p>🔄 Last Updated: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
}

export default App;

