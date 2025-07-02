import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Star, Clock, MessageCircle, Heart, Share } from 'lucide-react';
import Header from '../Header/Header';

const ScheduleToday = () => {
  const [moviesData, setMoviesData] = useState([]);
  const [comments, setComments] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [moviesRes, commentsRes] = await Promise.all([
          fetch('http://localhost:9999/moviesData'),
          fetch('http://localhost:9999/comments')
        ]);

        if (!moviesRes.ok || !commentsRes.ok) {
          throw new Error('Lỗi khi fetch dữ liệu từ server');
        }

        const movies = await moviesRes.json();
        const comments = await commentsRes.json();

        setMoviesData(movies);
        setComments(comments);
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi fetch dữ liệu:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (moviesData.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % Math.min(5, moviesData.length));
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [moviesData]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.min(5, moviesData.length));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.min(5, moviesData.length)) % Math.min(5, moviesData.length));
  };

  const getAgeRating = (rating) => {
    if (rating >= 8.5) return 'P';
    if (rating >= 7.5) return '13+';
    return '18+';
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#222", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#fff", fontSize: 24 }}>Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (!moviesData || moviesData.length === 0) {
    return (
      <div style={{ minHeight: "100vh", background: "#222", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#fff", fontSize: 24 }}>Không có dữ liệu phim!</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#18181b" }}>
      <Header />

      {/* Hero Section */}
      <section style={{ minHeight: "100vh", paddingTop: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 1200 }}>
          <h1 style={{ fontSize: 48, fontWeight: "bold", color: "#fff", textAlign: "center", marginBottom: 40 }}>
            Phim sắp chiếu
          </h1>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 32 }}>
            <button
              onClick={prevSlide}
              style={{
                padding: 12,
                borderRadius: "50%",
                background: "#222",
                color: "#fff",
                border: "none",
                cursor: "pointer"
              }}
            >
              <ChevronLeft size={24} />
            </button>

            <div style={{ display: "flex", gap: 24 }}>
              {moviesData.slice(0, 5).map((movie, index) => {
                const ageRating = getAgeRating(movie.rating);
                const isActive = index === currentSlide;
                return (
                  <div
                    key={movie.id}
                    style={{
                      transform: isActive ? "scale(1.1)" : "scale(0.9)",
                      opacity: isActive ? 1 : 0.7,
                      zIndex: isActive ? 10 : 1,
                      transition: "all 0.4s",
                      cursor: "pointer",
                      position: "relative"
                    }}
                    onClick={() => setCurrentSlide(index)}
                  >
                    <div style={{
                      width: 220,
                      height: 340,
                      borderRadius: 16,
                      overflow: "hidden",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
                      position: "relative"
                    }}>
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />

                      <div style={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        padding: "4px 10px",
                        borderRadius: 8,
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: 14,
                        background: ageRating === "P" ? "#22c55e" : ageRating === "13+" ? "#eab308" : "#ef4444"
                      }}>
                        {ageRating}
                      </div>

                      <div style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(0,0,0,0.4)",
                        opacity: 0,
                        transition: "opacity 0.2s"
                      }}
                        className="movie-hover"
                      >
                        <button style={{
                          padding: 16,
                          borderRadius: "50%",
                          background: "#ef4444",
                          color: "#fff",
                          border: "none",
                          cursor: "pointer"
                        }}>
                          <Play size={24} fill="currentColor" />
                        </button>
                      </div>

                      <div style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: "linear-gradient(to top, #000 80%, transparent)",
                        padding: 16
                      }}>
                        <h3 style={{ color: "#fff", fontWeight: "bold", fontSize: 18, marginBottom: 4 }}>{movie.title}</h3>
                        <p style={{ color: "#d1d5db", fontSize: 14, marginBottom: 8 }}>{movie.genre}</p>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <Star size={16} color="#facc15" fill="#facc15" />
                            <span style={{ color: "#fff", fontSize: 14 }}>{movie.rating}</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#d1d5db", fontSize: 14 }}>
                            <Clock size={16} />
                            <span>{movie.duration}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{
                      position: "absolute",
                      top: -20,
                      left: -20,
                      width: 48,
                      height: 48,
                      background: "#ef4444",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontWeight: "bold",
                      fontSize: 22,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
                    }}>
                      {index + 1}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={nextSlide}
              style={{
                padding: 12,
                borderRadius: "50%",
                background: "#222",
                color: "#fff",
                border: "none",
                cursor: "pointer"
              }}
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 32 }}>
            {Array.from({ length: Math.min(5, moviesData.length) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: index === currentSlide ? "#ef4444" : "#6b7280",
                  border: "none",
                  transform: index === currentSlide ? "scale(1.2)" : "scale(1)",
                  transition: "all 0.2s",
                  cursor: "pointer"
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Comments Section */}
      <section style={{ padding: "64px 0", background: "#27272a" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={{ fontSize: 32, fontWeight: "bold", color: "#fff", textAlign: "center", marginBottom: 48 }}>
            Bình luận nổi bật
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
            {comments.map((comment) => (
              <div key={comment.id} style={{
                background: "#3f3f46",
                borderRadius: 16,
                padding: 24,
                transition: "background 0.2s"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <img
                    src={comment.avatar}
                    alt={comment.user}
                    style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }}
                  />
                  <div>
                    <h4 style={{ color: "#fff", fontWeight: 600 }}>{comment.user}</h4>
                    <p style={{ color: "#a1a1aa", fontSize: 13 }}>{comment.time}</p>
                  </div>
                </div>
                <p style={{ color: "#e5e7eb", marginBottom: 12 }}>{comment.comment}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 14 }}>
                  <span style={{ color: "#f87171", fontWeight: 500 }}>{comment.movie}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, color: "#a1a1aa" }}>
                    <button style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", color: "#a1a1aa", cursor: "pointer" }}>
                      <Heart size={16} />
                      <span>{comment.likes}</span>
                    </button>
                    <button style={{ background: "none", border: "none", color: "#a1a1aa", cursor: "pointer" }}>
                      <MessageCircle size={16} />
                    </button>
                    <button style={{ background: "none", border: "none", color: "#a1a1aa", cursor: "pointer" }}>
                      <Share size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "#18181b", padding: "32px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center", color: "#a1a1aa" }}>
          © 2025 CinemaPlex. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default ScheduleToday;
