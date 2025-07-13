import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditMovie() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch(`http://localhost:9999/moviesData/${id}`)
      .then(res => res.json())
      .then(data => {
        setMovie(data);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setMovie({ ...movie, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`http://localhost:9999/moviesData/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...movie, rating: Number(movie.rating) }),
    });
    setLoading(false);
    if (res.ok) {
      setMsg("Cập nhật thành công!");
      setTimeout(() => navigate("/admin"), 1000);
    } else {
      setMsg("Có lỗi xảy ra!");
    }
  };

  if (loading) return <div style={{ textAlign: "center", padding: 40 }}>Đang tải phim...</div>;
  if (!movie) return <div style={{ textAlign: "center", padding: 40 }}>Không tìm thấy phim!</div>;

  return (
    <div style={{ maxWidth: 480, margin: "32px auto", background: "#fff", borderRadius: 16, boxShadow: "0 4px 24px #eee", padding: 32 }}>
      <h2 style={{ textAlign: "center", fontWeight: 700 }}>Sửa phim</h2>
      {msg && <div style={{ textAlign: "center", margin: 12, color: "#00701a" }}>{msg}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label>Tên phim</label>
          <input className="form-control" name="title" value={movie.title} onChange={handleChange} required />
        </div>
        <div className="mb-2">
          <label>Thể loại</label>
          <input className="form-control" name="genre" value={movie.genre} onChange={handleChange} required />
        </div>
        <div className="mb-2">
          <label>Thời lượng</label>
          <input className="form-control" name="duration" value={movie.duration} onChange={handleChange} required />
        </div>
        <div className="mb-2">
          <label>Rating IMDb</label>
          <input className="form-control" name="rating" type="number" value={movie.rating} min={0} max={10} step="0.1" onChange={handleChange} />
        </div>
        <div className="mb-2">
          <label>Poster (URL)</label>
          <input className="form-control" name="poster" value={movie.poster} onChange={handleChange} />
        </div>
        <div className="mb-2">
          <label>Mô tả</label>
          <textarea className="form-control" name="description" value={movie.description} onChange={handleChange} rows={3} />
        </div>
        <button className="btn btn-primary w-100 mt-3" type="submit" disabled={loading}>
          {loading ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
        <button className="btn btn-link w-100 mt-2" type="button" onClick={() => navigate("/admin")}>Quay lại</button>
      </form>
    </div>
  );
}
