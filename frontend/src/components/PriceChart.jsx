import { useState, useEffect, useRef } from 'react';
import { fetchPriceHistory } from '../api/client';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

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

function formatTooltipDate(dateStr, period) {
  const date = new Date(dateStr);

  if (period === '1d' || period === '5d' || period === '1mo' || period === '6mo') {
    return date.toLocaleString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } else {
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

  // Holds the latest data without forcing the polling effect to re-run.
  const dataRef = useRef(data);
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

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
        setError('Failed to retrieve price history');
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  const fetchLatestPoint = () => {
    const { interval } = PERIOD_CONFIG[period];
    fetchPriceHistory(period, interval)
      .then((response) => {
        const timestamps = response.data.timestamps;
        const prices = response.data.prices;
        if (!timestamps || !prices || timestamps.length === 0) return;
        const lastTimestamp = timestamps[timestamps.length - 1];
        const lastPrice = prices[prices.length - 1];
        const currentData = dataRef.current;
        if (currentData.length === 0) return;
        if (lastTimestamp !== currentData[currentData.length - 1].date) {
          setData((prevData) => [
            ...prevData,
            { date: lastTimestamp, price: lastPrice },
          ]);
        }
      })
      .catch((err) => {
        console.error('Error while querying the newest point', err);
      });
  };

  useEffect(() => {
    loadChartData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  // Every 10s poll for the newest point and append it if it's new.
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchLatestPoint();
    }, 10000);
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  return (
    <div className="chart-container">

      {/* Chart */}
      {error ? (
        <div className="chart-error">{error}</div>
      ) : loading ? (
        <div className="chart-loading">Chart loading...</div>
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
                      {/* square with price */}
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

      {/* choose buttons (under the chart)*/}
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

