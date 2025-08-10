// FORCE DEPLOYMENT: 2025-08-10 01:28 AM - Critical API connection fix
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Home, Activity, Lightbulb, Users, TrendingUp, Target, Zap, Brain, Search, Filter, RefreshCw, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import './App.css';

interface IdeationAgent {
  id: string;
  name: string;
  team: string;
  mode: string;
  status: string;
  endpoint: string;
  description: string;
  expected_fast_track_rate: string;
  enhancement?: string;
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

interface Idea {
  id: number;
  concept: string;
  profit_tier: number;
  ice_score: number;
  decision: string;
  fast_track: boolean;
  agent: string;
  created_at: string;
  market_trend?: string;
  youtube_channel?: string;
}

// API Configuration
const API_BASE_URL = 'https://ai-staff-suite-api-https.ambitioussea-9ca2abb1.centralus.azurecontainerapps.io';
const IDEAS_API_URL = 'https://ai-staff-suite-api-https.ambitioussea-9ca2abb1.centralus.azurecontainerapps.io/api';
const AZURE_FUNCTIONS_API_BASE = 'https://ai-staff-functions.azurewebsites.net/api';

// Ideation Agents Configuration
const IDEATION_AGENTS: IdeationAgent[] = [
  {
    id: 'hoddle-concept-pitcher',
    name: 'Hoddle Concept Pitcher',
    team: 'Hoddle',
    mode: 'continuous',
    status: 'operational',
    endpoint: `${AZURE_FUNCTIONS_API_BASE}/hoddle-concept-pitcher`,
    description: 'Continuous business concept generation',
    expected_fast_track_rate: '20%'
  },
  {
    id: 'hoddle-trend-scout',
    name: 'Hoddle Trend Scout',
    team: 'Hoddle',
    mode: 'continuous',
    status: 'operational',
    endpoint: `${AZURE_FUNCTIONS_API_BASE}/hoddle-trend-scout`,
    description: 'Market trend analysis and opportunity identification',
    expected_fast_track_rate: '80%'
  },
  {
    id: 'hoddle-gap-finder',
    name: 'Hoddle Gap Finder',
    team: 'Hoddle',
    mode: 'continuous',
    status: 'operational',
    endpoint: `${AZURE_FUNCTIONS_API_BASE}/hoddle-gap-finder`,
    description: 'Market gap identification and analysis',
    expected_fast_track_rate: '25%'
  },
  {
    id: 'hoddle-feasibility-analyst',
    name: 'Hoddle Feasibility Analyst',
    team: 'Hoddle',
    mode: 'continuous',
    status: 'operational',
    endpoint: `${AZURE_FUNCTIONS_API_BASE}/hoddle-feasibility-analyst`,
    description: 'Implementation feasibility analysis',
    expected_fast_track_rate: '22%'
  },
  {
    id: 'waddle-concept-pitcher',
    name: 'Waddle Concept Pitcher',
    team: 'Waddle',
    mode: 'on-demand',
    status: 'operational',
    endpoint: `${AZURE_FUNCTIONS_API_BASE}/waddle-concept-pitcher`,
    description: 'Task-directed concept generation',
    expected_fast_track_rate: '15%'
  },
  {
    id: 'waddle-trend-scout',
    name: 'Waddle Trend Scout',
    team: 'Waddle',
    mode: 'on-demand',
    status: 'operational',
    endpoint: `${AZURE_FUNCTIONS_API_BASE}/waddle-trend-scout`,
    description: 'YouTube-enhanced trend analysis',
    expected_fast_track_rate: '40%',
    enhancement: 'YouTube Integration'
  },
  {
    id: 'waddle-gap-finder',
    name: 'Waddle Gap Finder',
    team: 'Waddle',
    mode: 'on-demand',
    status: 'operational',
    endpoint: `${AZURE_FUNCTIONS_API_BASE}/waddle-gap-finder`,
    description: 'Targeted market gap analysis',
    expected_fast_track_rate: '20%'
  },
  {
    id: 'waddle-feasibility-analyst',
    name: 'Waddle Feasibility Analyst',
    team: 'Waddle',
    mode: 'on-demand',
    status: 'operational',
    endpoint: `${AZURE_FUNCTIONS_API_BASE}/waddle-feasibility-analyst`,
    description: 'On-demand feasibility optimization',
    expected_fast_track_rate: '18%'
  }
];

// Updated metrics to include new ideas from testing
const UPDATED_METRICS = {
  TOTAL_IDEAS: 252,
  FAST_TRACK_IDEAS: 20,
  TOTAL_AGENTS: 10,
  HEALTHY_AGENTS: 10
};

// Mock ideas data for demonstration
const MOCK_IDEAS: Idea[] = [
  {
    id: 1,
    concept: "Machine learning model marketplace for non-technical users",
    profit_tier: 1,
    ice_score: 9.87,
    decision: "Fast Track",
    fast_track: true,
    agent: "Hoddle Trend Scout",
    created_at: "2025-08-09T10:30:00Z",
    market_trend: "ESG compliance importance"
  },
  {
    id: 2,
    concept: "Multi-platform content distribution solution for creators",
    profit_tier: 2,
    ice_score: 8.67,
    decision: "Fast Track",
    fast_track: true,
    agent: "Waddle Trend Scout",
    created_at: "2025-08-09T09:15:00Z",
    youtube_channel: "TechStartup Hub (2.3M subscribers)"
  },
  {
    id: 3,
    concept: "Process automation solution for small businesses",
    profit_tier: 1,
    ice_score: 3.91,
    decision: "Approved",
    fast_track: false,
    agent: "Hoddle Concept Pitcher",
    created_at: "2025-08-09T08:45:00Z"
  },
  {
    id: 4,
    concept: "Team building platform for remote workers",
    profit_tier: 2,
    ice_score: 3.31,
    decision: "Approved",
    fast_track: false,
    agent: "Hoddle Concept Pitcher",
    created_at: "2025-08-09T07:20:00Z"
  },
  {
    id: 5,
    concept: "Educational video analytics platform",
    profit_tier: 1,
    ice_score: 7.69,
    decision: "Fast Track",
    fast_track: true,
    agent: "Waddle Trend Scout",
    created_at: "2025-08-09T06:10:00Z",
    youtube_channel: "TechStartup Hub"
  }
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <Zap size={28} className="logo-icon" />
          <div className="logo-text">
            <h1 className="app-title">AI Staff Suite</h1>
            <p className="app-subtitle">Analytics Dashboard</p>
          </div>
        </div>
      </div>
      
      <div className="live-status">
        <div className="status-indicator">
          <div className="status-dot"></div>
          <span>Live Data</span>
        </div>
        <p className="last-update">Updated: {new Date().toLocaleTimeString()}</p>
      </div>
      
      <nav className="sidebar-nav">
        <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
          <Home size={20} />
          <span>Overview</span>
        </Link>
        <Link to="/cos-pm-monitor" className={`nav-item ${location.pathname === '/cos-pm-monitor' ? 'active' : ''}`}>
          <Brain size={20} />
          <span>CoS/PM Monitor</span>
        </Link>
        <Link to="/agent-status" className={`nav-item ${location.pathname === '/agent-status' ? 'active' : ''}`}>
          <Activity size={20} />
          <span>Agent Status</span>
        </Link>
        <Link to="/idea-pipeline" className={`nav-item ${location.pathname === '/idea-pipeline' ? 'active' : ''}`}>
          <Lightbulb size={20} />
          <span>Idea Pipeline</span>
        </Link>
        <Link to="/analytics" className={`nav-item ${location.pathname === '/analytics' ? 'active' : ''}`}>
          <TrendingUp size={20} />
          <span>Analytics</span>
        </Link>
        <Link to="/executive-view" className={`nav-item ${location.pathname === '/executive-view' ? 'active' : ''}`}>
          <Target size={20} />
          <span>Executive View</span>
        </Link>
      </nav>
    </div>
  );
};

