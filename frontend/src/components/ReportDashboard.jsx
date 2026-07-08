import { useState, useEffect } from 'react';
import { 
  FiArrowLeft, FiPrinter, FiActivity, FiFileText, 
  FiThumbsUp, FiThumbsDown, FiAlertCircle, 
  FiBriefcase, FiExternalLink, FiAlertTriangle
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
  
  // Local score calculations (matching the backend score engine formula)
  let localFinancialScore = 50;
  const mcap = financialHealth.marketCap || 0;
  if (mcap > 1e12) localFinancialScore += 20;
  else if (mcap > 5e11) localFinancialScore += 15;
  else if (mcap > 1e11) localFinancialScore += 10;

  const price = financialHealth.currentPrice || 0;
  if (price > 200) localFinancialScore += 10;
  else if (price > 100) localFinancialScore += 5;
  localFinancialScore = Math.min(localFinancialScore, 100);

  const localNewsScore = newsSentiment.score || 50;

  // Reverse calculate the AI score: finalScore = round(fin*0.5 + ai*0.3 + news*0.2)
  let localAiScore = 50;
  if (confidence) {
    const rawAiScore = (confidence - (localFinancialScore * 0.5) - (localNewsScore * 0.2)) / 0.3;
    localAiScore = Math.min(Math.max(Math.round(rawAiScore), 0), 100);
  }

  // Color config
  let statusClass = 'hold';
  let statusColor = 'var(--color-hold)';
  if (rec === 'INVEST' || rec === 'BUY') {
    statusClass = 'invest';
    statusColor = 'var(--color-invest)';
  } else if (rec === 'PASS' || rec === 'SELL') {
    statusClass = 'pass';
    statusColor = 'var(--color-pass)';
  }

  const radius = 50;
  const circumference = 2 * Math.PI * radius; // ~314
  const strokeDashoffset = animate ? circumference - (circumference * confidence) / 100 : circumference;

  const low = financialHealth.fiftyTwoWeekLow || 0;
  const high = financialHealth.fiftyTwoWeekHigh || 0;
  let rangePercent = 0;
  if (high > low) {
    rangePercent = Math.min(Math.max(((price - low) / (high - low)) * 100, 0), 100);
  }

  return (
    <div style={{ width: '100%' }}>
      {/* Action bar */}
      <div className="back-btn-wrapper">
        <button className="btn" onClick={onBack} type="button">
          <FiArrowLeft /> Back to Search
        </button>
        <button className="btn btn-primary" onClick={() => window.print()} type="button">
          <FiPrinter /> Export PDF / Print
        </button>
      </div>

      {/* Header Info */}
      <div className="glass-card" style={{ marginBottom: '1.25rem', textAlign: 'left', borderRadius: 'var(--radius-md)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {company.name || 'Company Name'}
              </h1>
              <span className="hero-badge" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>
                {company.symbol || 'SYMBOL'}
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.15rem' }}>
              {company.sector} &bull; {company.industry}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {formatCurrency(price, financialHealth.currency)}
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Market currency: {financialHealth.currency || 'USD'} | exchange: {financialHealth.exchange || 'Exchange'}
            </p>
          </div>
        </div>
      </div>

      {/* Grid container */}
      <div className="dashboard-grid">
        
        {/* Recommendation Scorecard */}
        <div className="col-4 glass-card decision-card">
          <div className="section-header">
            <FiActivity /> Investment Scorecard
          </div>
          
          <div>
            <div className={`decision-badge ${statusClass}`}>
              {rec === 'INVEST' ? 'BUY / INVEST' : rec === 'PASS' ? 'SELL / PASS' : 'HOLD'}
            </div>
          </div>

          <div className="score-circle-wrapper">
            <svg className="score-circle-svg">
              <circle className="score-circle-bg" cx="60" cy="60" r={radius} />
              <circle 
                className="score-circle-fill" 
                cx="60" 
                cy="60" 
                r={radius} 
                stroke={statusColor}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            <div className="score-circle-text">
              <span className="score-number">{confidence}%</span>
              <span className="score-label">Final Rating</span>
            </div>
          </div>

          <div className="sub-scores-list">
            <div className="sub-score-item">
              <div className="sub-score-info">
                <span>Financial Score</span>
                <span>{localFinancialScore}/100</span>
              </div>
              <div className="sub-score-bar-bg">
                <div 
                  className="sub-score-bar-fill" 
                  style={{ width: animate ? `${localFinancialScore}%` : '0%', background: 'var(--color-accent)' }}
                ></div>
              </div>
            </div>

            <div className="sub-score-item">
              <div className="sub-score-info">
                <span>AI Confidence Score</span>
                <span>{localAiScore}/100</span>
              </div>
              <div className="sub-score-bar-bg">
                <div 
                  className="sub-score-bar-fill" 
                  style={{ width: animate ? `${localAiScore}%` : '0%', background: 'var(--color-accent)' }}
                ></div>
              </div>
            </div>

            <div className="sub-score-item">
              <div className="sub-score-info">
                <span>News Sentiment Score</span>
                <span>{localNewsScore}/100</span>
              </div>
              <div className="sub-score-bar-bg">
                <div 
                  className="sub-score-bar-fill" 
                  style={{ width: animate ? `${localNewsScore}%` : '0%', background: 'var(--color-accent)' }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Metrics */}
        <div className="col-8 glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
          <div className="section-header">
            <FiBriefcase /> Key Valuation Indicators
          </div>
          
          <div className="financial-health-metrics">
            <div className="metric-box">
              <div className="metric-label">Market Capitalization</div>
              <div className="metric-value">{formatMarketCap(financialHealth.marketCap, financialHealth.currency)}</div>
            </div>
            <div className="metric-box">
              <div className="metric-label">Current Stock Price</div>
              <div className="metric-value">{formatCurrency(price, financialHealth.currency)}</div>
            </div>
            <div className="metric-box">
              <div className="metric-label">Market Exchange</div>
              <div className="metric-value" style={{ fontSize: '0.85rem' }}>{financialHealth.exchange || 'N/A'}</div>
            </div>
          </div>

          {/* Range Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              <span>52-Week Trading Range</span>
              <span>Relative Position: {rangePercent.toFixed(0)}%</span>
            </div>
            
            <div style={{ height: '6px', background: 'var(--bg-tertiary)', borderRadius: '9999px', position: 'relative' }}>
              <div 
                style={{ 
                  height: '100%', 
                  background: 'var(--color-accent)', 
                  borderRadius: '9999px',
                  width: `${rangePercent}%`,
                  transition: 'width 1s ease-out'
                }}
              ></div>
              <div 
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: `${rangePercent}%`,
                  transform: 'translate(-50%, -50%)',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '2px solid var(--color-accent)',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'left 1s ease-out'
                }}
              ></div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              <span>Low: {formatCurrency(low, financialHealth.currency)}</span>
              <span>Price: {formatCurrency(price, financialHealth.currency)}</span>
              <span>High: {formatCurrency(high, financialHealth.currency)}</span>
            </div>
          </div>

          <div style={{ marginTop: 'auto', background: 'var(--bg-primary)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <strong>Assessment Methodology:</strong> Our analysis aggregates direct ticker pricing (50% weight), natural language sentiment tracking of public articles (20% weight), and specialized semantic evaluations of the firm's outlook (30% weight).
          </div>
        </div>

        {/* SWOT Blocks */}
        <div className="col-4 glass-card strengths-card">
          <div className="section-header" style={{ borderColor: 'var(--color-invest)' }}>
            <FiThumbsUp style={{ color: 'var(--color-invest)' }} /> Strengths
          </div>
          <ul className="swot-list">
            {strengths.map((str, idx) => (
              <li className="swot-item" key={idx}>
                <FiThumbsUp className="swot-icon" style={{ marginTop: '0.15rem' }} />
                <span>{str}</span>
              </li>
            ))}
            {strengths.length === 0 && <li className="swot-item">No major strengths noted.</li>}
          </ul>
        </div>

        <div className="col-4 glass-card weaknesses-card">
          <div className="section-header" style={{ borderColor: 'var(--color-hold)' }}>
            <FiThumbsDown style={{ color: 'var(--color-hold)' }} /> Weaknesses
          </div>
          <ul className="swot-list">
            {weaknesses.map((weak, idx) => (
              <li className="swot-item" key={idx}>
                <FiThumbsDown className="swot-icon" style={{ marginTop: '0.15rem' }} />
                <span>{weak}</span>
              </li>
            ))}
            {weaknesses.length === 0 && <li className="swot-item">No major weaknesses noted.</li>}
          </ul>
        </div>

        <div className="col-4 glass-card risks-card">
          <div className="section-header" style={{ borderColor: 'var(--color-pass)' }}>
            <FiAlertTriangle style={{ color: 'var(--color-pass)' }} /> Risks & Threats
          </div>
          <ul className="swot-list">
            {risks.map((risk, idx) => (
              <li className="swot-item" key={idx}>
                <FiAlertCircle className="swot-icon" style={{ marginTop: '0.15rem' }} />
                <span>{risk}</span>
              </li>
            ))}
            {risks.length === 0 && <li className="swot-item">No major risks noted.</li>}
          </ul>
        </div>

        {/* Executive Summary */}
        <div className="col-8 glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
          <div className="section-header">
            <FiFileText /> Executive Summary & Future Outlook
          </div>
          <div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-primary)' }}>Overview</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
              {executiveSummary.summary || 'Summary details unavailable.'}
            </p>
          </div>
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-primary)' }}>Future Outlook</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
              {executiveSummary.futureOutlook || 'Outlook details unavailable.'}
            </p>
          </div>
        </div>

        {/* Public Media Sentiment */}
        <div className="col-4 glass-card" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="section-header">
            <FiThumbsUp /> Media Sentiment
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Overall Tone</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {newsSentiment.overall || 'Neutral'}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Sentiment score</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {newsSentiment.score || 50}%
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--bg-primary)', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {newsSentiment.summary || 'Summary unavailable.'}
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-primary)' }}>Key Market Highlights:</div>
            <ul style={{ paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {(newsSentiment.keyInsights || []).map((insight, idx) => (
                <li key={idx}>{insight}</li>
              ))}
              {(!newsSentiment.keyInsights || newsSentiment.keyInsights.length === 0) && (
                <li>No insights generated.</li>
              )}
            </ul>
          </div>
        </div>

        {/* News Feed */}
        <div className="col-12 glass-card">
          <div className="section-header">
            <FiFileText /> Referenced Public Articles
          </div>
          
          <div className="news-grid">
            {latestNews.map((article, idx) => (
              <div className="news-card" key={idx}>
                <div className="news-meta">
                  <span>Source: {article.source}</span>
                  {article.publishedAt && (
                    <span>Published: {new Date(article.publishedAt).toLocaleDateString()}</span>
                  )}
                </div>
                <div className="news-title">{article.title}</div>
                {article.description && <div className="news-desc">{article.description}</div>}
                {article.url && (
                  <a 
                    href={article.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    style={{ fontSize: '0.75rem', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '0.2rem', alignSelf: 'flex-start' }}
                  >
                    Read source publication <FiExternalLink />
                  </a>
                )}
              </div>
            ))}
            {latestNews.length === 0 && (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '1.5rem', fontSize: '0.85rem' }}>
                No news articles collected.
              </p>
            )}
          </div>
        </div>

        {/* Metadata */}
        <div className="col-12" style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.7rem', padding: '0.75rem 0', borderTop: '1px solid var(--border-color)', marginTop: '0.75rem' }}>
          Prepared At: {metadata.generatedAt ? new Date(metadata.generatedAt).toLocaleString() : 'N/A'} &bull; 
          Agent Brain Model: {metadata.model || 'Gemini'} &bull; 
          Report Version: {metadata.version || '1.0.0'} &bull; 
          Latency: {metadata.processingTime || 'N/A'}
        </div>

      </div>
    </div>
  );
}
