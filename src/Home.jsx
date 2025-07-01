import React, { useEffect, useState } from "react";
import HeroBanner from "./Banner";
import Header from "./Header/Header";
const TABS = [
  { key: "showing", label: "Đang chiếu" },
  { key: "upcoming", label: "Sắp chiếu" },
  { key: "imax", label: "Phim IMAX" },
  { key: "nationwide", label: "Toàn quốc" }
];

function Home() {
  const [movies, setMovies] = useState([]);
  const [tab, setTab] = useState("showing");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:9999/moviesData")
      .then(res => res.json())
      .then(data => {
        setMovies(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Phân loại phim theo tab (giả lập, bạn phân loại thật bằng trường trong DB)
  const filteredMovies = movies.filter(movie => {
    if (tab === "showing") {
      // Phim có lịch chiếu <= hôm nay
      const today = new Date();
      return movie.showtimes?.some(show =>
        new Date(show.date) <= today
      );
    }
    if (tab === "upcoming") {
      // Phim có lịch chiếu > hôm nay
      const today = new Date();
      return movie.showtimes?.some(show =>
        new Date(show.date) > today
      );
    }
    if (tab === "imax") {
      // Phim có rating >= 8.5 tạm coi là IMAX
      return movie.rating >= 8.5;
    }
    if (tab === "nationwide") {
      return true;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải phim...</p>
      </div>
    );
  }

  return (
    <div className="galaxy-cinema">
      <Header/>
      {/* HEADER GIỮ HOẶC BỎ TÙY Ý */}
      <HeroBanner />
      {/* Movie Tabs */}
      <div className="container">
        <div className="movie-section">
          <div className="section-header">
            <h2>PHIM</h2>
            <div className="tab-navigation">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  className={`tab-btn ${tab === t.key ? "active" : ""}`}
                  onClick={() => setTab(t.key)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Movie Grid */}
          <div className="movie-grid">
            {filteredMovies.map((movie) => (
              <div className="movie-card" key={movie.id}>
                <div className="movie-poster-container">
                  <img src={movie.poster} className="movie-poster" alt={movie.title} />
                  <div className="movie-badges">
                    {/* Nếu rating >= 8.5 là HOT, nếu sắp chiếu thì NEW */}
                    {movie.rating >= 8.5 && <span className="badge badge-hot">HOT</span>}
                    {movie.showtimes?.some(show => new Date(show.date) > new Date()) && (
                      <span className="badge badge-new">NEW</span>
                    )}
                  </div>
                  <div className="movie-rating">
                    <span className="rating-star">★</span>
                    <span className="rating-score">{movie.rating}</span>
                  </div>
                  <div className="movie-overlay">
                    <button className="btn-play">▶</button>
                    <button className="btn-buy">Mua vé</button>
                  </div>
                </div>
                <div className="movie-info">
                  <h3 className="movie-title">{movie.title}</h3>
                  <p>{movie.genre}</p>
                  <p>{movie.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
