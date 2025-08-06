import React, { useState } from 'react';
import { Filter, Calendar, User, Target, DollarSign, X } from 'lucide-react';

interface FilterOptions {
  decision: string[];
  agent: string[];
  dateRange: {
    start: string;
    end: string;
  };
  matrixScore: {
    min: number;
    max: number;
  };
  profitTier: number[];
}

interface IdeaFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void;
  availableAgents: string[];
}

const IdeaFilters: React.FC<IdeaFiltersProps> = ({ onFiltersChange, availableAgents }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    decision: [],
    agent: [],
    dateRange: {
      start: '',
      end: ''
    },
    matrixScore: {
      min: 0,
      max: 100
    },
    profitTier: []
  });

  const decisionOptions = [
    { value: 'fast_track', label: 'Fast Track', color: '#10b981' },
    { value: 'prototype', label: 'Prototype', color: '#3b82f6' },
    { value: 'watch_list', label: 'Watch List', color: '#f59e0b' },
    { value: 'archive', label: 'Archive', color: '#6b7280' }
  ];

  const profitTierOptions = [
    { value: 1, label: 'Tier 1 (Highest)', color: '#10b981' },
    { value: 2, label: 'Tier 2', color: '#3b82f6' },
    { value: 3, label: 'Tier 3', color: '#f59e0b' },
    { value: 4, label: 'Tier 4 (Lowest)', color: '#ef4444' }
  ];

  const handleDecisionChange = (decision: string) => {
    const newDecisions = filters.decision.includes(decision)
      ? filters.decision.filter(d => d !== decision)
      : [...filters.decision, decision];
    
    const newFilters = { ...filters, decision: newDecisions };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleAgentChange = (agent: string) => {
    const newAgents = filters.agent.includes(agent)
      ? filters.agent.filter(a => a !== agent)
      : [...filters.agent, agent];
    
    const newFilters = { ...filters, agent: newAgents };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleProfitTierChange = (tier: number) => {
    const newTiers = filters.profitTier.includes(tier)
      ? filters.profitTier.filter(t => t !== tier)
      : [...filters.profitTier, tier];
    
    const newFilters = { ...filters, profitTier: newTiers };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleDateRangeChange = (field: 'start' | 'end', value: string) => {
    const newFilters = {
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [field]: value
      }
    };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleMatrixScoreChange = (field: 'min' | 'max', value: number) => {
    const newFilters = {
      ...filters,
      matrixScore: {
        ...filters.matrixScore,
        [field]: value
      }
    };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters: FilterOptions = {
      decision: [],
      agent: [],
      dateRange: { start: '', end: '' },
      matrixScore: { min: 0, max: 100 },
      profitTier: []
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.decision.length > 0) count++;
    if (filters.agent.length > 0) count++;
    if (filters.dateRange.start || filters.dateRange.end) count++;
    if (filters.matrixScore.min > 0 || filters.matrixScore.max < 100) count++;
    if (filters.profitTier.length > 0) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="idea-filters">
      <button 
        className={`filter-toggle ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Filter size={20} />
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <span className="filter-count">{activeFilterCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="filter-panel">
          <div className="filter-header">
            <h3>Filter Ideas</h3>
            <div className="filter-actions">
              <button className="clear-filters" onClick={clearAllFilters}>
                <X size={16} />
                Clear All
              </button>
              <button className="close-filters" onClick={() => setIsOpen(false)}>
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="filter-sections">
            {/* Decision Filter */}
            <div className="filter-section">
              <div className="filter-section-header">
                <Target size={16} />
                <span>Decision Status</span>
              </div>
              <div className="filter-options">
                {decisionOptions.map(option => (
                  <label key={option.value} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.decision.includes(option.value)}
                      onChange={() => handleDecisionChange(option.value)}
                    />
                    <span className="checkbox-custom" style={{ borderColor: option.color }}>
                      {filters.decision.includes(option.value) && (
                        <div className="checkbox-check" style={{ backgroundColor: option.color }}></div>
                      )}
                    </span>
                    <span className="filter-label">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Agent Filter */}
            <div className="filter-section">
              <div className="filter-section-header">
                <User size={16} />
                <span>Agent</span>
              </div>
              <div className="filter-options">
                {availableAgents.map(agent => (
                  <label key={agent} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.agent.includes(agent)}
                      onChange={() => handleAgentChange(agent)}
                    />
                    <span className="checkbox-custom">
                      {filters.agent.includes(agent) && (
                        <div className="checkbox-check"></div>
                      )}
                    </span>
                    <span className="filter-label">{agent}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Date Range Filter */}
            <div className="filter-section">
              <div className="filter-section-header">
                <Calendar size={16} />
                <span>Date Range</span>
              </div>
              <div className="date-range-inputs">
                <div className="date-input-group">
                  <label>From:</label>
                  <input
                    type="date"
                    value={filters.dateRange.start}
                    onChange={(e) => handleDateRangeChange('start', e.target.value)}
                  />
                </div>
                <div className="date-input-group">
                  <label>To:</label>
                  <input
                    type="date"
                    value={filters.dateRange.end}
                    onChange={(e) => handleDateRangeChange('end', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Matrix Score Filter */}
            <div className="filter-section">
              <div className="filter-section-header">
                <Target size={16} />
                <span>Matrix Score</span>
              </div>
              <div className="range-inputs">
                <div className="range-input-group">
                  <label>Min:</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={filters.matrixScore.min}
                    onChange={(e) => handleMatrixScoreChange('min', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="range-input-group">
                  <label>Max:</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={filters.matrixScore.max}
                    onChange={(e) => handleMatrixScoreChange('max', parseInt(e.target.value) || 100)}
                  />
                </div>
              </div>
            </div>

            {/* Profit Tier Filter */}
            <div className="filter-section">
              <div className="filter-section-header">
                <DollarSign size={16} />
                <span>Profit Tier</span>
              </div>
              <div className="filter-options">
                {profitTierOptions.map(option => (
                  <label key={option.value} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.profitTier.includes(option.value)}
                      onChange={() => handleProfitTierChange(option.value)}
                    />
                    <span className="checkbox-custom" style={{ borderColor: option.color }}>
                      {filters.profitTier.includes(option.value) && (
                        <div className="checkbox-check" style={{ backgroundColor: option.color }}></div>
                      )}
                    </span>
                    <span className="filter-label">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdeaFilters;

