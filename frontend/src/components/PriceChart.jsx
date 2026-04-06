import { useState, useEffect } from 'react';
import { fetchPriceHistory } from '../api/client';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Mapowanie period → interval (tak jak w Streamlit)
const PERIOD_CONFIG = {
  '1d': { interval: '1m', label: '1 day' },
  '5d': { interval: '1m', label: '5 days' },
  '1mo': { interval: '15m', label: '1 month' },
  '6mo': { interval: '1h', label: '6 months' },
  '1y': { interval: '1d', label: '1 year' },
  '5y': { interval: '1wk', label: '5 years' },
  '10y': { interval: '1mo', label: '10 years' },
  max: { interval: '1mo', label: 'all time' },
};

// Formatowanie daty zależne od okresu
function formatDate(dateStr, period) {
  const date = new Date(dateStr);

  if (period === '1d' || period === '5d') {
    return date.toLocaleTimeString('pl-PL', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } else if (period === '1mo' || period === '6mo') {
    return date.toLocaleDateString('pl-PL', { day: '2-digit', month: 'short' });
  } else {
    return date.toLocaleDateString('pl-PL', { month: 'short', year: '2-digit' });
  }
}

function PriceChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('1d');
  const [error, setError] = useState(null);

  // Pobierz dane gdy zmieni się okres
  useEffect(() => {
    setLoading(true);
    const { interval } = PERIOD_CONFIG[period];

    fetchPriceHistory(period, interval)
      .then((response) => {
        const chartData = response.data.timestamps.map((timestamp, index) => ({
          date: timestamp,
          price: response.data.prices[index],
        }));
        setData(chartData);
        setError(null);
      })
      .catch((err) => {
        setError('Nie udało się pobrać historii cen');
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [period]);

  return (
    <div className="chart-container">

      {/* Wykres */}
      {error ? (
        <div className="chart-error">{error}</div>
      ) : loading ? (
        <div className="chart-loading">Ładowanie wykresu...</div>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => formatDate(value, period)}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={['auto', 'auto']}
              tickFormatter={(value) =>
                `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
              }
              width={80}
            />
            <Tooltip
              formatter={(value) => [`${value.toFixed(2)} USD`, 'Cena']}
              labelFormatter={(label) => `Data: ${label}`}
              contentStyle={{
                background: '#fff',
                border: '1px solid #4F8BF9',
                borderRadius: '8px',
              }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#4F8BF9"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: '#4F8BF9' }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}

      {/* Przyciski wyboru okresu - pod wykresem */}
      <div className="period-selector">
        {Object.entries(PERIOD_CONFIG).map(([key, config]) => (
          <button
            key={key}
            className={`period-btn ${period === key ? 'active' : ''}`}
            onClick={() => setPeriod(key)}
          >
            {config.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default PriceChart;

