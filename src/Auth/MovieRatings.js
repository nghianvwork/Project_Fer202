import React, { useEffect, useState } from 'react';
import "./MovieRatings.css";

const StarRating = ({ value, onChange, max = 10 }) => (
  <div className="star-rating">
    {Array.from({ length: max }, (_, i) => (
      <span
        key={i}
        className={i < value ? "star active" : "star"}
        onClick={() => onChange(i + 1)}
        onMouseEnter={e => e.target.classList.add('hover')}
        onMouseLeave={e => e.target.classList.remove('hover')}
        style={{ cursor: "pointer" }}
        title={`Đánh giá ${i + 1} sao`}
      >★</span>
    ))}
  </div>
);

const MovieRatings = ({ movieId }) => {
  const [ratings, setRatings] = useState([]);
  const [myRating, setMyRating] = useState(null);
  const [inputRating, setInputRating] = useState(0);
  const user = JSON.parse(
    localStorage.getItem("user-info") ||
    sessionStorage.getItem("user-info") ||
    "{}"
  );

  useEffect(() => {
    fetch("http://localhost:9999/ratings")
      .then(res => res.json())
      .then(data => {
        const movieRatings = data.filter(r => String(r.movieId) === String(movieId));
        setRatings(movieRatings);
        if (user && user.id) {
          const mine = movieRatings.find(r => r.userId === user.id);
          setMyRating(mine);
          setInputRating(mine ? mine.rating : 0);
        }
      });
  }, [movieId, user && user.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputRating || inputRating < 1 || inputRating > 10) {
      alert("Vui lòng chọn số sao từ 1 đến 10!");
      return;
    }
    if (!user || !user.id) {
      alert("Bạn cần đăng nhập để đánh giá!");
      return;
    }

    if (myRating) {
      await fetch(`http://localhost:9999/ratings/${myRating.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: inputRating })
      });
      setMyRating({ ...myRating, rating: inputRating });
      setRatings(ratings.map(r => r.id === myRating.id ? { ...r, rating: inputRating } : r));
    } else {
      const newRating = {
        id: Date.now(),
        movieId,
        userId: user.id,
        username: user.lastname || user.username,
        rating: inputRating
      };
      await fetch("http://localhost:9999/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRating)
      });
      setRatings([...ratings, newRating]);
      setMyRating(newRating);
    }
    alert("Đánh giá thành công!");
  };

  return (
    <div className="movie-ratings-container">
      <div className="movie-ratings-card">
        <h3 className="title">Đánh giá của người xem</h3>
        <ul className="ratings-list">
          {ratings.length === 0 && <li className="empty">Chưa có đánh giá nào.</li>}
          {ratings.map(r => (
            <li key={r.id}>
              <b>{r.username}:</b> <span className="user-star">★ {r.rating}</span>
            </li>
          ))}
        </ul>
        <form onSubmit={handleSubmit} className="ratings-form">
          <label>
            <span className="your-rating">Đánh giá của bạn:</span>
            <StarRating
              value={inputRating}
              onChange={setInputRating}
              max={10}
            />
          </label>
          <button type="submit" className="movie-rating-btn">
            {myRating ? "Cập nhật" : "Gửi"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MovieRatings;
