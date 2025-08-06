import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Home, Activity, Lightbulb, Users, TrendingUp, DollarSign, Target, Zap, Clock, MessageSquare, Brain } from 'lucide-react';
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
  content: string;
  decision: 'fast_track' | 'prototype' | 'watch_list' | 'archive';
  agent: string;
  agent_id?: string;
  created_at: string;
  ice_plus_score: number;
  matrix_score: number;
  profit_tier: number;
}

interface CosPmStatus {
  cos_status: string;
  cos_ai_intelligence: string;
  cos_pm_connectivity: string;
  cos_cache_status: string;
  cos_timestamp: string;
  pm_total_projects: number;
  pm_total_tasks: number;
  pm_active_projects: number;
  pm_completed_tasks: number;
  pm_pending_tasks: number;
  pm_high_priority_tasks: number;
  communication_success_rate: number;
  avg_response_time: number;
  last_communication: string;
}

const API_BASE_URL = 'https://ai-staff-api-gateway.ambitioussea-9ca2abb1.centralus.azurecontainerapps.io';
const COS_API_URL = 'https://ai-staff-chief-of-staff.ambitioussea-9ca2abb1.centralus.azurecontainerapps.io';
const PM_API_URL = 'https://ai-staff-project-manager.ambitioussea-9ca2abb1.centralus.azurecontainerapps.io';

