import React, { useEffect, useState } from "react";
import "./Comments.css";

const Comments = ({ movieTitle }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetch("http://localhost:9999/comments")
      .then((res) => res.json())
      .then((data) => {
        if (movieTitle) {
          setComments(data.filter((c) => c.movie === movieTitle));
        } else {
          setComments(data);
        }
      });
  }, [movieTitle]);

  return (
    <div className="comments-section">
      <h3>Bình luận phim</h3>
      {comments.length === 0 && <div>Chưa có bình luận nào.</div>}
      <ul className="comments-list">
        {comments.map((c) => (
          <li key={c.id} className="comment-item">
            <img src={c.avatar} alt={c.user} className="comment-avatar" />
            <div className="comment-content">
              <div className="comment-user">{c.user}</div>
              <div className="comment-text">{c.comment}</div>
              <div className="comment-meta">
                <span className="comment-time">{c.time}</span>
                <span className="comment-likes">👍 {c.likes}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Comments;