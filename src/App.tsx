import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Home, Activity, Lightbulb, Users, TrendingUp, DollarSign, Target, Zap, Clock } from 'lucide-react';
import './App.css';
import './index.css';

interface AgentStatus {
  id: string;
  name: string;
  status: string;
  port: number;
  team: string;
  role: string;
  response_time: string;
  last_update: string;
  error: string | null;
}

interface Idea {
  id: string;
  title: string;
  content: string; // This is the description
  decision: 'fast_track' | 'prototype' | 'watch_list' | 'archive';
  agent: string;
  agent_id?: string; // Added agent_id
  created_at: string;
  ice_plus_score: number; // ICE+ Score
  matrix_score: number; // Matrix Score
  profit_tier: number; // Profit Tier
}

const API_BASE_URL = 'http://ai-staff-suite-api-cors-fix.centralus.azurecontainer.io:5001';

const Sidebar: React.FC = (    ) => {
  const location = useLocation();
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <Zap size={24} color="#fff" />
        <span className="app-title">AI Staff Suite</span>
        <span className="app-subtitle">Analytics Dashboard</span>
      </div>
      <div className="live-data-status">
        <div className="live-data-indicator"></div>
        Live Data
        <span className="last-update">Last update: {new Date().toLocaleTimeString()}</span>
      </div>
      <nav className="sidebar-nav">
        <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
          <Home size={20} /> Overview
        </Link>
        <Link to="/agent-status" className={`nav-item ${location.pathname === '/agent-status' ? 'active' : ''}`}>
          <Activity size={20} /> Agent Status
        </Link>
        <Link to="/idea-pipeline" className={`nav-item ${location.pathname === '/idea-pipeline' ? 'active' : ''}`}>
          <Lightbulb size={20} /> Idea Pipeline
        </Link>
        <Link to="/analytics" className={`nav-item ${location.pathname === '/analytics' ? 'active' : ''}`}>
          <Activity size={20} /> Analytics
        </Link>
        <Link to="/executive-view" className={`nav-item ${location.pathname === '/executive-view' ? 'active' : ''}`}>
          <Users size={20} /> Executive View
        </Link>
      </nav>
    </div>
  );
};

