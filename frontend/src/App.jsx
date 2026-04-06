import './App.css';
import PriceCard from './components/PriceCard';
import NewsList from './components/NewsList';
import PriceChart from './components/PriceChart';

function App() {
  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Bitcoin RAG Dashboard</h1>
      <h2 className="dashboard-subtitle">
        Bitcoin news and currency analysis panel
      </h2>

      <div className="layout">
        <div className="left-column">
          <PriceCard />
          <PriceChart />
        </div>
        <div className="right-column">
          <NewsList />
        </div>
      </div>
    </div>
  );
}

export default App;
