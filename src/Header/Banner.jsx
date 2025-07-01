import React, { useEffect, useState } from "react";

function HeroBanner() {
  const [topMovies, setTopMovies] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    fetch("http://localhost:9999/moviesData")
      .then(res => res.json())
      .then(data => {
        const sorted = [...data].sort((a, b) => b.rating - a.rating).slice(0, 5);
        setTopMovies(sorted);
      });
  }, []);

  // Auto chuyển slide mỗi 5s
  useEffect(() => {
    if (topMovies.length === 0) return;
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % topMovies.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [topMovies]);

  if (!topMovies.length) return null;

  return (
    <div className="hero-banner">
      {topMovies.map((movie, idx) => (
        <div
          key={movie.id}
          className={`banner-slide ${idx === current ? "active" : ""}`}
          style={{
            display: idx === current ? "flex" : "none",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            background: `linear-gradient(135deg, rgba(0,0,0,0.5), rgba(50,50,50,0.1)), url(${movie.poster}) center/cover`
          }}
        >
          <div className="hero-content">
            <div style={{ fontSize: 20, fontWeight: 500, marginBottom: 8 }}>{movie.genre}</div>
            <h1>{movie.title}</h1>
            <p style={{ fontSize: 18 }}>{movie.description}</p>
            <div style={{ display: "flex", gap: 32, justifyContent: "center", margin: "10px 0" }}>
              <div>
                <div style={{ color: "#ffd93d", fontWeight: 500 }}>⭐ {movie.rating}</div>
                <div style={{ color: "#eee", fontSize: 13 }}>Đánh giá</div>
              </div>
              <div>
                <div style={{ fontWeight: 500 }}>{movie.duration}</div>
                <div style={{ color: "#eee", fontSize: 13 }}>Thời lượng</div>
              </div>
            </div>
            <div className="hero-buttons">
              <a href="#" className="btn-buy-ticket">ĐẶT VÉ NGAY</a>
              <a href="#" className="btn-trailer">XEM TRAILER</a>
            </div>
          </div>
        </div>
      ))}
      {/* Dots chuyển trang */}
      <div className="hero-pagination">
        {topMovies.map((_, idx) => (
          <div
            key={idx}
            className={`dot ${idx === current ? "active" : ""}`}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </div>
    </div>
  );
}

export default HeroBanner;