const Overview: React.FC<{ agents: AgentStatus[]; ideas: Idea[]; totalIdeas: number; fastTrackIdeas: number; prototypeIdeas: number }> = ({ agents, ideas, totalIdeas, fastTrackIdeas, prototypeIdeas }) => {
  const healthyAgents = agents.filter(a => a.status === 'healthy').length;
  const totalAgentCount = agents.length;

  const decisionData = [
    { name: 'Fast Track', value: ideas.filter(i => i.decision === 'fast_track').length, color: '#43e97b' },
    { name: 'Prototype', value: ideas.filter(i => i.decision === 'prototype').length, color: '#4facfe' },
    { name: 'Watch List', value: ideas.filter(i => i.decision === 'watch_list').length, color: '#feca57' },
    { name: 'Archive', value: ideas.filter(i => i.decision === 'archive').length, color: '#a0aec0' },
  ];

  const teamPerformance = [
    { 
      name: 'Hoddle Team', 
      agents: agents.filter(a => a.team === 'hoddle').length,
      healthy: agents.filter(a => a.team === 'hoddle' && a.status === 'healthy').length,
      ideas: ideas.filter(i => i.agent_id?.includes('hoddle')).length
    },
    { 
      name: 'Waddle Team', 
      agents: agents.filter(a => a.team === 'waddle').length,
      healthy: agents.filter(a => a.team === 'waddle' && a.status === 'healthy').length,
      ideas: ideas.filter(i => i.agent_id?.includes('waddle')).length
    },
    { 
      name: 'Executive', 
      agents: agents.filter(a => a.team === 'executive').length,
      healthy: agents.filter(a => a.team === 'executive' && a.status === 'healthy').length,
      ideas: 0
    }
  ];

  return (
    <div className="main-content">
      <div className="header">
        <h1>Overview</h1>
      </div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon stat-icon-blue">
              <Users size={24} />
            </div>
            <div className="stat-change">
              {healthyAgents}/{totalAgentCount}
            </div>
          </div>
          <div className="stat-value">{totalAgentCount}</div>
          <div className="stat-label">Total Agents</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon stat-icon-green">
              <Activity size={24} />
            </div>
            <div className="stat-change">
              {totalAgentCount > 0 ? `${Math.round((healthyAgents / totalAgentCount) * 100)}%` : '0%'}
            </div>
          </div>
          <div className="stat-value">{healthyAgents}</div>
          <div className="stat-label">Healthy Agents</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon stat-icon-purple">
              <Lightbulb size={24} />
            </div>
            <div className="stat-change">
              {totalIdeas > 0 ? '+' + totalIdeas : '0'}
            </div>
          </div>
          <div className="stat-value">{totalIdeas}</div>
          <div className="stat-label">Total Ideas</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon stat-icon-orange">
              <TrendingUp size={24} />
            </div>
            <div className="stat-change">
              {fastTrackIdeas > 0 ? '+' + fastTrackIdeas : '0'}
            </div>
          </div>
          <div className="stat-value">{fastTrackIdeas}</div>
          <div className="stat-label">Fast Track Ideas</div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Team Performance</h3>
            <p className="chart-subtitle">Agent health by team</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={teamPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="healthy" fill="#43e97b" radius={[4, 4, 0, 0]} name="Healthy" />
              <Bar dataKey="agents" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Total" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {ideas.length > 0 && (
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Decision Distribution</h3>
              <p className="chart-subtitle">Live idea validation outcomes</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={decisionData.filter(d => d.value > 0)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {decisionData.filter(d => d.value > 0).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="modern-cards-grid">
        <div className="modern-card">
          <h3 className="chart-title">System Health Metrics</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Total Agents</span>
              <span style={{ fontWeight: '600', fontSize: '1.2rem', color: '#4facfe' }}>{totalAgentCount}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Healthy Agents</span>
              <span style={{ fontWeight: '600', fontSize: '1.2rem', color: '#43e97b' }}>{healthyAgents}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>System Uptime</span>
              <span style={{ fontWeight: '600', fontSize: '1.2rem', color: '#feca57' }}>100%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Active Teams</span>
              <span style={{ fontWeight: '600', fontSize: '1.2rem', color: '#4facfe' }}>
                {new Set(agents.filter(a => a.status === 'healthy').map(a => a.team)).size}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Idea Generation Rate</span>
              <span style={{ fontWeight: '600', fontSize: '1.2rem', color: '#feca57' }}>
                {ideas.length > 0 ? `${ideas.length} ideas` : 'No data'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="modern-card">
          <h3 className="chart-title">Agent Distribution</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
            {teamPerformance.map((team) => (
              <div key={team.name} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '0.75rem',
                backgroundColor: '#f7fafc',
                borderRadius: '8px'
              }}>
                <span style={{ fontWeight: '500' }}>{team.name}</span>
                <span style={{ 
                  fontWeight: '600',
                  color: team.healthy === team.agents ? '#43e97b' : team.healthy > 0 ? '#feca57' : '#f56565'
                }}>
                  {team.healthy}/{team.agents}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AgentStatusPage: React.FC<{ agents: AgentStatus[] }> = ({ agents }) => {
  return (
    <div className="main-content">
      <div className="header">
        <h1>Agent Status</h1>
      </div>
      <div className="agent-status-grid">
        {agents.map((agent) => (
          <div key={agent.id} className={`agent-card ${agent.status}`}>
            <div className="agent-header">
              <span className="agent-name">{agent.name}</span>
              <span className={`agent-status-badge ${agent.status}`}>{agent.status}</span>
            </div>
            <div className="agent-details">
              <p><strong>Team:</strong> {agent.team}</p>
              <p><strong>Role:</strong> {agent.role}</p>
              <p><strong>Port:</strong> {agent.port}</p>
              <p><strong>Response Time:</strong> {agent.response_time}</p>
              <p><strong>Last Update:</strong> {agent.last_update}</p>
              {agent.error && <p className="agent-error"><strong>Error:</strong> {agent.error}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const IdeaPipeline: React.FC<{ ideas: Idea[] }> = ({ ideas }) => {
  const [expandedIdeaId, setExpandedIdeaId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedIdeaId(expandedIdeaId === id ? null : id);
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="main-content">
      <div className="header">
        <h1>Live Idea Pipeline</h1>
        <p className="subtitle">Real-time ideas from operational agents • {ideas.length} total ideas</p>
      </div>
      <div className="idea-list">
        {ideas.length === 0 ? (
          <div className="no-ideas">
            <Lightbulb size={48} color="#a0aec0" />
            <p>No Ideas Yet. Agents are working to generate new insights!</p>
          </div>
        ) : (
          ideas.map((idea) => (
            <div 
              key={idea.id} 
              className={`idea-card ${idea.decision === 'fast_track' ? 'fast-track-card' : ''}`}
              onClick={() => toggleExpand(idea.id)} // Make the whole card clickable
              style={{ cursor: 'pointer' }} // Indicate it's clickable
            >
              <div className="idea-header">
                <h3 className="idea-title">{idea.title}</h3>
                <span className={`idea-decision-badge ${idea.decision}`}>{idea.decision.replace('_', ' ').toUpperCase()}</span>
              </div>
              <div className="idea-details">
                {/* Conditionally render full content or truncated */}
                {expandedIdeaId === idea.id ? (
                  <p className="idea-description-full">{idea.content}</p>
                ) : (
                  <p className="idea-description">{truncateText(idea.content, 150)}</p> // Use truncateText helper
                )}
                
                <div className="idea-metrics">
                  <span className="metric-item">
                    <Zap size={16} /> ICE+: {idea.ice_plus_score?.toFixed(2) || 'N/A'}
                  </span>
                  <span className="metric-item">
                    <Target size={16} /> Matrix: {idea.matrix_score?.toFixed(2) || 'N/A'}
                  </span>
                  <span className="metric-item">
                    <DollarSign size={16} /> Profit Tier: {idea.profit_tier || 'N/A'}
                  </span>
                </div>
                <div className="idea-meta">
                  <span>Generated by {idea.agent}</span>
                  <span><Clock size={14} /> {idea.created_at}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const Analytics: React.FC = () => {
  return (
    <div className="main-content">
      <div className="header">
        <h1>Analytics</h1>
      </div>
      <p>Detailed analytics and historical data will be displayed here.</p>
    </div>
  );
};

const ExecutiveView: React.FC = () => {
  return (
    <div className="main-content">
      <div className="header">
        <h1>Executive View</h1>
      </div>
      <p>High-level executive summaries and strategic insights will be displayed here.</p>
    </div>
  );
};

const App: React.FC = () => {
  const [agents, setAgents] = useState<AgentStatus[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [totalIdeas, setTotalIdeas] = useState(0);
  const [fastTrackIdeas, setFastTrackIdeas] = useState(0);
  const [prototypeIdeas, setPrototypeIdeas] = useState(0);

  const fetchAllData = async () => {
    try {
      const [agentsResponse, ideasResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/agents/status`),
        fetch(`${API_BASE_URL}/api/ideas`)
      ]);

      const agentsData = await agentsResponse.json();
      const ideasData = await ideasResponse.json();

      setAgents(agentsData.agents || []);
      setIdeas(ideasData.ideas || []);
      setTotalIdeas(ideasData.total_ideas || 0);
      setFastTrackIdeas(ideasData.fast_track || 0);
      setPrototypeIdeas(ideasData.prototype || 0);

    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    // Initial data fetch
    fetchAllData();

    // Set up periodic refresh every 60 seconds
    const interval = setInterval(fetchAllData, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Overview agents={agents} ideas={ideas} totalIdeas={totalIdeas} fastTrackIdeas={fastTrackIdeas} prototypeIdeas={prototypeIdeas} />} />
          <Route path="/agent-status" element={<AgentStatusPage agents={agents} />} />
          <Route path="/idea-pipeline" element={<IdeaPipeline ideas={ideas} />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/executive-view" element={<ExecutiveView />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
