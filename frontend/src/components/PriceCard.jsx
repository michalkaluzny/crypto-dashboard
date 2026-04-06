import { useState, useEffect } from 'react';
import { fetchPrice } from '../api/client';

function PriceCard() {
  const [priceData, setPriceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPrice = async () => {
      try {
        const response = await fetchPrice();
        setPriceData(response.data);
        setError(null);
      } catch (err) {
        setError('Nie udało się pobrać ceny');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPrice();

    // Odświeżanie co 60 sekund
    const interval = setInterval(loadPrice, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="price-card">Ładowanie...</div>;
  }

  if (error) {
    return <div className="price-card error">{error}</div>;
  }

  const isPositive = priceData.diff >= 0;
  const diffColor = isPositive ? '#22c55e' : '#ef4444';
  const diffSign = isPositive ? '+' : '';

  return (
    <div className="price-card">
      <div className="price-header">
        <img
          src="https://assets.coingecko.com/coins/images/1/large/bitcoin.png"
          alt="Bitcoin logo"
          className="btc-logo"
        />
        <div className="price-info">
          <h2 className="price-label">Price:</h2>
          <p className="price-value">
            {priceData.price.toLocaleString('en-US', { maximumFractionDigits: 0 })} USD
          </p>
        </div>
      </div>
      <p className="price-diff" style={{ color: diffColor }}>
        difference: {diffSign}{priceData.diff.toFixed(0)} USD
      </p>
      <p className="price-percent" style={{ color: diffColor }}>
        difference in %: {diffSign}{priceData.percentage_diff.toFixed(2)}%
      </p>
    </div>
  );
}

export default PriceCard;
