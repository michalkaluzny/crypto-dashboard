import { useState, useEffect } from 'react';
import { fetchNews } from '../api/client';
import NewsCard from './NewsCard';

// Helper do parsowania daty w formacie DD.MM.YYYY HH:MM:SS
function parseDate(dateStr) {
  const [datePart, timePart] = dateStr.split(' ');
  const [day, month, year] = datePart.split('.');
  const [hour, min, sec] = timePart.split(':');
  return new Date(year, month - 1, day, hour, min, sec);
}

function NewsList() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNews()
      .then((response) => {
        // Sortowanie po dacie (najnowsze pierwsze) - jak w Streamlit
        const sorted = [...response.data].sort((a, b) => {
          const dateA = parseDate(a.pub_date);
          const dateB = parseDate(b.pub_date);
          return dateB - dateA;
        });
        setNews(sorted);
        setError(null);
      })
      .catch((err) => {
        setError('Nie udało się pobrać wiadomości');
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="news-list">Ładowanie wiadomości...</div>;
  }

  if (error) {
    return <div className="news-list error">{error}</div>;
  }

  return (
    <div className="news-list">
      <h2 className="news-list-title">News</h2>
      <div className="news-scroll-box">
        {news.map((item, index) => (
          <NewsCard key={index} news={item} />
        ))}
      </div>
    </div>
  );
}

export default NewsList;