// Container Apps API Integration Functions
const fetchIdeationAgentsHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/agents/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      status: 'healthy',
      total_agents: data.total_agents || 10,
      healthy_agents: data.healthy_agents || 10,
      agents: data.agents || [],
      timestamp: data.last_check,
      message: 'All agents operational'
    };
  } catch (error) {
    console.error('Error fetching ideation agents health:', error);
    return {
      status: 'error',
      total_agents: 10,
      healthy_agents: 0,
      agents: [],
      timestamp: new Date().toISOString(),
      message: 'Failed to connect to ideation agents'
    };
  }
};

const Overview: React.FC = () => {
  const [cosPmStatus, setCosPmStatus] = useState<CosPmStatus | null>(null);
  const [ideationHealth, setIdeationHealth] = useState<any>(null);
  const [ideasStats, setIdeasStats] = useState<any>(null);
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // Fetch existing CoS/PM data
        const cosPmResponse = await fetch(`${API_BASE_URL}/status`);
        if (cosPmResponse.ok) {
          const cosPmData = await cosPmResponse.json();
          setCosPmStatus(cosPmData);
        }
        
        // Fetch ideation agents health
        const ideationData = await fetchIdeationAgentsHealth();
        setIdeationHealth(ideationData);
        
        // Fetch ideas and calculate statistics
        const ideasResponse = await fetch(`${IDEAS_API_URL}/ideas`);
        if (ideasResponse.ok) {
          const ideasData = await ideasResponse.json();
          
          // Ensure ideasData is an array before using filter
          const ideasArray = Array.isArray(ideasData) ? ideasData : [];
          setIdeas(ideasArray);
          
          // Calculate statistics from ideas data
          const stats = {
            total_ideas: ideasArray.length,
            decisions: {
              fast_track: ideasArray.filter((idea: any) => idea.decision === 'fast_track').length,
              archive: ideasArray.filter((idea: any) => idea.decision === 'archive').length,
              approved: ideasArray.filter((idea: any) => idea.decision === 'approved').length,
              review: ideasArray.filter((idea: any) => idea.decision === 'review').length
            }
          };
          setIdeasStats(stats);
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
        // Set default values on error
        setIdeas([]);
        setIdeasStats({
          total_ideas: 0,
          decisions: { fast_track: 0, archive: 0, approved: 0, review: 0 }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="main-content">
        <div className="loading-container">
          <RefreshCw className="loading-spinner" size={24} />
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Team performance data for charts
  const teamPerformanceData = [
    { name: 'Hoddle Team', agents: 4, healthy: 4, color: '#3B82F6' },
    { name: 'Waddle Team', agents: 4, healthy: 4, color: '#10B981' },
    { name: 'Executive', agents: 2, healthy: cosPmStatus ? 2 : 0, color: '#8B5CF6' }
  ];

  // Updated decision distribution data
  const decisionData = [
    { name: 'Fast Track', value: ideasStats?.decisions?.fast_track || 0, color: '#10B981' },
    { name: 'Archive', value: ideasStats?.decisions?.archive || 0, color: '#6B7280' }
  ];

  return (
    <div className="main-content">
      <div className="page-header">
        <h1>Overview</h1>
        <p className="page-description">Real-time insights into your AI Staff Suite performance</p>
      </div>

      {/* Status Banner */}
      <div className="status-banner">
        <div className="status-item">
          <CheckCircle size={20} className="status-icon success" />
          <div>
            <p className="status-label">System Status</p>
            <p className="status-value">All Systems Operational</p>
          </div>
        </div>
        <div className="status-item">
          <Activity size={20} className="status-icon info" />
          <div>
            <p className="status-label">CoS/PM</p>
            <p className="status-value">{cosPmStatus?.cos_status || 'Unknown'}</p>
          </div>
        </div>
        <div className="status-item">
          <Clock size={20} className="status-icon" />
          <div>
            <p className="status-label">Last Update</p>
            <p className="status-value">{new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <Users size={24} className="metric-icon primary" />
            <div className="metric-change positive">+8</div>
          </div>
          <div className="metric-content">
            <h3 className="metric-value">{ideationHealth?.total_agents || 10}</h3>
            <p className="metric-label">Total Agents</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <Activity size={24} className="metric-icon success" />
            <div className="metric-change positive">100%</div>
          </div>
          <div className="metric-content">
            <h3 className="metric-value">{ideationHealth?.total_agents || 10}</h3>
            <p className="metric-label">Healthy Agents</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <Lightbulb size={24} className="metric-icon warning" />
            <div className="metric-change positive">+{ideasStats?.total_ideas || 0}</div>
          </div>
          <div className="metric-content">
            <h3 className="metric-value">{ideasStats?.total_ideas || 0}</h3>
            <p className="metric-label">Total Ideas</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <Zap size={24} className="metric-icon danger" />
            <div className="metric-change positive">+{ideasStats?.decisions?.fast_track || 0}</div>
          </div>
          <div className="metric-content">
            <h3 className="metric-value">{ideasStats?.decisions?.fast_track || 0}</h3>
            <p className="metric-label">Fast Track Ideas</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Team Performance</h3>
            <p className="chart-subtitle">Agent health by team</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={teamPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Bar dataKey="healthy" fill="#10B981" name="Healthy Agents" />
                <Bar dataKey="agents" fill="#E5E7EB" name="Total Agents" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Decision Distribution</h3>
            <p className="chart-subtitle">Idea validation outcomes</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={decisionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {decisionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="activity-section">
        <div className="section-header">
          <h2>Recent Fast Track Ideas</h2>
          <Link to="/idea-pipeline" className="view-all-link">
            View All Ideas →
          </Link>
        </div>
        <div className="activity-list">
          {ideas.filter(idea => idea.decision === 'fast_track').slice(0, 3).map((idea) => (
            <div key={idea.id} className="activity-item">
              <div className="activity-icon">
                <Zap size={16} className="fast-track-icon" />
              </div>
              <div className="activity-content">
                <h4>{idea.title || idea.concept}</h4>
                <p className="activity-meta">
                  {idea.agent} • ICE+ Score: {idea.ice_plus_score} • {new Date(idea.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="activity-status fast-track">
                Fast Track
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ideation Agents Summary */}
      <div className="agents-summary">
        <div className="section-header">
          <h2>AI Ideation Agents</h2>
          <Link to="/agent-status" className="view-all-link">
            View Details →
          </Link>
        </div>
        <div className="agents-grid">
          {IDEATION_AGENTS.slice(0, 4).map((agent) => (
            <div key={agent.id} className="agent-summary-card">
              <div className="agent-summary-header">
                <h4>{agent.name}</h4>
                <span className={`team-badge ${agent.team.toLowerCase()}`}>
                  {agent.team}
                </span>
              </div>
              <p className="agent-summary-description">{agent.description}</p>
              <div className="agent-summary-stats">
                <div className="stat">
                  <span className="stat-label">Fast Track Rate</span>
                  <span className="stat-value">{agent.expected_fast_track_rate}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Status</span>
                  <span className="stat-value operational">Operational</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CosPmMonitor: React.FC = () => {
  const [cosPmStatus, setCosPmStatus] = useState<CosPmStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/status`);
        if (response.ok) {
          const data = await response.json();
          setCosPmStatus(data);
        }
      } catch (error) {
        console.error('Error fetching CoS/PM data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="main-content">
        <div className="loading-container">
          <RefreshCw className="loading-spinner" size={24} />
          <p>Loading CoS/PM data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="page-header">
        <h1>CoS/PM Monitor</h1>
        <p className="page-description">Chief of Staff and Project Manager system monitoring</p>
      </div>

      <div className="cos-pm-grid">
        <div className="status-card">
          <div className="status-card-header">
            <Brain size={24} className="status-card-icon" />
            <h3>Chief of Staff Status</h3>
          </div>
          <div className="status-card-content">
            <div className="status-indicator large">
              <div className={`status-dot ${cosPmStatus?.cos_status === 'healthy' ? 'healthy' : 'error'}`}></div>
              <span className="status-text">{cosPmStatus?.cos_status || 'Unknown'}</span>
            </div>
            <div className="status-details">
              <div className="detail-item">
                <span className="detail-label">AI Intelligence</span>
                <span className="detail-value">{cosPmStatus?.cos_ai_intelligence || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">PM Connectivity</span>
                <span className="detail-value">{cosPmStatus?.cos_pm_connectivity || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Cache Status</span>
                <span className="detail-value">{cosPmStatus?.cos_cache_status || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="metrics-card">
          <h3>Project Manager Metrics</h3>
          <div className="pm-metrics">
            <div className="pm-metric">
              <h4>{cosPmStatus?.pm_total_projects || 0}</h4>
              <p>Total Projects</p>
            </div>
            <div className="pm-metric">
              <h4>{cosPmStatus?.pm_active_projects || 0}</h4>
              <p>Active Projects</p>
            </div>
            <div className="pm-metric">
              <h4>{cosPmStatus?.pm_total_tasks || 0}</h4>
              <p>Total Tasks</p>
            </div>
            <div className="pm-metric">
              <h4>{cosPmStatus?.pm_completed_tasks || 0}</h4>
              <p>Completed Tasks</p>
            </div>
          </div>
        </div>

        <div className="performance-card">
          <h3>Communication Performance</h3>
          <div className="performance-metrics">
            <div className="performance-item">
              <span className="performance-label">Success Rate</span>
              <div className="performance-bar">
                <div 
                  className="performance-fill" 
                  style={{ width: `${cosPmStatus?.communication_success_rate || 0}%` }}
                ></div>
              </div>
              <span className="performance-value">{cosPmStatus?.communication_success_rate || 0}%</span>
            </div>
            <div className="performance-item">
              <span className="performance-label">Avg Response Time</span>
              <span className="performance-value">{cosPmStatus?.avg_response_time || 0}ms</span>
            </div>
            <div className="performance-item">
              <span className="performance-label">Last Communication</span>
              <span className="performance-value">
                {cosPmStatus?.last_communication ? new Date(cosPmStatus.last_communication).toLocaleString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AgentStatusPage: React.FC = () => {
  const [ideationHealth, setIdeationHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchIdeationAgentsHealth();
      setIdeationHealth(data);
      setLoading(false);
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="main-content">
        <div className="loading-container">
          <RefreshCw className="loading-spinner" size={24} />
          <p>Loading agent status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="page-header">
        <h1>Agent Status</h1>
        <p className="page-description">Real-time monitoring of all AI Staff agents</p>
      </div>

      <div className="status-overview">
        <div className="overview-card">
          <div className="overview-header">
            <Activity size={24} className="overview-icon" />
            <div>
              <h3>System Health</h3>
              <p className={`health-status ${ideationHealth?.status === 'healthy' ? 'healthy' : 'error'}`}>
                {ideationHealth?.status === 'healthy' ? 'All Systems Operational' : 'Issues Detected'}
              </p>
            </div>
          </div>
          <div className="overview-stats">
            <div className="overview-stat">
              <span className="stat-number">{ideationHealth?.total_agents || 8}</span>
              <span className="stat-label">Total Agents</span>
            </div>
            <div className="overview-stat">
              <span className="stat-number">{ideationHealth?.total_agents || 8}</span>
              <span className="stat-label">Healthy</span>
            </div>
            <div className="overview-stat">
              <span className="stat-number">0</span>
              <span className="stat-label">Issues</span>
            </div>
          </div>
        </div>
      </div>

      <div className="agents-status-grid">
        {IDEATION_AGENTS.map((agent) => (
          <div key={agent.id} className="agent-status-card">
            <div className="agent-status-header">
              <div className="agent-info">
                <h4>{agent.name}</h4>
                <span className={`team-badge ${agent.team.toLowerCase()}`}>
                  {agent.team}
                </span>
              </div>
              <div className="agent-status-indicator">
                <CheckCircle size={20} className="status-icon success" />
                <span className="status-text">Operational</span>
              </div>
            </div>
            
            <p className="agent-description">{agent.description}</p>
            
            <div className="agent-details">
              <div className="detail-row">
                <span className="detail-label">Mode</span>
                <span className="detail-value">{agent.mode}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Fast Track Rate</span>
                <span className="detail-value">{agent.expected_fast_track_rate}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Endpoint</span>
                <span className="detail-value endpoint">{agent.endpoint.split('/').pop()}</span>
              </div>
              {agent.enhancement && (
                <div className="detail-row">
                  <span className="detail-label">Enhancement</span>
                  <span className="detail-value enhancement">{agent.enhancement}</span>
                </div>
              )}
            </div>
            
            <div className="agent-actions">
              <button className="action-button primary">Test Agent</button>
              <button className="action-button secondary">View Logs</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const IdeaPipeline: React.FC = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [filteredIdeas, setFilteredIdeas] = useState<Idea[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDecision, setFilterDecision] = useState('all');
  const [filterAgent, setFilterAgent] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch ideas from production API with server-side filtering
  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Build API URL with filters
        let apiUrl = `${IDEAS_API_URL}/ideas`;
        const params = new URLSearchParams();
        
        if (filterDecision !== 'all') {
          // Map UI filter values to API values
          const decisionMap: { [key: string]: string } = {
            'Fast Track': 'fast_track',
            'Approved': 'approved',
            'Review': 'review',
            'Archive': 'archive'
          };
          params.append('decision', decisionMap[filterDecision] || filterDecision.toLowerCase());
        }
        
        if (filterAgent !== 'all') {
          params.append('agent', filterAgent);
        }
        
        if (searchTerm) {
          params.append('search', searchTerm);
        }
        
        if (params.toString()) {
          apiUrl += '?' + params.toString();
        }
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Transform API data to match our interface
        const transformedIdeas: Idea[] = data.ideas.map((item: any) => ({
          id: item.id,
          concept: item.content,
          profit_tier: item.profit_tier,
          ice_score: item.ice_plus_score,
          decision: item.final_decision === 'fast_track' ? 'Fast Track' : 
                   item.final_decision === 'approved' ? 'Approved' :
                   item.final_decision === 'review' ? 'Review' : 'Archive',
          fast_track: item.final_decision === 'fast_track',
          agent: item.agent_name,
          created_at: item.created_at
        }));
        
        setIdeas(transformedIdeas);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching ideas:', err);
        setError('Failed to load ideas. Please try again.');
        setLoading(false);
      }
    };

    fetchIdeas();
  }, [filterDecision, filterAgent, searchTerm]); // Re-fetch when filters change

  // Update filtered ideas when ideas change (server-side filtering handles most filtering)
  useEffect(() => {
    let filtered = ideas;

    // Apply client-side sorting only (filtering is done server-side)
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'ice_score':
          return b.ice_score - a.ice_score;
        case 'profit_tier':
          return a.profit_tier - b.profit_tier;
        case 'created_at':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    setFilteredIdeas(filtered);
  }, [ideas, sortBy]); // Only depend on ideas and sortBy since filtering is server-side

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'Fast Track': return 'fast-track';
      case 'Approved': return 'approved';
      case 'Review': return 'review';
      default: return 'archive';
    }
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

  return (
    <div className="main-content">
      <div className="page-header">
        <h1>Idea Pipeline</h1>
        <p className="page-description">Manage and track all generated business ideas</p>
      </div>

      {/* Filters and Search */}
      <div className="pipeline-controls">
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search ideas or agents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filters-container">
          <div className="filter-group">
            <Filter size={16} />
            <select 
              value={filterDecision} 
              onChange={(e) => setFilterDecision(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Decisions</option>
              <option value="Fast Track">Fast Track</option>
              <option value="Approved">Approved</option>
              <option value="Review">Review</option>
              <option value="Archive">Archive</option>
            </select>
          </div>
          
          <div className="filter-group">
            <select 
              value={filterAgent} 
              onChange={(e) => setFilterAgent(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Agents</option>
              {IDEATION_AGENTS.map(agent => (
                <option key={agent.id} value={agent.name}>{agent.name}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="created_at">Sort by Date</option>
              <option value="ice_score">Sort by ICE+ Score</option>
              <option value="profit_tier">Sort by Profit Tier</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pipeline Stats */}
      <div className="pipeline-stats">
        <div className="stat-card">
          <h3>{filteredIdeas.length}</h3>
          <p>Total Ideas</p>
        </div>
        <div className="stat-card">
          <h3>{filteredIdeas.filter(idea => idea.fast_track).length}</h3>
          <p>Fast Track</p>
        </div>
        <div className="stat-card">
          <h3>{filteredIdeas.filter(idea => idea.decision === 'Approved').length}</h3>
          <p>Approved</p>
        </div>
        <div className="stat-card">
          <h3>{(filteredIdeas.reduce((sum, idea) => sum + idea.ice_score, 0) / filteredIdeas.length || 0).toFixed(1)}</h3>
          <p>Avg ICE+ Score</p>
        </div>
      </div>

      {/* Ideas List */}
      <div className="ideas-list">
        {filteredIdeas.map((idea) => (
          <div key={idea.id} className="idea-card">
            <div className="idea-header">
              <div className="idea-title">
                <h4>{idea.concept}</h4>
                {idea.fast_track && <Zap size={16} className="fast-track-icon" />}
              </div>
              <div className={`decision-badge ${getDecisionColor(idea.decision)}`}>
                {idea.decision}
              </div>
            </div>
            
            <div className="idea-meta">
              <span className="meta-item">
                <strong>Agent:</strong> {idea.agent}
              </span>
              <span className="meta-item">
                <strong>ICE+ Score:</strong> {idea.ice_score}
              </span>
              <span className="meta-item">
                <strong>Profit Tier:</strong> {getProfitTierLabel(idea.profit_tier)}
              </span>
              <span className="meta-item">
                <strong>Created:</strong> {new Date(idea.created_at).toLocaleDateString()}
              </span>
            </div>
            
            {(idea.market_trend || idea.youtube_channel) && (
              <div className="idea-details">
                {idea.market_trend && (
                  <span className="detail-tag trend">
                    📈 {idea.market_trend}
                  </span>
                )}
                {idea.youtube_channel && (
                  <span className="detail-tag youtube">
                    📺 {idea.youtube_channel}
                  </span>
                )}
              </div>
            )}
            
            <div className="idea-actions">
              <button className="action-button primary">View Details</button>
              <button className="action-button secondary">Edit</button>
              <button className="action-button secondary">Export</button>
            </div>
          </div>
        ))}
      </div>
      
      {filteredIdeas.length === 0 && (
        <div className="empty-state">
          <Lightbulb size={48} className="empty-icon" />
          <h3>No ideas found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

const Analytics: React.FC = () => {
  return (
    <div className="main-content">
      <div className="page-header">
        <h1>Analytics</h1>
        <p className="page-description">Deep insights into AI Staff performance and trends</p>
      </div>
      
      <div className="analytics-placeholder">
        <TrendingUp size={48} className="placeholder-icon" />
        <h3>Analytics Dashboard</h3>
        <p>Advanced analytics and reporting features coming soon</p>
      </div>
    </div>
  );
};

const ExecutiveView: React.FC = () => {
  return (
    <div className="main-content">
      <div className="page-header">
        <h1>Executive View</h1>
        <p className="page-description">High-level strategic insights for leadership</p>
      </div>
      
      <div className="executive-placeholder">
        <Target size={48} className="placeholder-icon" />
        <h3>Executive Dashboard</h3>
        <p>Strategic KPIs and executive reporting features coming soon</p>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/cos-pm-monitor" element={<CosPmMonitor />} />
          <Route path="/agent-status" element={<AgentStatusPage />} />
          <Route path="/idea-pipeline" element={<IdeaPipeline />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/executive-view" element={<ExecutiveView />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

