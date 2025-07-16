import React, { useEffect, useState } from "react";
import "./Comments.css";

const Comments = ({ movieTitle }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = JSON.parse(
  localStorage.getItem("user-info") ||
  sessionStorage.getItem("user-info") ||
  "{}"
);

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


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setIsSubmitting(true);

    const newComment = {
      id: Date.now(),
      movie: movieTitle,
      user:  user.firstname || user.username || "Khách",
      avatar: user.avatar || "https://i.pravatar.cc/40?u=" + (user.username || "guest"),
      comment: commentText,
      time: new Date().toLocaleString(),
      likes: 0
    };

   
    await fetch("http://localhost:9999/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newComment)
    });

    setComments([...comments, newComment]);
    setCommentText("");
    setIsSubmitting(false);
  };

  return (
    <div className="comments-section">
      <h3>Bình luận phim</h3>
      
      <form className="comment-form" onSubmit={handleSubmit} style={{marginBottom: 16}}>
        <textarea
          className="comment-input"
          placeholder="Nhập bình luận của bạn..."
          value={commentText}
          onChange={e => setCommentText(e.target.value)}
          rows={2}
          required
        />
        <button
          type="submit"
          className="comment-submit-btn"
          disabled={isSubmitting || !commentText.trim()}
        >
          {isSubmitting ? "Đang gửi..." : "Gửi"}
        </button>
      </form>
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