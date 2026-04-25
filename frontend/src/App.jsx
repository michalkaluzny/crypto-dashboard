import { useState } from 'react';
import './App.css';
import PriceCard from './components/PriceCard';
import NewsList from './components/NewsList';
import PriceChart from './components/PriceChart';
import Chatbot from './components/Chatbot';

function App() {
  const [activeTab, setActiveTab] = useState('chart');

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Crypto Dashboard</h1>
      <h2 className="dashboard-subtitle">
        Crypto news and currency analysis panel
      </h2>

      {/* Navigation */}
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
        <button
          className={`tab-btn ${activeTab === 'chatbot' ? 'active' : ''}`}
          onClick={() => setActiveTab('chatbot')}
        >
          🤖 Chatbot
        </button>
      </nav>

      {/* Sections */}
      <div className="section">
        <PriceCard />

        <div className="section-content">
          {activeTab === 'chart' && <PriceChart />}
          {activeTab === 'news' && <NewsList />}
          {activeTab === 'chatbot' && <Chatbot />}
        </div>
      </div>
    </div>
  );
}

export default App;
