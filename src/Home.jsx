import React, { useEffect, useState } from "react";
import HeroBanner from "./Banner";
import Header from "./Header/Header";
import { Link } from "react-router-dom";

const TABS = [
  { key: "showing", label: "Đang chiếu" },
  { key: "upcoming", label: "Sắp chiếu" },
  { key: "imax", label: "Phim IMAX" },
  { key: "nationwide", label: "Toàn quốc" },
];

function Home() {
  const [movies, setMovies] = useState([]);
  const [tab, setTab] = useState("showing");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:9999/moviesData")
      .then((res) => res.json())
      .then((data) => {
        setMovies(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Lấy danh sách các thể loại duy nhất
  const genres = Array.from(
    new Set(
      movies.flatMap((movie) =>
        movie.genre.split(",").map((g) => g.trim())
      )
    )
  );

  // Toggle thể loại
  const toggleGenre = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre)
        ? prev.filter((g) => g !== genre)
        : [...prev, genre]
    );
  };

  // Lọc phim theo tab và thể loại
  const filteredMovies = movies.filter((movie) => {
    const today = new Date();
    let passTab = false;

    if (tab === "showing") {
      passTab = movie.showtimes?.some(
        (show) => new Date(show.date) <= today
      );
    } else if (tab === "upcoming") {
      passTab = movie.showtimes?.some(
        (show) => new Date(show.date) > today
      );
    } else if (tab === "imax") {
      passTab = movie.rating >= 8.5;
    } else {
      passTab = true;
    }

    const movieGenres = movie.genre.split(",").map((g) => g.trim());
    const passGenre =
      selectedGenres.length === 0 ||
      selectedGenres.some((g) => movieGenres.includes(g));

    return passTab && passGenre;
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
      <Header />
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

          {/* Bộ lọc thể loại */}
          <div className="genre-filter" style={{ margin: "15px 0", color: "black" }}>
            <strong>Thể loại:</strong>
            {genres.map((genre) => (
              <label key={genre} style={{ marginRight: "8px", marginLeft: "10px", color: "black" }}>
                <input
                  type="checkbox"
                  value={genre}
                  checked={selectedGenres.includes(genre)}
                  onChange={() => toggleGenre(genre)}
                />
                {genre}
              </label>
            ))}
            {selectedGenres.length > 0 && (
              <div style={{ marginTop: "10px" }}>
                <strong>Đã chọn:</strong>{" "}
                {selectedGenres.map((g, idx) => (
                  <span key={g}>
                    {g}
                    {idx < selectedGenres.length - 1 ? ", " : ""}
                  </span>
                ))}
                <button
                  onClick={() => setSelectedGenres([])}
                  style={{
                    marginLeft: "10px",
                    padding: "2px 8px",
                    cursor: "pointer",
                  }}
                >
                  Xóa tất cả
                </button>
              </div>
            )}
          </div>

          {/* Danh sách phim */}
          <div className="movie-grid">
            {filteredMovies.map((movie) => (
              <div className="movie-card" key={movie.id}>
                <div className="movie-poster-container">
                  <img
                    src={movie.poster}
                    className="movie-poster"
                    alt={movie.title}
                  />
                  <div className="movie-badges">
                    {movie.rating >= 8.5 && (
                      <span className="badge badge-hot">HOT</span>
                    )}
                    {movie.showtimes?.some(
                      (show) => new Date(show.date) > new Date()
                    ) && (
                      <span className="badge badge-new">NEW</span>
                    )}
                  </div>
                  <div className="movie-rating">
                    <span className="rating-star">★</span>
                    <span className="rating-score">{movie.rating}</span>
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
    </div>
  );
}

export default Home;