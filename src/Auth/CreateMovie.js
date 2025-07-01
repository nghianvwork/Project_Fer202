import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const initialShowtime = {
  id: "",
  time: "",
  date: "",
  cinema: "",
  price: ""
};

const CreateMovie = () => {
  const [movie, setMovie] = useState({
    title: "",
    genre: "",
    duration: "",
    rating: "",
    poster: "",
    description: "",
    showtimes: [],
  });
  const [showtime, setShowtime] = useState(initialShowtime);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  // Xử lý thay đổi input movie
  const handleChange = (e) => {
    setMovie({
      ...movie,
      [e.target.name]: e.target.value
    });
  };

  // Xử lý thay đổi input showtime
  const handleShowtimeChange = (e) => {
    setShowtime({
      ...showtime,
      [e.target.name]: e.target.value
    });
  };

  // Thêm 1 lịch chiếu vào state
  const handleAddShowtime = () => {
    if (
      showtime.time && showtime.date && showtime.cinema && showtime.price
    ) {
      setMovie((prev) => ({
        ...prev,
        showtimes: [
          ...prev.showtimes,
          { ...showtime, id: prev.showtimes.length + 1 }
        ]
      }));
      setShowtime(initialShowtime);
    }
  };

  // Xoá lịch chiếu
  const handleRemoveShowtime = (id) => {
    setMovie((prev) => ({
      ...prev,
      showtimes: prev.showtimes.filter(st => st.id !== id)
    }));
  };

  // Submit form: gửi lên json-server
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    // Kiểm tra tối thiểu
    if (!movie.title || !movie.genre || !movie.duration) {
      setErrorMsg("Vui lòng điền đầy đủ thông tin bắt buộc!");
      setLoading(false);
      return;
    }

    try {
      // Gửi lên API (json-server)
      const res = await fetch("http://localhost:9999/moviesData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...movie,
          rating: movie.rating ? Number(movie.rating) : 0,
        })
      });

      if (res.ok) {
        setSuccessMsg("Thêm phim thành công!");
        setMovie({
          title: "",
          genre: "",
          duration: "",
          rating: "",
          poster: "",
          description: "",
          showtimes: [],
        });
        setTimeout(() => {
          navigate("/home");
        }, 1300);
      } else {
        setErrorMsg("Đã có lỗi xảy ra khi thêm phim!");
      }
    } catch (err) {
      setErrorMsg("Không thể kết nối server!");
    }
    setLoading(false);
  };

  return (
    <div className="container py-5" style={{maxWidth: 600, minHeight: "100vh", background: "linear-gradient(135deg,#fafbff 40%,#e7e9f7 100%)"}}>
      <div className="card shadow-lg rounded-4" style={{overflow: "hidden"}}>
        <div className="card-body p-4">
          <h2 className="card-title mb-4 text-primary text-center fw-bold" style={{letterSpacing: 1}}>🎬 Thêm phim mới</h2>
          {/* Alert */}
          {successMsg && <div className="alert alert-success text-center">{successMsg}</div>}
          {errorMsg && <div className="alert alert-danger text-center">{errorMsg}</div>}

          <form onSubmit={handleSubmit} className="needs-validation" noValidate>
            <div className="mb-3">
              <label className="form-label fw-semibold">Tên phim <span className="text-danger">*</span></label>
              <input name="title" className="form-control form-control-lg" placeholder="Tên Phim" value={movie.title} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Thể loại <span className="text-danger">*</span></label>
              <input name="genre" className="form-control" placeholder="Thể loại phim" value={movie.genre} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Thời lượng <span className="text-danger">*</span></label>
              <input name="duration" className="form-control" placeholder="Thời lượng phim" value={movie.duration} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Đánh giá IMDb</label>
              <input name="rating" className="form-control" type="number" min={0} max={10} step="0.1" placeholder="Đánh giá" value={movie.rating} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Poster (URL)</label>
              <input name="poster" className="form-control" placeholder="Link Poster" value={movie.poster} onChange={handleChange} />
              {movie.poster && (
                <div className="mt-2 text-center">
                  <img src={movie.poster} alt="Poster preview" style={{maxHeight: 160, borderRadius: 12, boxShadow:"0 3px 12px #c4cae855"}} onError={e=>e.target.style.display="none"} />
                </div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Mô tả phim</label>
              <textarea name="description" className="form-control" placeholder="Mô tả phim" value={movie.description} onChange={handleChange} rows={3}/>
            </div>

            {/* Showtimes */}
            <div className="border rounded-4 p-3 mb-3 bg-light">
              <div className="mb-2 fw-bold text-primary">Thêm lịch chiếu</div>
              <div className="row g-2 align-items-center">
                <div className="col-3">
                  <input name="time" className="form-control" placeholder="Giờ (09:00)" value={showtime.time} onChange={handleShowtimeChange} />
                </div>
                <div className="col-4">
                  <input name="date" className="form-control" type="date" value={showtime.date} onChange={handleShowtimeChange} />
                </div>
                <div className="col-3">
                  <input name="cinema" className="form-control" placeholder="Rạp" value={showtime.cinema} onChange={handleShowtimeChange} />
                </div>
                <div className="col-2 d-flex align-items-center">
                  <input name="price" className="form-control" type="number" min={0} placeholder="Giá vé" value={showtime.price} onChange={handleShowtimeChange} />
                </div>
              </div>
              <div className="mt-2 d-flex justify-content-end">
                <button type="button" className="btn btn-success btn-sm px-3 fw-bold rounded-pill" onClick={handleAddShowtime} disabled={!showtime.time || !showtime.date || !showtime.cinema || !showtime.price}>
                  + Thêm lịch
                </button>
              </div>
              <ul className="mt-3 mb-0 ps-3 small">
                {movie.showtimes.map((st) => (
                  <li key={st.id} className="d-flex align-items-center justify-content-between">
                    <span>
                      <span className="badge bg-secondary me-1">{st.date}</span>
                      <span className="badge bg-info me-1">{st.time}</span>
                      <span className="me-1">{st.cinema}</span>
                      <span className="text-success fw-bold">{parseInt(st.price).toLocaleString()}đ</span>
                    </span>
                    <button type="button" className="btn btn-sm btn-outline-danger ms-2 rounded-pill" onClick={() => handleRemoveShowtime(st.id)}>Xoá</button>
                  </li>
                ))}
              </ul>
            </div>
            <button type="submit" className="btn btn-primary w-100 py-2 fw-bold rounded-pill" disabled={loading}>
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2"></span>
              ) : (
                <span>Thêm phim</span>
              )}
            </button>
          </form>
        </div>
      </div>
      {/* Style riêng */}
      <style>
        {`
        .card {
          border-radius: 28px !important;
          box-shadow: 0 4px 36px #b9bdf733 !important;
        }
        .form-label { font-weight: 500;}
        .tab-movie-btn { transition: background .2s; }
        .tab-movie-btn.active { background: #558fff; color: #fff;}
        `}
      </style>
    </div>
  );
};

export default CreateMovie;
