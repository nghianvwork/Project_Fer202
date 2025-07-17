import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import "./MovieDetail.css"
import Header from '../Header/Header';
import Comments from './Comments';
import CommentBox from './CommentBox';
import MovieRatings from './MovieRatings';
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
      <Header />
      <div className="movie-detail-page">
        <div className="movie-detail-container">
          <div className="movie-detail-poster">
            <img src={movie.poster} alt={movie.title} />
            {/* Hiển thị trailer nếu có */}
            {movie.trailerUrl && (
              <div className="movie-detail-trailer" style={{ marginTop: 16 }}>
                <h3>Trailer</h3>
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 8 }}>
                  <iframe
                    src={movie.trailerUrl}
                    title={`Trailer ${movie.title}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%'
                    }}
                  ></iframe>
                </div>
              </div>
            )}
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
                  <span> {showtime.time}</span>
                  <span> | {showtime.cinema}</span>
                  <span> | Giá: {showtime.price.toLocaleString()} VND</span>
                  
                </li>
              ))}
            </ul>
          ) : (
            <p>Chưa có lịch chiếu</p>
          )}
            <Link to="/" className="btn-back">← Quay lại danh sách phim</Link>
          </div>
        </div>
        <MovieRatings movieId={movie.id} />
        <Comments movieTitle={movie.title} />
        
      </div>
    </div>
  );
};

export default MovieDetail;