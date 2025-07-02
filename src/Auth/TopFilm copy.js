import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";

const API_URL = "http://localhost:9999/moviesData";

const TopFilm = ({ top = 5 }) => {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setMovies(data));
  }, []);

  const topFilms = [...movies]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, top);

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        minHeight: "100vh", 
      }}
    >
      <Header />
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <h2
            style={{
              margin: "0",
              fontSize: "3rem",
              fontWeight: "bold",
              background: "linear-gradient(45deg, #ff6b6b, #ffd93d)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
              marginBottom: "10px",
            }}
          >
            🎬 Top {top} Phim Hot Nhất
          </h2>
          <div
            style={{
              width: "100px",
              height: "4px",
              background: "linear-gradient(45deg, #ff6b6b, #ffd93d)",
              margin: "0 auto",
              borderRadius: "2px",
              boxShadow: "0 2px 10px rgba(255, 107, 107, 0.5)",
            }}
          ></div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "30px",
            justifyItems: "center",
          }}
        >
          {topFilms.map((film, idx) => (
            <div
              key={film.id}
              style={{
                width: "280px",
                background: "rgba(255, 255, 255, 0.95)",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                position: "relative",
                transform: "translateY(0)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                cursor: "pointer",
                backdropFilter: "blur(10px)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  "translateY(-10px) scale(1.02)";
                e.currentTarget.style.boxShadow =
                  "0 30px 60px rgba(0,0,0,0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 20px 40px rgba(0,0,0,0.15)";
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "15px",
                  left: "15px",
                  background:
                    idx === 0
                      ? "linear-gradient(45deg, #ffd700, #ffed4e)"
                      : idx === 1
                      ? "linear-gradient(45deg, #c0c0c0, #e8e8e8)"
                      : idx === 2
                      ? "linear-gradient(45deg, #cd7f32, #ffa500)"
                      : "linear-gradient(45deg, #667eea, #764ba2)",
                  color: "#fff",
                  fontWeight: "bold",
                  borderRadius: "15px",
                  padding: "8px 16px",
                  fontSize: "16px",
                  zIndex: 2,
                  boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                }}
              >
                #{idx + 1}
              </div>

              <div style={{ position: "relative", overflow: "hidden" }}>
                <img
                  src={film.poster}
                  alt={film.title}
                  style={{
                    width: "100%",
                    height: "350px",
                    objectFit: "cover",
                    transition: "transform 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "scale(1)";
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "60px",
                    background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
                  }}
                ></div>
              </div>

              <div style={{ padding: "20px" }}>
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "20px",
                    marginBottom: "8px",
                    color: "#2c3e50",
                    lineHeight: "1.3",
                  }}
                >
                  {film.title}
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    marginBottom: "8px",
                  }}
                >
                  <span
                    style={{
                      background: "linear-gradient(45deg, #ff6b6b, #ff8e53)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}
                  >
                    ⭐
                  </span>
                  <span
                    style={{
                      color: "#e74c3c",
                      fontWeight: "700",
                      fontSize: "18px",
                    }}
                  >
                    {film.rating}
                  </span>
                </div>

                <div
                  style={{
                    fontSize: "14px",
                    color: "#7f8c8d",
                    marginBottom: "20px",
                    fontStyle: "italic",
                  }}
                >
                  {film.genre}
                </div>

                <button
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "linear-gradient(45deg, #667eea, #764ba2)",
                    border: "none",
                    borderRadius: "12px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "16px",
                    color: "white",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                  onClick={() => navigate(`/movies/${film.id}`)}
                  onMouseEnter={(e) => {
                    e.target.style.background =
                      "linear-gradient(45deg, #5a6fd8, #6a42a0)";
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow =
                      "0 8px 25px rgba(102, 126, 234, 0.6)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background =
                      "linear-gradient(45deg, #667eea, #764ba2)";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow =
                      "0 4px 15px rgba(102, 126, 234, 0.4)";
                  }}
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopFilm;
