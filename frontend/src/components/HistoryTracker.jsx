import { FiClock, FiTrash2, FiX } from 'react-icons/fi';

export default function HistoryTracker({ history, onSelect, onRemove, onClear }) {
  if (!history || history.length === 0) return null;

  return (
    <div className="recent-searches-box">
      <div className="recent-searches-title">
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <FiClock /> Recent Searches
        </span>
        <span className="clear-history-link" onClick={onClear} title="Clear search history">
          <FiTrash2 style={{ marginRight: '0.2rem' }} /> Clear history
        </span>
      </div>
      <div className="recent-chips-wrapper">
        {history.map((company, index) => (
          <div key={index} className="recent-chip" onClick={() => onSelect(company)}>
            <span>{company}</span>
            <button
              className="recent-chip-remove"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(company);
              }}
              title="Remove from history"
              type="button"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <FiX />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
