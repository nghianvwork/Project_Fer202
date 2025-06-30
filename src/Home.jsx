import React, { useEffect, useState } from "react";

const TABS = [
  { key: "showing", label: "PHIM ĐANG CHIẾU" },
  { key: "upcoming", label: "PHIM SẮP CHIẾU" },
  { key: "special", label: "SUẤT CHIẾU ĐẶC BIỆT" }
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
  const filteredMovies =
    tab === "showing"
      ? movies.slice(0, 8) // Ví dụ phim đang chiếu
      : tab === "upcoming"
      ? movies.slice(8, 12) // Ví dụ phim sắp chiếu
      : movies.slice(12, 16); // Suất chiếu đặc biệt

  if (loading) return <div className="text-center mt-5">Đang tải phim...</div>;

  return (
    <div className="container py-4">
      {/* Tabs */}
      <div className="d-flex justify-content-center align-items-center mb-4 movie-tabs">
        {TABS.map((t) => (
          <div
            key={t.key}
            className={`movie-tab px-4 py-2 mx-1 ${tab === t.key ? "active" : ""}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </div>
        ))}
      </div>
      <hr style={{ marginTop: -10, marginBottom: 30 }} />

      {/* Grid phim */}
      <div className="row g-4">
        {filteredMovies.map((movie) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={movie.id}>
            <div className="movie-card-home shadow-sm h-100">
              {/* Badge HOT, T18, T16 */}
              <div className="movie-badges">
                {/* <span className="badge-age">T18</span> */}
                <span className="badge-hot">HOT</span>
              </div>
              {/* Poster */}
              <div className="movie-card-poster-wrapper">
                <img src={movie.poster} className="movie-card-poster" alt={movie.title} />
              </div>
              {/* Info */}
              <div className="movie-card-info px-3 pb-3 pt-2">
                <h6 className="fw-bold movie-card-title">{movie.title}</h6>
                <div className="text-dark movie-card-meta mb-2" style={{ fontSize: "1rem" }}>
                  <span className="fw-bold">Thể loại:</span> {movie.genre}
                  <br />
                  <span className="fw-bold">Thời lượng:</span> {movie.duration}
                </div>
                <button className="btn-muave mt-2 w-100">
                  MUA VÉ
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Home;
