import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeroBanner from "./Banner";
import Header from "./Header/Header";
import { Link } from "react-router-dom";
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
  const navigate = useNavigate();
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState("");

 useEffect(() => {
  fetch("http://localhost:9999/moviesData")
    .then(res => res.json())
    .then(data => {
      console.log(data);
      setMovies(data); 
      setLoading(false);
    })
    .catch(() => {
      setMovies([]); 
      setLoading(false);
    });
}, []);

  const filteredMovies = movies.filter(movie => {
    if (tab === "showing") {
      const today = new Date();
      return movie.showtimes?.some(show =>
        new Date(show.date) <= today
      );
    }
    if (tab === "upcoming") {
      const today = new Date();
      return movie.showtimes?.some(show =>
        new Date(show.date) > today
      );
    }
    if (tab === "imax") {
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
      <HeroBanner />
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
          <div className="movie-grid">
            {filteredMovies.map((movie) => (
              <div className="movie-card" key={movie.id}>
                <div className="movie-poster-container">
                  <img src={movie.poster} className="movie-poster" alt={movie.title} />
                  <div className="movie-badges">
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
                   <button
                   className="btn-play"
                   onClick={() => {
                   setTrailerUrl(movie.trailerUrl);
                    setShowTrailer(true);
                  }}
                  >▶</button>
                    <button
                      className="btn-buy"
                      onClick={() => navigate(`/moviebooking/${movie.id}`)}
                    >
                      Mua vé
                    </button>
                  </div>
                </div>
                <div className="movie-info">
                  <Link to={`/movies/${movie.id}`}>
                    <h3>{movie.title}</h3>
                  </Link>
                  <p>{movie.genre}</p>
                  <p>{movie.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    {showTrailer && trailerUrl && (
  <div
    style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999
    }}
    onClick={() => setShowTrailer(false)}
  >
    <div style={{ position: "relative", width: "80vw", maxWidth: 800 }}>
      <iframe
        src={trailerUrl}
        title="Trailer"
        width="100%"
        height="450"
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
        style={{ borderRadius: 12, background: "#000" }}
      ></iframe>
      <button
        style={{
          position: "absolute", top: 8, right: 8, background: "#fff", border: "none",
          borderRadius: "50%", width: 36, height: 36, fontSize: 20, cursor: "pointer"
        }}
        onClick={e => { e.stopPropagation(); setShowTrailer(false); }}
        title="Đóng"
      >×</button>
    </div>
  </div>
)}
    </div>
  );
}

export default Home;