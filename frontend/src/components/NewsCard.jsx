function NewsCard({ news }) {
  return (
    <div className="news-card">
      <div className="news-header">
        <a
          href={news.url}
          target="_blank"
          rel="noopener noreferrer"
          className="news-title"
        >
          {news.title}
        </a>
        <span className="news-date">{news.pub_date}</span>
      </div>
      <p className="news-summary">{news.summary}</p>
    </div>
  );
}

export default NewsCard;

