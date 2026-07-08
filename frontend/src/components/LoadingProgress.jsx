import { useState, useEffect } from 'react';

const STEPS = [
  "Connecting to Market Data pipelines...",
  "Fetching stock quotes & financials...",
  "Gathering latest company news...",
  "Performing Gemini AI analysis...",
  "Running risk assessment & score engine...",
  "Assembling final investment report..."
];

export default function LoadingProgress({ companyName }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-container glass-card">
      <div className="loading-spinner-wrapper">
        <div className="outer-spinner"></div>
        <div className="inner-spinner"></div>
      </div>
      <div>
        <h2 style={{ marginBottom: '0.5rem' }}>Analyzing {companyName}</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Our AI Investment Research Agent is fetching and analyzing real-time data.
        </p>
      </div>
      <ul className="loading-steps">
        {STEPS.map((step, idx) => {
          let statusClass = "pending";
          if (idx < currentStep) statusClass = "completed";
          else if (idx === currentStep) statusClass = "active";

          return (
            <li key={idx} className={`loading-step-item ${statusClass}`}>
              <div className="step-indicator-dot"></div>
              <span>{step}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
