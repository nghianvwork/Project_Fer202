import React, { useState, useEffect } from "react";

const COMMENTS_KEY = "global-comments";

export default function CommentBox() {
  const [comments, setComments] = useState(() => {
    // Lưu comment vào localStorage, có thể thay bằng API nếu muốn
    const saved = localStorage.getItem(COMMENTS_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [text, setText] = useState("");

  useEffect(() => {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
  }, [comments]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setComments([
      ...comments,
      {
        id: Date.now(),
        text,
        time: new Date().toLocaleString(),
      },
    ]);
    setText("");
  };

  return (
    <div className="comment-box" style={{maxWidth: 500, margin: "32px auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px #0001", padding: 24}}>
      <h3>Bình luận</h3>
      <form onSubmit={handleSubmit} style={{marginBottom: 16}}>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Nhập bình luận của bạn..."
          rows={3}
          style={{width: "100%", borderRadius: 8, padding: 10, border: "1px solid #ccc", resize: "vertical"}}
        />
        <button type="submit" style={{marginTop: 8, padding: "8px 18px", borderRadius: 8, background: "#764ba2", color: "#fff", border: "none", fontWeight: 600, cursor: "pointer"}}>
          Gửi
        </button>
      </form>
      <div>
        {comments.length === 0 && <div style={{color: "#888"}}>Chưa có bình luận nào.</div>}
        {comments.map(c => (
          <div key={c.id} style={{marginBottom: 12, padding: 10, background: "#f7f7fa", borderRadius: 8}}>
            <div style={{fontSize: 15}}>{c.text}</div>
            <div style={{fontSize: 12, color: "#888", marginTop: 4}}>{c.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
