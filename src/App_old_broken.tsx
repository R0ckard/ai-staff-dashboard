import React, { useState, useEffect } from 'react';
import './App.css';

// Azure SQL Database connection (using a proxy API we'll create)
const AZURE_SQL_API_URL = 'https://5004-i4t5cyjk9ep83vfgstk9r-e2661bcb.manusvm.computer/api';

const App: React.FC = () => {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedIdeas, setExpandedIdeas] = useState<Set<string>>(new Set());
  
  // Filters for Idea Pipeline
  const [decisionFilter, setDecisionFilter] = useState('all');
  const [agentFilter, setAgentFilter] = useState('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch ideas from Azure SQL
      const ideasResponse = await fetch(`${AZURE_SQL_API_URL}/ideas`);
      if (ideasResponse.ok) {
        const ideasData = await ideasResponse.json();
        setIdeas(ideasData.ideas || []);
        setStats(prev => ({
          ...prev,
          totalIdeas: ideasData.total || 0,
          fastTrackIdeas: ideasData.fast_track || 0
        }));
      }

      // Fetch agent status
      const agentsResponse = await fetch(`${AZURE_SQL_API_URL}/agents/status`);
      if (agentsResponse.ok) {
        const agentsData = await agentsResponse.json();
        setAgents(agentsData.agents || []);
        setStats(prev => ({
          ...prev,
          totalAgents: agentsData.total_agents || 0,
          healthyAgents: agentsData.healthy_agents || 0
        }));
      }

      // Fetch additional stats
      const statsResponse = await fetch(`${AZURE_SQL_API_URL}/stats`);
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(prev => ({
          ...prev,
          ...statsData
        }));
      }

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const toggleIdeaExpansion = (ideaId: string) => {
    const newExpanded = new Set(expandedIdeas);
    if (newExpanded.has(ideaId)) {
      newExpanded.delete(ideaId);
    } else {
      newExpanded.add(ideaId);
    }
    setExpandedIdeas(newExpanded);
  };

  const getFilteredIdeas = () => {
    let filtered = ideas;

    // Apply decision filter
    if (decisionFilter !== 'all') {
      if (decisionFilter === 'fast_track') {
        filtered = filtered.filter(idea => idea.fast_track);
      } else {
        filtered = filtered.filter(idea => idea.decision === decisionFilter);
      }
    }

    // Apply agent filter
    if (agentFilter !== 'all') {
      filtered = filtered.filter(idea => idea.agent === agentFilter);
    }

    // Apply search filter
    if (searchFilter) {
      filtered = filtered.filter(idea => 
        idea.content.toLowerCase().includes(searchFilter.toLowerCase()) ||
        idea.agent.toLowerCase().includes(searchFilter.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.created).getTime() - new Date(a.created).getTime();
        case 'ice_score':
          return (b.ice_plus_score || 0) - (a.ice_plus_score || 0);
        case 'profit_tier':
          return (a.profit_tier || 0) - (b.profit_tier || 0);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getProfitTierLabel = (tier: number) => {
    switch (tier) {
      case 1: return '$5k+/month';
      case 2: return '$3-5k/month';
      case 3: return '$1-3k/month';
      case 4: return '<$1k/month';
      default: return 'Unknown';
    }
  };

  const renderOverview = () => (
    <div className="overview-content">
      <div className="overview-header">
        <h2>Overview</h2>
        <p>Real-time insights into your AI Staff Suite performance</p>
      </div>

      <div className="status-bar">
        <div className="status-item">
          <span className="status-icon">✅</span>
          <span>System Status</span>
          <span className="status-value">All Systems Operational</span>
        </div>
        <div className="status-item">
          <span className="status-icon">⚡</span>
          <span>CoS/PM</span>
          <span className="status-value">Unknown</span>
        </div>
        <div className="status-item">
          <span className="status-icon">🕐</span>
          <span>Last Update</span>
          <span className="status-value">14:00:00</span>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">👥</div>
          <div className="metric-value">{stats.totalAgents || 0}</div>
          <div className="metric-label">Total Agents</div>
          <div className="metric-change">+8</div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">📈</div>
          <div className="metric-value">{stats.healthyAgents || 0}</div>
          <div className="metric-label">Healthy Agents</div>
          <div className="metric-change">100%</div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">💡</div>
          <div className="metric-value">{stats.totalIdeas || 0}</div>
          <div className="metric-label">Total Ideas</div>
          <div className="metric-change">+{stats.totalIdeas || 0}</div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">⚡</div>
          <div className="metric-value">{stats.fastTrackIdeas || 0}</div>
          <div className="metric-label">Fast Track Ideas</div>
          <div className="metric-change">+{stats.fastTrackIdeas || 0}</div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-container">
          <h3>Team Performance</h3>
          <p>Agent health by team</p>
          <div className="team-chart">
            <div className="team-bar">
              <div className="team-name">Hoddle Team</div>
              <div className="team-health" style={{width: '100%', backgroundColor: '#10B981'}}>4</div>
            </div>
            <div className="team-bar">
              <div className="team-name">Waddle Team</div>
              <div className="team-health" style={{width: '100%', backgroundColor: '#10B981'}}>4</div>
            </div>
            <div className="team-bar">
              <div className="team-name">Executive</div>
              <div className="team-health" style={{width: '50%', backgroundColor: '#6B7280'}}>2</div>
            </div>
          </div>
        </div>

        <div className="chart-container">
          <h3>Decision Distribution</h3>
          <p>Idea validation outcomes</p>
          <div className="decision-chart">
            <div className="decision-item">
              <div className="decision-color" style={{backgroundColor: '#10B981'}}></div>
              <span>Approved: {ideas.filter(i => i.decision === 'approved').length}</span>
            </div>
            <div className="decision-item">
              <div className="decision-color" style={{backgroundColor: '#F59E0B'}}></div>
              <span>Fast Track: {ideas.filter(i => i.fast_track).length}</span>
            </div>
            <div className="decision-item">
              <div className="decision-color" style={{backgroundColor: '#6B7280'}}></div>
              <span>Archive: {ideas.filter(i => i.decision === 'archive').length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="recent-section">
        <h3>Recent Fast Track Ideas</h3>
        <div className="recent-ideas">
          {ideas.filter(idea => idea.fast_track).slice(0, 3).map((idea, index) => (
            <div key={index} className="recent-idea">
              <div className="idea-content">
                <strong>{idea.content.substring(0, 100)}...</strong>
                <div className="idea-meta">
                  Agent: {idea.agent} | ICE+ Score: {idea.ice_plus_score} | {formatDate(idea.created)}
                </div>
              </div>
              <div className="fast-track-badge">FAST TRACK</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderIdeaPipeline = () => {
    const filteredIdeas = getFilteredIdeas();
    const fastTrackCount = filteredIdeas.filter(idea => idea.fast_track).length;
    const approvedCount = filteredIdeas.filter(idea => idea.decision === 'approved').length;
    const avgIceScore = filteredIdeas.length > 0 
      ? (filteredIdeas.reduce((sum, idea) => sum + (idea.ice_plus_score || 0), 0) / filteredIdeas.length).toFixed(1)
      : '0.0';

    return (
      <div className="idea-pipeline-content">
        <div className="pipeline-header">
          <h2>Idea Pipeline</h2>
          <p>Manage and track all generated business ideas</p>
        </div>

        <div className="pipeline-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search ideas or agents..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            />
          </div>
          <div className="filter-controls">
            <select value={decisionFilter} onChange={(e) => setDecisionFilter(e.target.value)}>
              <option value="all">All Decisions</option>
              <option value="fast_track">Fast Track</option>
              <option value="approved">Approved</option>
              <option value="archive">Archive</option>
              <option value="pending">Pending</option>
            </select>
            <select value={agentFilter} onChange={(e) => setAgentFilter(e.target.value)}>
              <option value="all">All Agents</option>
              {Array.from(new Set(ideas.map(idea => idea.agent))).map(agent => (
                <option key={agent} value={agent}>{agent}</option>
              ))}
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="date">Sort by Date</option>
              <option value="ice_score">Sort by ICE+ Score</option>
              <option value="profit_tier">Sort by Profit Tier</option>
            </select>
          </div>
        </div>

        <div className="pipeline-stats">
          <div className="stat-card">
            <div className="stat-value">{filteredIdeas.length}</div>
            <div className="stat-label">Total Ideas</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{fastTrackCount}</div>
            <div className="stat-label">Fast Track</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{approvedCount}</div>
            <div className="stat-label">Approved</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{avgIceScore}</div>
            <div className="stat-label">Avg ICE+ Score</div>
          </div>
        </div>

        <div className="ideas-list">
          {filteredIdeas.map((idea, index) => {
            const isExpanded = expandedIdeas.has(idea.id?.toString() || index.toString());
            const ideaKey = idea.id?.toString() || index.toString();
            
            return (
              <div key={ideaKey} className="idea-card">
                <div className="idea-header">
                  <span className="idea-number">{index + 1}.</span>
                  {idea.fast_track && <span className="fast-track-badge">FAST TRACK</span>}
                  {idea.decision === 'archive' && <span className="archive-badge">ARCHIVE</span>}
                </div>
                
                <div 
                  className="idea-content-container"
                  onClick={() => toggleIdeaExpansion(ideaKey)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="idea-text">
                    {isExpanded 
                      ? idea.content 
                      : `${idea.content.substring(0, 200)}${idea.content.length > 200 ? '...' : ''}`
                    }
                  </div>
                  
                  <div className="expand-indicator">
                    {isExpanded ? '▲ Click to collapse' : '▼ Click to expand'}
                  </div>
                </div>

                <div className="idea-metadata">
                  <span>Agent: {idea.agent}</span>
                  <span>ICE+ Score: {idea.ice_plus_score || 0}</span>
                  <span>Profit Tier: {getProfitTierLabel(idea.profit_tier)}</span>
                  <span>Created: {formatDate(idea.created)}</span>
                </div>

                <div className="idea-actions">
                  <button className="action-btn primary">View Details</button>
                  <button className="action-btn secondary">Edit</button>
                  <button className="action-btn secondary">Export</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderAgentStatus = () => (
    <div className="agent-status-content">
      <div className="agent-header">
        <h2>Agent Status</h2>
        <p>Monitor the health and performance of all AI agents</p>
      </div>

      <div className="agent-summary">
        <div className="summary-card">
          <div className="summary-value">{stats.totalAgents || 0}</div>
          <div className="summary-label">Total Agents</div>
        </div>
        <div className="summary-card">
          <div className="summary-value">{stats.healthyAgents || 0}</div>
          <div className="summary-label">Healthy Agents</div>
        </div>
        <div className="summary-card">
          <div className="summary-value">100%</div>
          <div className="summary-label">Health Rate</div>
        </div>
      </div>

      <div className="agents-grid">
        {agents.map((agent, index) => (
          <div key={index} className="agent-card">
            <div className="agent-info">
              <h3>{agent.name}</h3>
              <p>Team: {agent.team}</p>
              <div className={`agent-status ${agent.status}`}>
                <span className="status-dot"></span>
                {agent.status}
              </div>
            </div>
            <div className="agent-actions">
              <button className="test-btn">Test Agent</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="error-container">
          <h2>Error Loading Dashboard</h2>
          <p>{error}</p>
          <button onClick={fetchData} className="retry-btn">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="sidebar">
        <div className="logo">
          <h1>AI Staff Suite</h1>
          <p>Analytics Dashboard</p>
        </div>
        
        <div className="live-data">
          <div className="live-indicator"></div>
          <span>Live Data</span>
          <div className="timestamp">Updated: 14:09:32</div>
        </div>

        <nav className="nav-menu">
          <button 
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button 
            className={`nav-item ${activeTab === 'cos-pm' ? 'active' : ''}`}
            onClick={() => setActiveTab('cos-pm')}
          >
            👔 CoS/PM Monitor
          </button>
          <button 
            className={`nav-item ${activeTab === 'agents' ? 'active' : ''}`}
            onClick={() => setActiveTab('agents')}
          >
            ⚡ Agent Status
          </button>
          <button 
            className={`nav-item ${activeTab === 'pipeline' ? 'active' : ''}`}
            onClick={() => setActiveTab('pipeline')}
          >
            💡 Idea Pipeline
          </button>
          <button 
            className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📈 Analytics
          </button>
          <button 
            className={`nav-item ${activeTab === 'executive' ? 'active' : ''}`}
            onClick={() => setActiveTab('executive')}
          >
            👑 Executive View
          </button>
        </nav>
      </div>

      <div className="main-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'pipeline' && renderIdeaPipeline()}
        {activeTab === 'agents' && renderAgentStatus()}
        {activeTab === 'cos-pm' && <div className="placeholder">CoS/PM Monitor - Coming Soon</div>}
        {activeTab === 'analytics' && <div className="placeholder">Analytics - Coming Soon</div>}
        {activeTab === 'executive' && <div className="placeholder">Executive View - Coming Soon</div>}
      </div>
    </div>
  );
};

export default App;
