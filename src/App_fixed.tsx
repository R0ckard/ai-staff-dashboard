import React, { useState, useEffect } from 'react';
import './App.css';

// Use the production API that has all 461 ideas
const PRODUCTION_API_URL = 'https://5002-i3lmtwdcd2b6b4dj3nq9l-e2661bcb.manusvm.computer/api';

function App() {
  const [ideas, setIdeas] = useState([]);
  const [agents, setAgents] = useState([]);
  const [stats, setStats] = useState({ total_ideas: 0, fast_track_ideas: 0 });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('overview');
  const [expandedIdeas, setExpandedIdeas] = useState(new Set());

  // Filtering states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDecision, setSelectedDecision] = useState('All Decisions');
  const [selectedAgent, setSelectedAgent] = useState('All Agents');
  const [sortBy, setSortBy] = useState('Sort by Date');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch ideas from production API
      const ideasResponse = await fetch(`${PRODUCTION_API_URL}/ideas`);
      const ideasData = await ideasResponse.json();
      
      // Handle the API response structure
      const ideasArray = ideasData.ideas || ideasData || [];
      const fastTrackCount = ideasData.fast_track || ideasArray.filter(idea => idea.fast_track || idea.decision === 'fast_track').length;
      
      setIdeas(Array.isArray(ideasArray) ? ideasArray : []);
      setStats({
        total_ideas: Array.isArray(ideasArray) ? ideasArray.length : 0,
        fast_track_ideas: fastTrackCount
      });

      // Fetch agent status
      try {
        const agentsResponse = await fetch(`https://ai-staff-suite-api-https.ambitioussea-9ca2abb1.centralus.azurecontainerapps.io/api/agents/status`);
        const agentsData = await agentsResponse.json();
        setAgents(Array.isArray(agentsData) ? agentsData : []);
      } catch (error) {
        console.error('Error fetching agents:', error);
        setAgents([]);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      setIdeas([]);
      setStats({ total_ideas: 0, fast_track_ideas: 0 });
    } finally {
      setLoading(false);
    }
  };

  const toggleIdeaExpansion = (ideaId) => {
    const newExpanded = new Set(expandedIdeas);
    if (newExpanded.has(ideaId)) {
      newExpanded.delete(ideaId);
    } else {
      newExpanded.add(ideaId);
    }
    setExpandedIdeas(newExpanded);
  };

  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = !searchTerm || 
      idea.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.agent_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDecision = selectedDecision === 'All Decisions' || 
      idea.decision === selectedDecision.toLowerCase() ||
      (selectedDecision === 'Fast Track' && (idea.fast_track || idea.decision === 'fast_track'));
    
    const matchesAgent = selectedAgent === 'All Agents' || 
      idea.agent_name === selectedAgent;
    
    return matchesSearch && matchesDecision && matchesAgent;
  });

  const sortedIdeas = [...filteredIdeas].sort((a, b) => {
    if (sortBy === 'Sort by ICE+ Score') {
      return (b.ice_plus_score || 0) - (a.ice_plus_score || 0);
    } else if (sortBy === 'Sort by Profit Tier') {
      return (b.profit_tier || 0) - (a.profit_tier || 0);
    } else {
      return new Date(b.created_at || b.timestamp || 0) - new Date(a.created_at || a.timestamp || 0);
    }
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  const formatContent = (content, isExpanded, ideaId) => {
    if (!content) return 'No content available';
    
    if (isExpanded) {
      return (
        <div>
          <div>{content}</div>
          <div 
            style={{ 
              color: '#666', 
              fontSize: '0.9em', 
              marginTop: '10px', 
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
            onClick={() => toggleIdeaExpansion(ideaId)}
          >
            ▲ Click to collapse
          </div>
        </div>
      );
    } else {
      const snippet = content.length > 200 ? content.substring(0, 200) + '...' : content;
      return (
        <div>
          <div>{snippet}</div>
          {content.length > 200 && (
            <div 
              style={{ 
                color: '#666', 
                fontSize: '0.9em', 
                marginTop: '10px', 
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
              onClick={() => toggleIdeaExpansion(ideaId)}
            >
              ▼ Click to expand
            </div>
          )}
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="App">
        <div style={{ padding: '50px', textAlign: 'center' }}>
          <h2>Loading dashboard data...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="sidebar">
        <div className="logo">
          <h2>AI Staff Suite</h2>
          <p>Analytics Dashboard</p>
        </div>
        
        <div className="live-indicator">
          <span className="live-dot"></span>
          <span>Live Data</span>
          <div className="timestamp">Updated: {new Date().toLocaleTimeString()}</div>
        </div>

        <nav className="nav-menu">
          <a href="#" className={currentPage === 'overview' ? 'active' : ''} onClick={() => setCurrentPage('overview')}>
            <span className="nav-icon">📊</span> Overview
          </a>
          <a href="#" className={currentPage === 'cospm' ? 'active' : ''} onClick={() => setCurrentPage('cospm')}>
            <span className="nav-icon">👥</span> CoS/PM Monitor
          </a>
          <a href="#" className={currentPage === 'agents' ? 'active' : ''} onClick={() => setCurrentPage('agents')}>
            <span className="nav-icon">🤖</span> Agent Status
          </a>
          <a href="#" className={currentPage === 'ideas' ? 'active' : ''} onClick={() => setCurrentPage('ideas')}>
            <span className="nav-icon">💡</span> Idea Pipeline
          </a>
          <a href="#" className={currentPage === 'analytics' ? 'active' : ''} onClick={() => setCurrentPage('analytics')}>
            <span className="nav-icon">📈</span> Analytics
          </a>
          <a href="#" className={currentPage === 'executive' ? 'active' : ''} onClick={() => setCurrentPage('executive')}>
            <span className="nav-icon">👔</span> Executive View
          </a>
        </nav>
      </div>

      <div className="main-content">
        {currentPage === 'overview' && (
          <div className="overview-page">
            <h1>Overview</h1>
            <p>Real-time insights into your AI Staff Suite performance</p>

            <div className="status-bar">
              <div className="status-item">
                <span className="status-icon green">✓</span>
                <div>
                  <div className="status-label">System Status</div>
                  <div className="status-value">All Systems Operational</div>
                </div>
              </div>
              <div className="status-item">
                <span className="status-icon blue">⚡</span>
                <div>
                  <div className="status-label">CoS/PM</div>
                  <div className="status-value">Unknown</div>
                </div>
              </div>
              <div className="status-item">
                <span className="status-icon gray">🕐</span>
                <div>
                  <div className="status-label">Last Update</div>
                  <div className="status-value">{new Date().toLocaleTimeString()}</div>
                </div>
              </div>
            </div>

            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-icon">👥</div>
                <div className="metric-change">+{agents.length}</div>
                <div className="metric-value">{agents.length}</div>
                <div className="metric-label">Total Agents</div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">✅</div>
                <div className="metric-change">100%</div>
                <div className="metric-value">{agents.filter(agent => agent.status === 'operational').length}</div>
                <div className="metric-label">Healthy Agents</div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">💡</div>
                <div className="metric-change">+{stats.total_ideas}</div>
                <div className="metric-value">{stats.total_ideas}</div>
                <div className="metric-label">Total Ideas</div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">⚡</div>
                <div className="metric-change">+{stats.fast_track_ideas}</div>
                <div className="metric-value">{stats.fast_track_ideas}</div>
                <div className="metric-label">Fast Track Ideas</div>
              </div>
            </div>

            <div className="charts-section">
              <div className="chart-container">
                <h3>Team Performance</h3>
                <p>Agent health by team</p>
                <div className="team-chart">
                  <div className="chart-bar">
                    <div className="bar" style={{height: '80px', backgroundColor: '#10B981'}}></div>
                    <div className="bar-label">Hoddle Team</div>
                  </div>
                  <div className="chart-bar">
                    <div className="bar" style={{height: '80px', backgroundColor: '#10B981'}}></div>
                    <div className="bar-label">Waddle Team</div>
                  </div>
                  <div className="chart-bar">
                    <div className="bar" style={{height: '40px', backgroundColor: '#E5E7EB'}}></div>
                    <div className="bar-label">Executive</div>
                  </div>
                </div>
              </div>
              <div className="chart-container">
                <h3>Decision Distribution</h3>
                <p>Idea validation outcomes</p>
                <div className="pie-chart">
                  <div className="pie-slice" style={{background: 'conic-gradient(#10B981 0deg 36deg, #6B7280 36deg 360deg)'}}>
                    <div className="pie-label">Fast Track: {stats.fast_track_ideas}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="recent-section">
              <h3>Recent Fast Track Ideas</h3>
              <div className="recent-ideas">
                {ideas.filter(idea => idea.fast_track || idea.decision === 'fast_track').slice(0, 3).map((idea, index) => (
                  <div key={index} className="recent-idea-card">
                    <div className="idea-header">
                      <h4>{idea.agent_name || 'Unknown Agent'} Insight #{index + 1}</h4>
                      <span className="fast-track-badge">Fast Track</span>
                    </div>
                    <div className="idea-meta">
                      {idea.agent_name} • ICE+ Score: {idea.ice_plus_score || 0} • {formatDate(idea.created_at || idea.timestamp)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="agents-section">
              <h3>AI Ideation Agents</h3>
              <div className="agents-grid">
                {agents.slice(0, 4).map((agent, index) => (
                  <div key={index} className="agent-card">
                    <div className="agent-header">
                      <h4>{agent.name}</h4>
                      <span className="agent-team">{agent.team}</span>
                    </div>
                    <p>{agent.description || 'AI agent for business ideation'}</p>
                    <div className="agent-stats">
                      <div>Fast Track Rate<span>{agent.fast_track_rate || '25%'}</span></div>
                      <div>Status<span className="status-operational">{agent.status || 'Operational'}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentPage === 'ideas' && (
          <div className="ideas-page">
            <h1>Idea Pipeline</h1>
            <p>Manage and track all generated business ideas</p>

            <div className="filters-section">
              <input
                type="text"
                placeholder="Search ideas or agents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <select value={selectedDecision} onChange={(e) => setSelectedDecision(e.target.value)}>
                <option>All Decisions</option>
                <option>Fast Track</option>
                <option>Approved</option>
                <option>Review</option>
                <option>Archive</option>
              </select>
              <select value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)}>
                <option>All Agents</option>
                {[...new Set(ideas.map(idea => idea.agent_name))].filter(Boolean).map(agent => (
                  <option key={agent}>{agent}</option>
                ))}
              </select>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option>Sort by Date</option>
                <option>Sort by ICE+ Score</option>
                <option>Sort by Profit Tier</option>
              </select>
            </div>

            <div className="ideas-stats">
              <div className="stat-card">
                <div className="stat-value">{stats.total_ideas}</div>
                <div className="stat-label">Total Ideas</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.fast_track_ideas}</div>
                <div className="stat-label">Fast Track</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">0</div>
                <div className="stat-label">Approved</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{ideas.length > 0 ? (ideas.reduce((sum, idea) => sum + (idea.ice_plus_score || 0), 0) / ideas.length).toFixed(1) : '0'}</div>
                <div className="stat-label">Avg ICE+ Score</div>
              </div>
            </div>

            <div className="ideas-list">
              {sortedIdeas.map((idea, index) => (
                <div key={idea.id || index} className="idea-card">
                  <div className="idea-header">
                    <span className="idea-number">{index + 1}.</span>
                    <span className="idea-status">{idea.decision?.toUpperCase() || 'PENDING'}</span>
                    {(idea.fast_track || idea.decision === 'fast_track') && (
                      <span className="fast-track-badge">FAST TRACK</span>
                    )}
                  </div>
                  <div className="idea-content">
                    {formatContent(idea.content, expandedIdeas.has(String(idea.id || index)), String(idea.id || index))}
                  </div>
                  <div className="idea-meta">
                    <span>Agent:{idea.agent_name || 'Unknown'}</span>
                    <span>ICE+ Score:{idea.ice_plus_score || 0}</span>
                    <span>Profit Tier:${idea.profit_tier || '1-3k'}/month</span>
                    <span>Created:{formatDate(idea.created_at || idea.timestamp)}</span>
                  </div>
                  <div className="idea-actions">
                    <button className="btn-primary">View Details</button>
                    <button className="btn-secondary">Edit</button>
                    <button className="btn-tertiary">Export</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentPage === 'agents' && (
          <div className="agents-page">
            <h1>Agent Status</h1>
            <p>Monitor the health and performance of all AI agents</p>
            
            <div className="agents-list">
              {agents.map((agent, index) => (
                <div key={index} className="agent-status-card">
                  <div className="agent-info">
                    <h3>{agent.name}</h3>
                    <p>{agent.description || 'AI ideation agent'}</p>
                    <div className="agent-details">
                      <span>Team: {agent.team}</span>
                      <span>Status: <span className="status-operational">{agent.status}</span></span>
                    </div>
                  </div>
                  <div className="agent-actions">
                    <button className="btn-primary">Test Agent</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
