import { useState } from 'react';
import './App.css';
import PriceCard from './components/PriceCard';
import NewsList from './components/NewsList';
import PriceChart from './components/PriceChart';

function App() {
  const [activeTab, setActiveTab] = useState('chart');

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Bitcoin RAG Dashboard</h1>
      <h2 className="dashboard-subtitle">
        Bitcoin news and currency analysis panel
      </h2>

      {/* Nawigacja */}
      <nav className="tabs">
        <button
          className={`tab-btn ${activeTab === 'chart' ? 'active' : ''}`}
          onClick={() => setActiveTab('chart')}
        >
          📈 Chart
        </button>
        <button
          className={`tab-btn ${activeTab === 'news' ? 'active' : ''}`}
          onClick={() => setActiveTab('news')}
        >
          📰 News
        </button>
      </nav>

      {/* Sekcje */}
      <div className="section">
        <PriceCard />

        <div className="section-content">
          {activeTab === 'chart' && <PriceChart />}
          {activeTab === 'news' && <NewsList />}
        </div>
      </div>
    </div>
  );
}

export default App;
