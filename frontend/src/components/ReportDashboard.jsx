import { useState, useEffect } from 'react';
import { 
  FiArrowLeft, FiPrinter, FiTrendingUp, FiTrendingDown, 
  FiActivity, FiFileText, FiThumbsUp, 
  FiThumbsDown, FiAlertCircle, FiBriefcase,
  FiExternalLink, FiAlertTriangle
} from 'react-icons/fi';

const formatCurrency = (value, currency = 'USD') => {
  if (value === undefined || value === null) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 2
  }).format(value);
};

const formatMarketCap = (value, currency = 'USD') => {
  if (!value) return 'N/A';
  const symbol = currency === 'USD' ? '$' : '';
  if (value >= 1e12) {
    return `${symbol}${(value / 1e12).toFixed(2)} T`;
  } else if (value >= 1e9) {
    return `${symbol}${(value / 1e9).toFixed(2)} B`;
  } else if (value >= 1e6) {
    return `${symbol}${(value / 1e6).toFixed(2)} M`;
  }
  return `${symbol}${value.toLocaleString()}`;
};

export default function ReportDashboard({ report, onBack }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger progress bar animations after mount
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!report) return null;

  const {
    metadata = {},
    company = {},
    executiveSummary = {},
    investmentDecision = {},
    financialHealth = {},
    newsSentiment = {},
    strengths = [],
    weaknesses = [],
    risks = [],
    latestNews = []
  } = report;

  const rec = (investmentDecision.recommendation || 'HOLD').toUpperCase();
  const confidence = investmentDecision.confidence || 0;
  
  // Color configuration based on status
  let statusClass = 'hold';
  let statusColor = 'var(--color-hold)';
  if (rec === 'INVEST' || rec === 'BUY') {
    statusClass = 'invest';
    statusColor = 'var(--color-invest)';
  } else if (rec === 'PASS' || rec === 'SELL') {
    statusClass = 'pass';
    statusColor = 'var(--color-pass)';
  }

  // Calculate SVG circular stroke properties
  const radius = 60;
  const circumference = 2 * Math.PI * radius; // ~377
  const strokeDashoffset = animate ? circumference - (circumference * confidence) / 100 : circumference;

  // Calculate 52 week price positioning
  const low = financialHealth.fiftyTwoWeekLow || 0;
  const high = financialHealth.fiftyTwoWeekHigh || 0;
  const current = financialHealth.currentPrice || 0;
  let rangePercent = 0;
  if (high > low) {
    rangePercent = Math.min(Math.max(((current - low) / (high - low)) * 100, 0), 100);
  }

  return (
    <div style={{ width: '100%' }}>
      {/* Header / Actions */}
      <div className="back-btn-wrapper">
        <button className="btn" onClick={onBack} type="button">
          <FiArrowLeft /> Back to Dashboard
        </button>
        <button className="btn btn-primary" onClick={() => window.print()} type="button">
          <FiPrinter /> Print Report
        </button>
      </div>

      {/* Company Overview Block */}
      <div className="glass-card" style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 800 }}>{company.name || 'Company Name'}</h1>
              <span className="hero-badge" style={{ animation: 'none', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.2rem 0.6rem' }}>
                {company.symbol || 'SYMBOL'}
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '0.95rem' }}>
              {company.sector || 'Sector'} &bull; {company.industry || 'Industry'}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {formatCurrency(financialHealth.currentPrice, financialHealth.currency)}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Listed on {financialHealth.exchange || 'Exchange'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="dashboard-grid">
        
        {/* Investment Decision Card */}
        <div className="col-4 glass-card decision-card">
          <div className="section-header">
            <FiActivity /> Decision Summary
          </div>
          
          <div style={{ margin: '1rem 0' }}>
            <div className={`decision-badge ${statusClass}`}>
              {rec === 'INVEST' ? 'INVEST' : rec === 'PASS' ? 'PASS' : 'HOLD'}
            </div>
          </div>

          <div className="score-circle-wrapper">
            <svg className="score-circle-svg">
              <circle className="score-circle-bg" cx="70" cy="70" r={radius} />
              <circle 
                className="score-circle-fill" 
                cx="70" 
                cy="70" 
                r={radius} 
                stroke={statusColor}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            <div className="score-circle-text">
              <span className="score-number">{confidence}%</span>
              <span className="score-label">Confidence</span>
            </div>
          </div>

          <div className="sub-scores-list">
            <div className="sub-score-item">
              <div className="sub-score-info">
                <span>Financial Score</span>
                <span>{investmentDecision.financialScore || 50}/100</span>
              </div>
              <div className="sub-score-bar-bg">
                <div 
                  className="sub-score-bar-fill" 
                  style={{ width: animate ? `${investmentDecision.financialScore || 50}%` : '0%', background: 'var(--color-invest)' }}
                ></div>
              </div>
            </div>

            <div className="sub-score-item">
              <div className="sub-score-info">
                <span>Gemini Analysis Score</span>
                <span>{investmentDecision.aiScore || 50}/100</span>
              </div>
              <div className="sub-score-bar-bg">
                <div 
                  className="sub-score-bar-fill" 
                  style={{ width: animate ? `${investmentDecision.aiScore || 50}%` : '0%', background: 'var(--color-accent)' }}
                ></div>
              </div>
            </div>

            <div className="sub-score-item">
              <div className="sub-score-info">
                <span>News Sentiment Score</span>
                <span>{investmentDecision.newsScore || 50}/100</span>
              </div>
              <div className="sub-score-bar-bg">
                <div 
                  className="sub-score-bar-fill" 
                  style={{ width: animate ? `${investmentDecision.newsScore || 50}%` : '0%', background: 'var(--color-hold)' }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Metrics Card */}
        <div className="col-8 glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
          <div className="section-header">
            <FiBriefcase /> Financial Health
          </div>
          
          <div className="financial-health-metrics">
            <div className="metric-box">
              <div className="metric-label">Market Capitalization</div>
              <div className="metric-value">{formatMarketCap(financialHealth.marketCap, financialHealth.currency)}</div>
            </div>
            <div className="metric-box">
              <div className="metric-label">Current Stock Price</div>
              <div className="metric-value">{formatCurrency(financialHealth.currentPrice, financialHealth.currency)}</div>
            </div>
            <div className="metric-box">
              <div className="metric-label">Exchange Base</div>
              <div className="metric-value" style={{ fontSize: '0.95rem', textTransform: 'uppercase' }}>{financialHealth.exchange || 'N/A'}</div>
            </div>
          </div>

          {/* 52-Week Range Bar */}
          <div style={{ marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              <span>52-Week Range</span>
              <span>Position: {rangePercent.toFixed(0)}%</span>
            </div>
            
            <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '9999px', position: 'relative', overflow: 'visible' }}>
              {/* Scale Background for light mode */}
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.05)', borderRadius: '9999px', display: 'none' }} className="light-theme-bg"></div>
              
              {/* Highlight Fill */}
              <div 
                style={{ 
                  height: '100%', 
                  background: 'var(--color-accent-gradient)', 
                  borderRadius: '9999px',
                  width: `${rangePercent}%`,
                  transition: 'width 1.5s ease-out'
                }}
              ></div>

              {/* Indicator Dot */}
              <div 
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: `${rangePercent}%`,
                  transform: 'translate(-50%, -50%)',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  border: '3px solid var(--color-accent)',
                  boxShadow: '0 0 8px rgba(0,0,0,0.5)',
                  transition: 'left 1.5s ease-out'
                }}
              ></div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
              <span>Low: {formatCurrency(financialHealth.fiftyTwoWeekLow, financialHealth.currency)}</span>
              <span>Current: {formatCurrency(financialHealth.currentPrice, financialHealth.currency)}</span>
              <span>High: {formatCurrency(financialHealth.fiftyTwoWeekHigh, financialHealth.currency)}</span>
            </div>
          </div>

          <div style={{ marginTop: 'auto', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border-color)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <strong>Analyst Note:</strong> The score calculation weighs basic financials (50%), automated news sentiment analysis (20%), and deep generative LLM business model assessments (30%) to evaluate this risk rating.
          </div>
        </div>

        {/* Executive Summary & Future Outlook */}
        <div className="col-8 glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
          <div className="section-header">
            <FiFileText /> Executive Summary & Future Outlook
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Overview</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: '1.6' }}>
              {executiveSummary.summary || 'Summary not generated.'}
            </p>
          </div>
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Future Outlook</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: '1.6' }}>
              {executiveSummary.futureOutlook || 'Outlook details not generated.'}
            </p>
          </div>
        </div>

        {/* News Sentiment Card */}
        <div className="col-4 glass-card" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="section-header">
            <FiThumbsUp /> Sentiment Analysis
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Overall Sentiment</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {newsSentiment.overall || 'Neutral'}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Sentiment Score</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {newsSentiment.score || 50}%
              </div>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {newsSentiment.summary || 'Sentiment analysis summary not generated.'}
          </div>

          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Key Market Insights:</div>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {(newsSentiment.keyInsights || []).map((insight, idx) => (
                <li key={idx}>{insight}</li>
              ))}
              {(!newsSentiment.keyInsights || newsSentiment.keyInsights.length === 0) && (
                <li>No insights generated.</li>
              )}
            </ul>
          </div>
        </div>

        {/* SWOT (Strengths, Weaknesses, Risks) Columns */}
        <div className="col-4 glass-card strengths-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="section-header" style={{ borderColor: 'var(--color-invest-border)' }}>
            <FiThumbsUp style={{ color: 'var(--color-invest)' }} /> Strengths
          </div>
          <ul className="swot-list">
            {strengths.map((str, idx) => (
              <li className="swot-item" key={idx}>
                <FiThumbsUp className="swot-icon" />
                <span>{str}</span>
              </li>
            ))}
            {strengths.length === 0 && <li className="swot-item">No strengths noted.</li>}
          </ul>
        </div>

        <div className="col-4 glass-card weaknesses-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="section-header" style={{ borderColor: 'var(--color-hold-border)' }}>
            <FiThumbsDown style={{ color: 'var(--color-hold)' }} /> Weaknesses
          </div>
          <ul className="swot-list">
            {weaknesses.map((weak, idx) => (
              <li className="swot-item" key={idx}>
                <FiThumbsDown className="swot-icon" />
                <span>{weak}</span>
              </li>
            ))}
            {weaknesses.length === 0 && <li className="swot-item">No weaknesses noted.</li>}
          </ul>
        </div>

        <div className="col-4 glass-card risks-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="section-header" style={{ borderColor: 'var(--color-pass-border)' }}>
            <FiAlertTriangle style={{ color: 'var(--color-pass)' }} /> Risks & Threats
          </div>
          <ul className="swot-list">
            {risks.map((risk, idx) => (
              <li className="swot-item" key={idx}>
                <FiAlertCircle className="swot-icon" />
                <span>{risk}</span>
              </li>
            ))}
            {risks.length === 0 && <li className="swot-item">No major risks noted.</li>}
          </ul>
        </div>

        {/* Latest News Articles Feed */}
        <div className="col-12 glass-card">
          <div className="section-header">
            <FiFileText /> Raw News Articles Used in Analysis
          </div>
          
          <div className="news-grid">
            {latestNews.map((article, idx) => (
              <div className="news-card" key={idx}>
                <div className="news-meta">
                  <span>Source: {article.source || 'Unknown'}</span>
                  {article.publishedAt && (
                    <span>Published: {new Date(article.publishedAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}</span>
                  )}
                </div>
                <div className="news-title">{article.title}</div>
                {article.description && <div className="news-desc">{article.description}</div>}
                {article.url && (
                  <a 
                    href={article.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    style={{ fontSize: '0.8rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem', alignSelf: 'flex-start' }}
                  >
                    Read full article <FiExternalLink />
                  </a>
                )}
              </div>
            ))}
            {latestNews.length === 0 && (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>
                No news articles gathered.
              </p>
            )}
          </div>
        </div>

        {/* Report Metadata */}
        <div className="col-12" style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '1rem', padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
          Generated At: {metadata.generatedAt ? new Date(metadata.generatedAt).toLocaleString() : 'N/A'} &bull; 
          Agent Brain Model: {metadata.model || 'Gemini'} &bull; 
          Report Schema Version: {metadata.version || '1.0.0'} &bull; 
          Processing Latency: {metadata.processingTime || 'N/A'}
        </div>

      </div>
    </div>
  );
}
