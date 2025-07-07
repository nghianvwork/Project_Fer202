import React, { useState, useEffect } from "react";
import { Star, Clock, Filter, Search, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";

const NowShowing = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNowShowing = async () => {
      try {
        const response = await fetch("http://localhost:9999/nowShowing");
        if (!response.ok) throw new Error("Lỗi khi lấy phim đang chiếu");
        const data = await response.json();
        setMovies(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchNowShowing();
  }, []);

  const getAgeRating = (rating) => {
    if (rating >= 8.5) return "P";
    if (rating >= 7.5) return "13+";
    return "18+";
  };

  const getBadgeColor = (rating) => {
    const age = getAgeRating(rating);
    switch (age) {
      case "P":
        return "#22c55e";
      case "13+":
        return "#eab308";
      case "18+":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const genres = ["all", ...Array.from(new Set(movies.flatMap(m => m.genre.split(", ").map(g => g.trim()))))];

  const filteredMovies = movies.filter((movie) => {
    const matchesGenre =
      selectedGenre === "all" || movie.genre.includes(selectedGenre);
    const matchesSearch = movie.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0f3460",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#fff",
          fontSize: "18px",
        }}
      >
        Đang tải dữ liệu phim đang chiếu...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f3460",
        color: "#fff",
      }}
    >
      <Header />

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px" }}>
        <h1 style={{ fontSize: "40px", marginBottom: "16px" }}>🎬 PHIM ĐANG CHIẾU</h1>

        {/* Filter */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
          {/* Search */}
          <div style={{ position: "relative", flex: 1 }}>
            <Search
              size={20}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#9ca3af",
              }}
            />
            <input
              type="text"
              placeholder="Tìm kiếm phim..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 10px 10px 36px",
                borderRadius: "8px",
                border: "none",
                outline: "none",
              }}
            />
          </div>

          {/* Genre */}
          <div>
            <Filter size={20} style={{ marginRight: "8px" }} />
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              style={{
                padding: "10px",
                borderRadius: "8px",
                outline: "none",
              }}
            >
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre === "all" ? "Tất cả thể loại" : genre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Movie List */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "24px",
          }}
        >
          {filteredMovies.map((movie) => (
            <div
              key={movie.id}
              style={{
                background: "#1a1a2e",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              }}
            >
              <img
                src={movie.poster}
                alt={movie.title}
                style={{ width: "100%", height: "350px", objectFit: "cover" }}
              />
              <div style={{ padding: "16px" }}>
                <h3 style={{ fontSize: "18px", marginBottom: "8px" }}>{movie.title}</h3>
                <p style={{ fontSize: "14px", color: "#9ca3af", marginBottom: "8px" }}>
                  {movie.genre}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                  <span>
                    <Star size={14} color="#facc15" /> {movie.rating}
                  </span>
                  <span>
                    <Clock size={14} /> {movie.duration}
                  </span>
                </div>

                {/* Age Rating */}
                <div
                  style={{
                    marginTop: "10px",
                    background: getBadgeColor(movie.rating),
                    color: "#fff",
                    borderRadius: "8px",
                    padding: "4px 8px",
                    display: "inline-block",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  {getAgeRating(movie.rating)}
                </div>

                {/* Book Button */}
                <button
                  style={{
                    marginTop: "12px",
                    width: "100%",
                    padding: "10px",
                    background: "linear-gradient(45deg, #ef4444, #dc2626)",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/moviebooking/${movie.id}`)} // Đây là điểm quan trọng!
                >
                  <Ticket size={16} style={{ marginRight: "6px" }} />
                  Đặt vé
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredMovies.length === 0 && (
          <p style={{ textAlign: "center", marginTop: "20px" }}>Không tìm thấy phim nào phù hợp</p>
        )}
      </div>
    </div>
  );
};

export default NowShowing;
