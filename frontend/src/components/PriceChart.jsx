import { useState, useEffect } from 'react';
import { fetchPriceHistory } from '../api/client';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Mapowanie period → interval (tak jak w Streamlit)
const PERIOD_CONFIG = {
  '1d': { interval: '1m', label: '1 day' },
  '5d': { interval: '15m', label: '5 days' },
  '1mo': { interval: '1h', label: '1 month' },
  '6mo': { interval: '1d', label: '6 months' },
  '1y': { interval: '1d', label: '1 year' },
  '5y': { interval: '1wk', label: '5 years' },
  '10y': { interval: '1mo', label: '10 years' },
  max: { interval: '1mo', label: 'all time' },
};

// Formatowanie daty zależne od okresu (dla osi X)
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

// Formatowanie daty dla tooltipa
function formatTooltipDate(dateStr, period) {
  const date = new Date(dateStr);

  // Dla 1d, 5d, 1mo, 6mo - pokazuj datę z godziną
  if (period === '1d' || period === '5d' || period === '1mo' || period === '6mo') {
    return date.toLocaleString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } else {
    // Dla 1y, 5y, 10y, max - tylko dzień, miesiąc, rok
    return date.toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
}


function PriceChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('1d');
  const [error, setError] = useState(null);

  // Funkcja do pobierania pełnych danych wykresu
  const loadChartData = () => {
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
  };

  // Funkcja do pobierania tylko najnowszego punktu
  const fetchLatestPoint = () => {
    const { interval } = PERIOD_CONFIG[period];
    fetchPriceHistory(period, interval)
      .then((response) => {
        const timestamps = response.data.timestamps;
        const prices = response.data.prices;
        if (!timestamps || !prices || timestamps.length === 0) return;
        const lastTimestamp = timestamps[timestamps.length - 1];
        const lastPrice = prices[prices.length - 1];
        // Jeśli nie ma jeszcze żadnych danych, nie rób nic
        if (data.length === 0) return;
        // Jeśli nowy punkt ma inny timestamp niż ostatni na wykresie, dodaj go
        if (lastTimestamp !== data[data.length - 1].date) {
          setData((prevData) => [
            ...prevData,
            { date: lastTimestamp, price: lastPrice },
          ]);
        }
      })
      .catch((err) => {
        // Nie pokazuj błędu na UI, bo to tylko dopytywanie
        console.error('Błąd przy dopytywaniu najnowszego punktu:', err);
      });
  };

  // Pobierz dane przy zmianie okresu
  useEffect(() => {
    loadChartData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  // Co 10 sekund dopytuj o najnowszy punkt i dorysuj, jeśli jest nowy
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchLatestPoint();
    }, 10000); // 10 sekund
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, data]);

  return (
    <div className="chart-container">

      {/* Wykres */}
      {error ? (
        <div className="chart-error">{error}</div>
      ) : loading ? (
        <div className="chart-loading">Ładowanie wykresu...</div>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4F8BF9" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#4F8BF9" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => formatDate(value, period)}
              interval="preserveStartEnd"
            />
            <YAxis
              orientation="right"
              domain={['auto', 'auto']}
              tickFormatter={(value) =>
                `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
              }
              width={80}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="chart-tooltip">
                      <p className="tooltip-price">{payload[0].value.toFixed(2)} USD</p>
                      <p className="tooltip-date">{formatTooltipDate(label, period)}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#4F8BF9"
              strokeWidth={2}
              fill="url(#blueGradient)"
              dot={(props) => {
                // Pokaż kropkę tylko na ostatnim punkcie (real-time)
                const { index, cx, cy, payload } = props;
                if (index === data.length - 1) {
                  const price = payload.price;
                  const priceText = `$${price.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
                  return (
                    <g key={`dot-${index}`}>
                      {/* Kropka */}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={6}
                        fill="#4F8BF9"
                        stroke="#fff"
                        strokeWidth={2}
                      />
                      {/* Kwadracik z ceną */}
                      <rect
                        x={cx + 10}
                        y={cy - 12}
                        width={70}
                        height={24}
                        rx={4}
                        fill="#4F8BF9"
                      />
                      <text
                        x={cx + 45}
                        y={cy + 4}
                        textAnchor="middle"
                        fill="#fff"
                        fontSize={12}
                        fontWeight="bold"
                      >
                        {priceText}
                      </text>
                    </g>
                  );
                }
                return null;
              }}
              activeDot={{ r: 6, fill: '#4F8BF9' }}
            />
          </AreaChart>
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

