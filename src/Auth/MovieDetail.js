import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import "./MovieDetail.css"
import Header from '../Header/Header';
import Comments from './Comments';
const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:9999/moviesData/${id}`)
      .then(res => res.json())
      .then(data => setMovie(data))
      .catch(() => setMovie(null));
  }, [id]);

  if (!movie) return <div className="movie-detail-notfound">Không tìm thấy phim</div>;

  return (
    <div>
        <div>
            <Header/>
        </div>
        <div className="movie-detail-page">
        
            
        
        
      <div className="movie-detail-container">
        <div className="movie-detail-poster">
          <img src={movie.poster} alt={movie.title} />
        </div>
        <div className="movie-detail-info">
          <h1>{movie.title}</h1>
          <div className="movie-detail-meta">
            <span className="badge badge-rating">★ {movie.rating}</span>
            <span className="badge">{movie.genre}</span>
            <span className="badge">{movie.duration}</span>
          </div>
          <p className="movie-detail-desc">{movie.description}</p>
          <h3>Lịch chiếu</h3>
          {movie.showtimes && movie.showtimes.length > 0 ? (
            <ul className="showtime-list">
              {movie.showtimes.map(showtime => (
                <li key={showtime.id}>
                  <span>{showtime.date} - {showtime.time}</span>
                  <span> | {showtime.cinema}</span>
                  <span> | Giá: {showtime.price.toLocaleString()} VND</span>
                  <button className="btn-buy">Mua vé</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>Chưa có lịch chiếu</p>
          )}
        
          <Link to="/" className="btn-back">← Quay lại danh sách phim</Link>
        </div>
      </div>
        <Comments movieTitle={movie.title} />
    </div>
    </div>
    
  );
};

export default MovieDetail;