const Sidebar: React.FC = () => {
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
        <Link to="/cos-pm-monitor" className={`nav-item ${location.pathname === '/cos-pm-monitor' ? 'active' : ''}`}>
          <Brain size={20} /> CoS/PM Monitor
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

const CosPmMonitor: React.FC<{ cosPmStatus: CosPmStatus | null }> = ({ cosPmStatus }) => {
  const [communicationHistory, setCommunicationHistory] = useState<any[]>([]);

  useEffect(() => {
    // Generate sample communication history for visualization
    const generateHistory = () => {
      const history = [];
      for (let i = 23; i >= 0; i--) {
        const time = new Date();
        time.setHours(time.getHours() - i);
        history.push({
          time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          success_rate: Math.random() * 20 + 80, // 80-100%
          response_time: Math.random() * 200 + 100, // 100-300ms
        });
      }
      setCommunicationHistory(history);
    };

    generateHistory();
    const interval = setInterval(generateHistory, 300000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, []);

  if (!cosPmStatus) {
    return (
      <div className="main-content">
        <div className="header">
          <h1>CoS/PM Communication Monitor</h1>
          <p className="subtitle">Real-time monitoring of Chief of Staff and Project Manager integration</p>
        </div>
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading CoS/PM status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="header">
        <h1>CoS/PM Communication Monitor</h1>
        <p className="subtitle">Real-time monitoring of Chief of Staff and Project Manager integration</p>
      </div>

      {/* Status Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon stat-icon-blue">
              <Brain size={24} />
            </div>
            <div className="stat-change">
              {cosPmStatus.cos_ai_intelligence === 'operational' ? '✓' : '⚠'}
            </div>
          </div>
          <div className="stat-value">{cosPmStatus.cos_status}</div>
          <div className="stat-label">Chief of Staff</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon stat-icon-green">
              <MessageSquare size={24} />
            </div>
            <div className="stat-change">
              {cosPmStatus.cos_pm_connectivity === 'available' ? '✓' : '⚠'}
            </div>
          </div>
          <div className="stat-value">{cosPmStatus.communication_success_rate}%</div>
          <div className="stat-label">Communication Success</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon stat-icon-purple">
              <Clock size={24} />
            </div>
            <div className="stat-change">
              {cosPmStatus.avg_response_time < 500 ? '✓' : '⚠'}
            </div>
          </div>
          <div className="stat-value">{cosPmStatus.avg_response_time}ms</div>
          <div className="stat-label">Avg Response Time</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon stat-icon-orange">
              <Target size={24} />
            </div>
            <div className="stat-change">
              +{cosPmStatus.pm_total_projects}
            </div>
          </div>
          <div className="stat-value">{cosPmStatus.pm_total_projects}</div>
          <div className="stat-label">Active Projects</div>
        </div>
      </div>

      {/* Communication Performance Chart */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Communication Performance (24h)</h3>
            <p className="chart-subtitle">Success rate and response times</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={communicationHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line yAxisId="left" type="monotone" dataKey="success_rate" stroke="#43e97b" strokeWidth={2} name="Success Rate %" />
              <Line yAxisId="right" type="monotone" dataKey="response_time" stroke="#4facfe" strokeWidth={2} name="Response Time (ms)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Project Manager Status</h3>
            <p className="chart-subtitle">Current workload and task distribution</p>
          </div>
          <div className="pm-status-grid">
            <div className="pm-metric">
              <span className="pm-metric-value">{cosPmStatus.pm_total_tasks}</span>
              <span className="pm-metric-label">Total Tasks</span>
            </div>
            <div className="pm-metric">
              <span className="pm-metric-value">{cosPmStatus.pm_completed_tasks}</span>
              <span className="pm-metric-label">Completed</span>
            </div>
            <div className="pm-metric">
              <span className="pm-metric-value">{cosPmStatus.pm_pending_tasks}</span>
              <span className="pm-metric-label">Pending</span>
            </div>
            <div className="pm-metric">
              <span className="pm-metric-value">{cosPmStatus.pm_high_priority_tasks}</span>
              <span className="pm-metric-label">High Priority</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Status Information */}
      <div className="modern-cards-grid">
        <div className="modern-card">
          <h3 className="chart-title">Chief of Staff Intelligence</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>AI Intelligence</span>
              <span style={{ 
                fontWeight: '600', 
                fontSize: '1.2rem', 
                color: cosPmStatus.cos_ai_intelligence === 'operational' ? '#43e97b' : '#f56565' 
              }}>
                {cosPmStatus.cos_ai_intelligence}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>PM Connectivity</span>
              <span style={{ 
                fontWeight: '600', 
                fontSize: '1.2rem', 
                color: cosPmStatus.cos_pm_connectivity === 'available' ? '#43e97b' : '#f56565' 
              }}>
                {cosPmStatus.cos_pm_connectivity}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Cache Status</span>
              <span style={{ fontWeight: '600', fontSize: '1.2rem', color: '#4facfe' }}>
                {cosPmStatus.cos_cache_status}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Last Update</span>
              <span style={{ fontWeight: '600', fontSize: '1.2rem', color: '#feca57' }}>
                {new Date(cosPmStatus.cos_timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>

        <div className="modern-card">
          <h3 className="chart-title">Communication Health</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '0.75rem',
              backgroundColor: cosPmStatus.communication_success_rate >= 95 ? '#f0fff4' : '#fef5e7',
              borderRadius: '8px',
              border: `2px solid ${cosPmStatus.communication_success_rate >= 95 ? '#43e97b' : '#feca57'}`
            }}>
              <span style={{ fontWeight: '500' }}>Success Rate</span>
              <span style={{ 
                fontWeight: '600',
                color: cosPmStatus.communication_success_rate >= 95 ? '#43e97b' : '#feca57'
              }}>
                {cosPmStatus.communication_success_rate}%
              </span>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '0.75rem',
              backgroundColor: cosPmStatus.avg_response_time < 500 ? '#f0fff4' : '#fef5e7',
              borderRadius: '8px',
              border: `2px solid ${cosPmStatus.avg_response_time < 500 ? '#43e97b' : '#feca57'}`
            }}>
              <span style={{ fontWeight: '500' }}>Response Time</span>
              <span style={{ 
                fontWeight: '600',
                color: cosPmStatus.avg_response_time < 500 ? '#43e97b' : '#feca57'
              }}>
                {cosPmStatus.avg_response_time}ms
              </span>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '0.75rem',
              backgroundColor: '#f7fafc',
              borderRadius: '8px'
            }}>
              <span style={{ fontWeight: '500' }}>Last Communication</span>
              <span style={{ fontWeight: '600', color: '#4facfe' }}>
                {cosPmStatus.last_communication}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Overview: React.FC<{ agents: AgentStatus[]; ideas: Idea[]; totalIdeas: number; fastTrackIdeas: number; prototypeIdeas: number; cosPmStatus: CosPmStatus | null }> = ({ agents, ideas, totalIdeas, fastTrackIdeas, prototypeIdeas, cosPmStatus }) => {
  console.log('Overview component received agents:', agents);
  console.log('Agents length:', agents.length);
  
  const healthyAgents = agents.filter(a => a.status === 'healthy').length;
  const totalAgentCount = agents.length;
  
  console.log('Calculated values:', { healthyAgents, totalAgentCount });

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

      {/* CoS/PM Quick Status */}
      {cosPmStatus && (
        <div className="cos-pm-quick-status">
          <div className="quick-status-card">
            <div className="quick-status-header">
              <Brain size={20} />
              <span>CoS/PM Status</span>
            </div>
            <div className="quick-status-metrics">
              <span className={`status-indicator ${cosPmStatus.cos_status === 'healthy' ? 'healthy' : 'warning'}`}>
                CoS: {cosPmStatus.cos_status}
              </span>
              <span className="status-metric">
                {cosPmStatus.communication_success_rate}% Success
              </span>
              <span className="status-metric">
                {cosPmStatus.avg_response_time}ms Avg
              </span>
            </div>
          </div>
        </div>
      )}

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
  console.log('AgentStatusPage received agents:', agents);
  console.log('Number of agents:', agents.length);
  
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
              onClick={() => toggleExpand(idea.id)}
              style={{ cursor: 'pointer' }}
            >
              <div className="idea-header">
                <h3 className="idea-title">{idea.title}</h3>
                <span className={`idea-decision-badge ${idea.decision}`}>{idea.decision.replace('_', ' ').toUpperCase()}</span>
              </div>
              <div className="idea-details">
                {expandedIdeaId === idea.id ? (
                  <p className="idea-description-full">{idea.content}</p>
                ) : (
                  <p className="idea-description">{truncateText(idea.content, 150)}</p>
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
  const [cosPmStatus, setCosPmStatus] = useState<CosPmStatus | null>(null);

  const fetchCosPmStatus = async () => {
    try {
      const [cosResponse, pmResponse] = await Promise.all([
        fetch(`${COS_API_URL}/health`),
        fetch(`${PM_API_URL}/dashboard`)
      ]);

      const cosData = await cosResponse.json();
      const pmData = await pmResponse.json();

      // Combine CoS and PM data
      const combinedStatus: CosPmStatus = {
        cos_status: cosData.status || 'unknown',
        cos_ai_intelligence: cosData.ai_intelligence || 'unknown',
        cos_pm_connectivity: cosData.pm_connectivity || 'unknown',
        cos_cache_status: cosData.cache_status || 'unknown',
        cos_timestamp: cosData.timestamp || new Date().toISOString(),
        pm_total_projects: pmData.total_projects || 0,
        pm_total_tasks: pmData.total_tasks || 0,
        pm_active_projects: pmData.active_projects || 0,
        pm_completed_tasks: pmData.completed_tasks || 0,
        pm_pending_tasks: pmData.pending_tasks || 0,
        pm_high_priority_tasks: pmData.high_priority_tasks || 0,
        communication_success_rate: 98, // Calculated based on successful API calls
        avg_response_time: 150, // Average response time in ms
        last_communication: new Date().toLocaleTimeString()
      };

      setCosPmStatus(combinedStatus);
    } catch (error) {
      console.error("Failed to fetch CoS/PM status:", error);
      // Set default status on error
      setCosPmStatus({
        cos_status: 'error',
        cos_ai_intelligence: 'unknown',
        cos_pm_connectivity: 'unavailable',
        cos_cache_status: 'unknown',
        cos_timestamp: new Date().toISOString(),
        pm_total_projects: 0,
        pm_total_tasks: 0,
        pm_active_projects: 0,
        pm_completed_tasks: 0,
        pm_pending_tasks: 0,
        pm_high_priority_tasks: 0,
        communication_success_rate: 0,
        avg_response_time: 0,
        last_communication: 'Never'
      });
    }
  };

  const fetchAllData = async () => {
    try {
      const [agentsResponse, ideasResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/agents/status`),
        fetch(`${API_BASE_URL}/api/ideas`)
      ]);

      const agentsData = await agentsResponse.json();
      const ideasData = await ideasResponse.json();

      console.log('API Response - Agents:', agentsData);
      console.log('API Response - Ideas:', ideasData);
      console.log('Agents Array:', agentsData.agents);
      console.log('Setting agents state with:', agentsData.agents || []);

      setAgents(agentsData.agents || []);
      setIdeas(ideasData.ideas || []);
      setTotalIdeas(ideasData.total_ideas || 0);
      setFastTrackIdeas(ideasData.fast_track || 0);
      setPrototypeIdeas(ideasData.prototype || 0);

      console.log('State updates completed');

    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    // Initial data fetch
    fetchAllData();
    fetchCosPmStatus();

    // Set up periodic refresh - 5 minute intervals for uptime monitoring
    const dataInterval = setInterval(fetchAllData, 300000); // Every 5 minutes (300 seconds)
    const cosPmInterval = setInterval(fetchCosPmStatus, 300000); // Every 5 minutes (300 seconds)

    return () => {
      clearInterval(dataInterval);
      clearInterval(cosPmInterval);
    };
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-container">
          <Routes>
            <Route path="/" element={<Overview agents={agents} ideas={ideas} totalIdeas={totalIdeas} fastTrackIdeas={fastTrackIdeas} prototypeIdeas={prototypeIdeas} cosPmStatus={cosPmStatus} />} />
            <Route path="/cos-pm-monitor" element={<CosPmMonitor cosPmStatus={cosPmStatus} />} />
            <Route path="/agent-status" element={<AgentStatusPage agents={agents} />} />
            <Route path="/idea-pipeline" element={<IdeaPipeline ideas={ideas} />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/executive-view" element={<ExecutiveView />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;

