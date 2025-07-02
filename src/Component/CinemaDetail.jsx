import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../Header/Header"

function CinemaDetail() {
  const { cinemaName } = useParams(); // ví dụ: cgv-vincom
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:9999/moviesData")
      .then(res => res.json())
      .then(data => {
        // Xử lý tên rạp cho phù hợp với đường dẫn
        const prettyName = cinemaName.replace(/-/g, " ").toLowerCase();
        // Lọc phim có suất chiếu ở rạp này
        const filtered = data
          .map(movie => {
            // Chỉ lấy các showtimes thuộc rạp đang chọn
            const showtimes = movie.showtimes?.filter(show =>
              show.cinema.toLowerCase().replace(/,/g,"").replace(/\s+/g, " ").includes(prettyName)
            ) || [];
            return showtimes.length > 0 ? { ...movie, showtimes } : null;
          })
          .filter(Boolean);
        setMovies(filtered);
        setLoading(false);
      });
  }, [cinemaName]);

  if (loading) return <div style={{padding:40}}>Đang tải dữ liệu...</div>;

  return (
    <div><Header/>
      <div style={{padding:40, minHeight: '50vh', background: "#f9f8ff"}}>
      <h2 style={{marginBottom:24, color:'#ff6b35'}}>
        RẠP: {cinemaName.replace(/-/g, " ").toUpperCase()}
      </h2>
      {movies.length === 0 ? (
        <div>Không có phim nào tại rạp này.</div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: "32px"
        }}>
          {movies.map(movie => (
            <div key={movie.id} style={{
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column"
            }}>
              <img
                src={movie.poster}
                alt={movie.title}
                style={{width: "100%", aspectRatio: "2/3", objectFit: "cover", borderTopLeftRadius:16, borderTopRightRadius:16}}
              />
              <div style={{padding: "18px 22px 12px 22px", flex: 1, display:"flex", flexDirection:"column"}}>
                <h3 style={{margin:"0 0 6px", fontSize: "1.3rem", color:"#1a1a2e"}}>{movie.title}</h3>
                <div style={{marginBottom: 6, color:"#ff6b35", fontWeight: 500}}>{movie.genre}</div>
                <div style={{marginBottom: 10, color:"#888"}}>
                  Thời lượng: <b>{movie.duration}</b>
                  &nbsp;|&nbsp;
                  <span style={{color:"#ffd700"}}>★</span> {movie.rating}
                </div>
                <div style={{fontSize:"15px", color:"#333", marginBottom:14}}>
                  {movie.description}
                </div>
                <div style={{marginTop:"auto"}}>
                  <div style={{fontWeight:600, marginBottom:4, color:"#764ba2"}}>Lịch chiếu:</div>
                  <ul style={{paddingLeft:18, marginBottom:0}}>
                    {movie.showtimes.map(show => (
                      <li key={show.id} style={{fontSize:14, marginBottom:2}}>
                        {show.date} - <b>{show.time}</b>
                        {show.price && <> - Giá vé: <span style={{color:"#ff6b35"}}>{show.price.toLocaleString()}₫</span></>}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}

export default CinemaDetail;
