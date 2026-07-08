import { useState, useEffect } from 'react';
import { FiSearch, FiTrendingUp, FiAlertCircle } from 'react-icons/fi';
import ThemeToggle from './components/ThemeToggle';
import HistoryTracker from './components/HistoryTracker';
import LoadingProgress from './components/LoadingProgress';
import ReportDashboard from './components/ReportDashboard';
import { analyzeCompany } from './services/api';

const DEFAULT_SUGGESTIONS = ['NVIDIA', 'Apple', 'Tesla', 'Microsoft'];

export default function App() {
  const [query, setQuery] = useState('');
  const [searchCompany, setSearchCompany] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Search history state persisted in localstorage
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('search_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('search_history', JSON.stringify(history));
  }, [history]);

  const handleSearch = async (companyName) => {
    if (!companyName || !companyName.trim()) return;
    
    const formattedQuery = companyName.trim();
    setSearchCompany(formattedQuery);
    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const data = await analyzeCompany(formattedQuery);
      setReport(data);
      
      // Update search history (deduplicate and add to front)
      setHistory((prev) => {
        const filtered = prev.filter((item) => item.toLowerCase() !== formattedQuery.toLowerCase());
        return [formattedQuery, ...filtered].slice(0, 8); // Keep last 8 searches
      });
    } catch (err) {
      console.error(err);
      setError({
        title: 'Analysis Failed',
        message: err.message || 'Could not connect to the investment backend. Make sure the server is running on port 5000 and dependencies are configured.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleRemoveHistory = (companyToRemove) => {
    setHistory((prev) => prev.filter((item) => item !== companyToRemove));
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <header className="app-header">
        <div className="logo-section">
          <FiTrendingUp className="logo-icon" />
          <span className="logo-text">InvestIQ Agent</span>
        </div>
        <div className="header-actions">
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
        
        {/* Error Alert Display */}
        {error && !loading && (
          <div className="error-alert">
            <FiAlertCircle className="error-alert-icon" />
            <div className="error-alert-content">
              <span className="error-alert-title">{error.title}</span>
              <span style={{ fontSize: '0.85rem', opacity: 0.9 }}>{error.message}</span>
            </div>
          </div>
        )}

        {loading ? (
          /* Loading Agent Screen */
          <LoadingProgress companyName={searchCompany} />
        ) : report ? (
          /* Detailed Report Dashboard */
          <ReportDashboard 
            report={report} 
            onBack={() => {
              setReport(null);
              setError(null);
            }} 
          />
        ) : (
          /* Landing Search Area */
          <div className="search-hero-section">
            <span className="hero-badge">Autonomous Market Intelligence</span>
            <h1>Analyze any stock with AI research agents</h1>
            <p>
              Get institutional-grade investment reports instantly. Our agent aggregates real-time financials, evaluates news sentiment, and uses Gemini AI to conduct SWOT analyses.
            </p>

            <form onSubmit={handleFormSubmit} className="search-form-container">
              <div className="search-input-wrapper">
                <FiSearch className="search-icon-left" />
                <input
                  type="text"
                  placeholder="Enter company or ticker (e.g. NVIDIA, Apple, TSLA)..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  disabled={loading}
                  required
                />
                <button className="search-button" type="submit" disabled={loading}>
                  Analyze
                </button>
              </div>
            </form>

            {/* Default Quick Suggestions */}
            <div className="search-suggestions">
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginRight: '0.25rem' }}>Try searching:</span>
              {DEFAULT_SUGGESTIONS.map((sug) => (
                <button
                  key={sug}
                  className="suggestion-chip"
                  type="button"
                  onClick={() => {
                    setQuery(sug);
                    handleSearch(sug);
                  }}
                >
                  {sug}
                </button>
              ))}
            </div>

            {/* Recent Searches history list */}
            <HistoryTracker
              history={history}
              onSelect={(comp) => {
                setQuery(comp);
                handleSearch(comp);
              }}
              onRemove={handleRemoveHistory}
              onClear={handleClearHistory}
            />
          </div>
        )}
      </main>
    </div>
  );
}
