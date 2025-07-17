import React, { useEffect, useState } from "react";
import { Trash2, Edit, PlusCircle, List } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ShowtimeForm from "./ShowtimeForm";
import AdminHeader from "../Header/AdminHeader";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";


import "./admindashboard.css";



import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";



const API_MOVIES = "http://localhost:9999/moviesData";
const API_USERS = "http://localhost:9999/users";
const API_BOOKINGS = "http://localhost:9999/bookings";

export default function AdminDashboard() {
  const [movies, setMovies] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [tab, setTab] = useState("dashboard");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [editShowtimeId, setEditShowtimeId] = useState(null);

  // Bộ lọc
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [minRating, setMinRating] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  // Fetch dữ liệu khi mount
  useEffect(() => {
    const fetchAll = async () => {
      const [mv, us, bk] = await Promise.all([
        fetch(API_MOVIES).then((r) => r.json()),
        fetch(API_USERS).then((r) => r.json()),
        fetch(API_BOOKINGS).then((r) => r.json()),
      ]);
      setMovies(mv);
      setUsers(us);
      setBookings(bk);
    };

    fetchAll();
  }, []);

  // Lấy tất cả genres không trùng
  const allGenres = Array.from(
    new Set(
      movies
        .flatMap(m => (m.genre || "").split(","))
        .map(g => g.trim())
        .filter(Boolean)
    )
  ).sort((a, b) => a.localeCompare(b));

  const handleToggleGenre = (genre) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  // Bộ lọc tổng hợp
  const filteredMovies = movies.filter(mv => {
    // Lọc theo thể loại
    const matchGenre =
      selectedGenres.length === 0
        ? true
        : mv.genre
            .split(",")
            .map(g => g.trim())
            .some(g => selectedGenres.includes(g));
    // Lọc rating
    const matchRating =
      !minRating ? true : Number(mv.rating) >= Number(minRating);
    // Lọc theo tên
    const matchTitle =
      !searchTerm
        ? true
        : mv.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchGenre && matchRating && matchTitle;
  });

  // --------- Dữ liệu biểu đồ tổng quan ---------
  // 1. BarChart: số phim theo thể loại
  const genreCount = {};
  movies.forEach(movie => {
    (movie.genre || "").split(",").map(g => g.trim()).filter(Boolean).forEach(genre => {
      genreCount[genre] = (genreCount[genre] || 0) + 1;
    });
  });
  const genreChartData = Object.entries(genreCount)
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 7); // Top 7

  // 2. PieChart: tỷ lệ phim theo rating
  const ratingGroups = [
    { name: "<7", from: 0, to: 6.99 },
    { name: "7–7.99", from: 7, to: 7.99 },
    { name: "8–8.99", from: 8, to: 8.99 },
    { name: "≥9", from: 9, to: 10 }
  ];
  const ratingChartData = ratingGroups.map(group => ({
    name: group.name,
    value: movies.filter(
      m => Number(m.rating) >= group.from && Number(m.rating) <= group.to
    ).length
  }));
  const ratingColors = ["#faa", "#ffd93d", "#76c7fa", "#48bb78"];
  // ----------------------------------------------

  // CRUD
  const handleDeleteMovie = async (id) => {
    if (!window.confirm("Xác nhận xoá phim này?")) return;
    await fetch(`${API_MOVIES}/${id}`, { method: "DELETE" });
    setMovies(movies.filter((m) => m.id !== id));
    if (selectedMovie && selectedMovie.id === id) setSelectedMovie(null);
  };

  // Xoá user

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Xác nhận xoá tài khoản này?")) return;
    await fetch(`${API_USERS}/${id}`, { method: "DELETE" });
    setUsers(users.filter((u) => u.id !== id));
  };
  
  // Xoá lịch chiếu
  const handleDeleteShowtime = async (movieId, showtimeId) => {
    const movie = movies.find((m) => m.id === movieId);
    if (!movie) return;
    const updatedShowtimes = movie.showtimes.filter(
      (st) => st.id !== showtimeId
    );
    await fetch(`${API_MOVIES}/${movieId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ showtimes: updatedShowtimes }),
    });
    setMovies(
      movies.map((m) =>
        m.id === movieId ? { ...m, showtimes: updatedShowtimes } : m
      )
    );
    if (selectedMovie && selectedMovie.id === movieId) {
      setSelectedMovie({ ...movie, showtimes: updatedShowtimes });
    }
  };

  // Thêm lịch chiếu
  const handleAddShowtime = async (data) => {
    if (!selectedMovie) return;
    const newShowtime = {
      ...data,
      id: Date.now(),
      price: Number(data.price),
    };
    const updatedShowtimes = [...(selectedMovie.showtimes || []), newShowtime];
    await fetch(`${API_MOVIES}/${selectedMovie.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ showtimes: updatedShowtimes }),
    });
    setMovies(
      movies.map((m) =>
        m.id === selectedMovie.id ? { ...m, showtimes: updatedShowtimes } : m
      )
    );
    setSelectedMovie({ ...selectedMovie, showtimes: updatedShowtimes });
  };

  // Sửa lịch chiếu
  const handleEditShowtime = async (data) => {
    if (!selectedMovie) return;
    const updatedShowtimes = selectedMovie.showtimes.map((st) =>
      st.id === editShowtimeId
        ? { ...st, ...data, price: Number(data.price) }
        : st
    );
    await fetch(`${API_MOVIES}/${selectedMovie.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ showtimes: updatedShowtimes }),
    });
    setMovies(
      movies.map((m) =>
        m.id === selectedMovie.id ? { ...m, showtimes: updatedShowtimes } : m
      )
    );
    setSelectedMovie({ ...selectedMovie, showtimes: updatedShowtimes });
    setEditShowtimeId(null);
  };

  const totalShowtimes = movies.reduce(
    (sum, mv) => sum + (mv.showtimes ? mv.showtimes.length : 0),
    0
  );

  const bookingStats = movies.map((mv) => ({
    name: mv.title,
    bookings: bookings.filter((bk) => bk.movieId === mv.id).length,
  }));

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f7f9fd 0%, #eef2fa 100%)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Header admin riêng */}
      <AdminHeader />

      {/* Tabs */}
      <div style={{ textAlign: "center", margin: "24px 0" }}>
        <button
          onClick={() => {
            setTab("dashboard");
            setSelectedMovie(null);
          }}
          style={tabBtnStyle(tab === "dashboard")}
        >
          Tổng quan
        </button>
        <button
          onClick={() => {
            setTab("movies");
            setSelectedMovie(null);
          }}
          style={tabBtnStyle(tab === "movies")}
        >
          Quản lý phim
        </button>
        <button
          onClick={() => {
            setTab("showtimes");
            setSelectedMovie(null);
          }}
          style={tabBtnStyle(tab === "showtimes")}
        >
          Lịch chiếu
        </button>
        <button
          onClick={() => setTab("users")}
          style={tabBtnStyle(tab === "users")}
        >
          Quản lý user
        </button>
        <button
          onClick={() => setTab("bookings")}
          style={tabBtnStyle(tab === "bookings")}
        >
          Quản lý lượt đặt
        </button>
        <button
          onClick={() => navigate("/home")}
          style={tabBtnStyle(false, true)}
        >
          Trang người dùng
        </button>
      </div>


      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Thống kê tổng quan */}
        {tab === "dashboard" && (
          <div
            style={{
              display: "flex",
              gap: 28,
              justifyContent: "center",
              marginBottom: 38,
              flexWrap: "wrap",
            }}
          >
            <div className="admin-stat" style={statBoxStyle}>
              <span role="img" aria-label="movie" style={{ fontSize: 28 }}>
                🎬
              </span>
              <div style={{ fontSize: 32, fontWeight: 700 }}>
                {movies.length}
              </div>
              <div>Phim</div>
            </div>
            <div className="admin-stat" style={statBoxStyle}>
              <span role="img" aria-label="cal" style={{ fontSize: 28 }}>
                📅
              </span>
              <div style={{ fontSize: 32, fontWeight: 700 }}>
                {totalShowtimes}
              </div>
              <div>Lịch chiếu</div>
            </div>
            <div className="admin-stat" style={statBoxStyle}>
              <span role="img" aria-label="user" style={{ fontSize: 28 }}>
                👤
              </span>
              <div style={{ fontSize: 32, fontWeight: 700 }}>
                {users.length}
              </div>
              <div>Thành viên</div>
            </div>
            <div className="admin-stat" style={statBoxStyle}>
              <span role="img" aria-label="booking" style={{ fontSize: 28 }}>
                🎟️
              </span>
              <div style={{ fontSize: 32, fontWeight: 700 }}>
                {bookings.length}
              </div>
              <div>Lượt đặt</div>
            </div>
          </div>

      <div style={{maxWidth: 1200, margin: "0 auto"}}>
        {/* Thống kê tổng quan + Biểu đồ */}
        {tab === "dashboard" && (
          <>
            <div style={{display: "flex", gap: 28, justifyContent: "center", marginBottom: 38, flexWrap: "wrap"}}>
              <div className="admin-stat" style={statBoxStyle}>
                <span role="img" aria-label="movie" style={{fontSize: 28}}>🎬</span>
                <div style={{fontSize: 32, fontWeight: 700}}>{movies.length}</div>
                <div>Phim</div>
              </div>
              <div className="admin-stat" style={statBoxStyle}>
                <span role="img" aria-label="cal" style={{fontSize: 28}}>📅</span>
                <div style={{fontSize: 32, fontWeight: 700}}>{totalShowtimes}</div>
                <div>Lịch chiếu</div>
              </div>
              <div className="admin-stat" style={statBoxStyle}>
                <span role="img" aria-label="user" style={{fontSize: 28}}>👤</span>
                <div style={{fontSize: 32, fontWeight: 700}}>{users.length}</div>
                <div>Thành viên</div>
              </div>
            </div>
            {/* --- Biểu đồ thống kê --- */}
            <div style={{display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center"}}>
              {/* Biểu đồ cột: Số phim theo thể loại */}
              <div style={{
                background: "#fff", borderRadius: 18, boxShadow: "0 2px 18px #8b93b320",
                padding: 18, width: 430, minWidth: 340, height: 350
              }}>
                <h4 style={{marginBottom: 10, fontWeight: 600}}>Phim theo thể loại</h4>
                <ResponsiveContainer width="100%" height={270}>
                  <BarChart data={genreChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="genre" tick={{fontSize: 14}} />
                    <YAxis allowDecimals={false}/>
                    <Tooltip />
                    <Bar dataKey="count" fill="#764ba2" barSize={36} radius={[8,8,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {/* Biểu đồ tròn: Tỷ lệ phim theo rating */}
              <div style={{
                background: "#fff", borderRadius: 18, boxShadow: "0 2px 18px #8b93b320",
                padding: 18, width: 350, minWidth: 280, height: 350
              }}>
                <h4 style={{marginBottom: 10, fontWeight: 600}}>Tỷ lệ phim theo rating</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={ratingChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      innerRadius={45}
                      label={({name, percent}) => `${name} (${(percent*100).toFixed(0)}%)`}
                    >
                      {ratingChartData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={ratingColors[idx % ratingColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={28}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>

        )}

        {/* Quản lý phim */}
        {tab === "movies" && (
          <div>
            <div
              style={{
                marginBottom: 18,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3 style={{ margin: 0 }}>Danh sách phim</h3>
              <button
                style={{
                  background: "#22c55e",
                  color: "#fff",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: 8,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: 16,
                }}
                onClick={() => navigate("/create-movie")}
              >
                <PlusCircle size={18} style={{ marginRight: 6 }} /> Thêm phim
                mới
              </button>
            </div>

            <table
              className="table table-bordered"
              style={{
                background: "#fff",
                borderRadius: 10,
                overflow: "hidden",
                width: "100%",
              }}
            >
              <thead style={{ background: "#f2f2f2" }}>

            {/* --- Bộ lọc --- */}
            <div style={{
              margin: "10px 0 20px 0",
              display: "flex",
              flexWrap: "wrap",
              gap: 18,
              alignItems: "center"
            }}>
              {/* Lọc theo thể loại */}
              <div style={{display: "flex", alignItems: "center", gap: 10}}>
                <b style={{marginRight: 6}}>Thể loại:</b>
                {allGenres.map((genre) => (
                  <label key={genre} style={{
                    display: "inline-flex", alignItems: "center",
                    fontWeight: 400, background: "#f2f3f7", borderRadius: 8, padding: "4px 10px", margin: "2px 6px 2px 0"
                  }}>
                    <input
                      type="checkbox"
                      value={genre}
                      checked={selectedGenres.includes(genre)}
                      onChange={() => handleToggleGenre(genre)}
                      style={{marginRight: 5}}
                    />
                    {genre}
                  </label>
                ))}
                {selectedGenres.length > 0 && (
                  <button
                    style={{
                      marginLeft: 10, padding: "3px 10px", borderRadius: 8,
                      border: "none", background: "#e7e7e7", color: "#333", cursor: "pointer"
                    }}
                    onClick={() => setSelectedGenres([])}
                  >
                    Xoá lọc
                  </button>
                )}
              </div>
              {/* Lọc rating */}
              <div style={{display: "flex", alignItems: "center", gap: 8}}>
                <b>Rating:</b>
                <select
                  value={minRating}
                  onChange={e => setMinRating(e.target.value)}
                  style={{padding: "3px 10px", borderRadius: 8, border: "1px solid #eee", outline: "none"}}
                >
                  <option value="">Tất cả</option>
                  <option value="5">Từ 5+</option>
                  <option value="6">Từ 6+</option>
                  <option value="7">Từ 7+</option>
                  <option value="8">Từ 8+</option>
                  <option value="9">Từ 9+</option>
                </select>
                {minRating && (
                  <button
                    style={{
                      marginLeft: 8, padding: "3px 10px", borderRadius: 8,
                      border: "none", background: "#e7e7e7", color: "#333", cursor: "pointer"
                    }}
                    onClick={() => setMinRating("")}
                  >
                    Xoá lọc
                  </button>
                )}
              </div>
              {/* Tìm kiếm tên phim */}
              <div style={{display: "flex", alignItems: "center", gap: 8}}>
                <b>Tìm tên:</b>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Nhập tên phim..."
                  style={{
                    borderRadius: 8,
                    border: "1px solid #eee",
                    padding: "4px 12px",
                    minWidth: 180,
                    outline: "none"
                  }}
                />
                {searchTerm && (
                  <button
                    style={{
                      marginLeft: 2, padding: "3px 8px", borderRadius: 8,
                      border: "none", background: "#e7e7e7", color: "#333", cursor: "pointer"
                    }}
                    onClick={() => setSearchTerm("")}
                  >
                    Xoá
                  </button>
                )}
              </div>
            </div>
            {/* --- Kết thúc bộ lọc --- */}

            <table className="table table-bordered" style={{background: "#fff", borderRadius: 10, overflow: "hidden", width: "100%"}}>
              <thead style={{background: "#f2f2f2"}}>

                <tr>
                  <th>#</th>
                  <th>Poster</th>
                  <th>Tên phim</th>
                  <th>Thể loại</th>
                  <th>Thời lượng</th>
                  <th>Rating</th>
                  <th>Lịch chiếu</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredMovies.map((mv, i) => (
                  <tr key={mv.id}>
                    <td>{i + 1}</td>
                    <td>
                      <img
                        src={mv.poster}
                        alt=""
                        style={{ width: 60, borderRadius: 6 }}
                      />
                    </td>
                    <td>{mv.title}</td>
                    <td>{mv.genre}</td>
                    <td>{mv.duration}</td>
                    <td>{mv.rating}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-info"
                        onClick={() => {
                          setTab("showtimes");
                          setSelectedMovie(mv);
                          setEditShowtimeId(null);
                        }}
                        style={{ fontWeight: 500, borderRadius: 8 }}
                      >
                        <List size={15} /> Xem (
                        {mv.showtimes ? mv.showtimes.length : 0})
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        style={{ marginRight: 6 }}
                        onClick={() => handleDeleteMovie(mv.id)}
                      >
                        <Trash2 size={18} /> Xoá
                      </button>
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => navigate(`/edit-movie/${mv.id}`)}
                      >
                        <Edit size={18} /> Sửa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Quản lý lịch chiếu */}
        {tab === "showtimes" && (
          <div>
            <div
              style={{
                marginBottom: 18,
                display: "flex",
                alignItems: "center",
              }}
            >
              {selectedMovie && (
                <button
                  onClick={() => setSelectedMovie(null)}
                  style={{
                    marginRight: 14,
                    background: "#ececec",
                    border: "none",
                    borderRadius: 6,
                    padding: "6px 12px",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  ← Danh sách phim
                </button>
              )}
              <h3 style={{ margin: 0 }}>
                Lịch chiếu {selectedMovie ? `"${selectedMovie.title}"` : ""}
              </h3>
            </div>
            {!selectedMovie ? (
              <ul>
                {movies.map((mv, i) => (
                  <li key={mv.id} style={{ marginBottom: 6 }}>
                    <button
                      onClick={() => {
                        setSelectedMovie(mv);
                        setEditShowtimeId(null);
                      }}
                      style={{
                        background: "#667eea",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        padding: "8px 18px",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {mv.title}
                    </button>
                    <span style={{ marginLeft: 14, color: "#888" }}>
                      ({mv.showtimes?.length || 0} suất chiếu)
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <>
                <div style={{ marginBottom: 8, marginTop: 10 }}>
                  <b>Thêm lịch chiếu mới:</b>
                  <ShowtimeForm onSubmit={handleAddShowtime} />
                </div>
                <table
                  className="table table-bordered"
                  style={{
                    background: "#fff",
                    borderRadius: 10,
                    overflow: "hidden",
                    width: "100%",
                  }}
                >
                  <thead style={{ background: "#f2f2f2" }}>
                    <tr>
                      <th>#</th>
                      <th>Ngày</th>
                      <th>Giờ</th>
                      <th>Rạp</th>
                      <th>Giá vé</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedMovie.showtimes &&
                    selectedMovie.showtimes.length > 0 ? (
                      selectedMovie.showtimes.map((st, idx) => (
                        <tr key={st.id}>
                          <td>{idx + 1}</td>
                          {editShowtimeId === st.id ? (
                            <td colSpan={5}>
                              <ShowtimeForm
                                initial={st}
                                onSubmit={(d) => handleEditShowtime(d)}
                                onCancel={() => setEditShowtimeId(null)}
                              />
                            </td>
                          ) : (
                            <>
                              <td>{st.date}</td>
                              <td>{st.time}</td>
                              <td>{st.cinema}</td>
                              <td>{parseInt(st.price).toLocaleString()}đ</td>
                              <td>
                                <button
                                  className="btn btn-sm btn-warning me-2"
                                  onClick={() => setEditShowtimeId(st.id)}
                                >
                                  Sửa
                                </button>
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() =>
                                    handleDeleteShowtime(
                                      selectedMovie.id,
                                      st.id
                                    )
                                  }
                                >
                                  Xoá
                                </button>
                              </td>
                            </>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} style={{ textAlign: "center" }}>
                          Chưa có lịch chiếu
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </>
            )}
          </div>
        )}

        {/* Quản lý user */}
        {tab === "users" && (
          <div>
            <h3>Danh sách thành viên</h3>
            <table
              className="table table-bordered"
              style={{
                background: "#fff",
                borderRadius: 10,
                overflow: "hidden",
                width: "100%",
              }}
            >
              <thead style={{ background: "#f2f2f2" }}>
                <tr>
                  <th>#</th>
                  <th>Tên đăng nhập</th>
                  <th>Email</th>
                  <th>Họ tên</th>
                  <th>Điện thoại</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u.id}>
                    <td>{i + 1}</td>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    <td>
                      {u.firstname} {u.lastname}
                    </td>
                    <td>{u.phone}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteUser(u.id)}
                      >
                        <Trash2 size={18} /> Xoá
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Quản lý lượt đặt */}
        {tab === "bookings" && (
          <div>
            <h3>Danh sách lượt đặt vé</h3>

            <div
              style={{
                width: "100%",
                height: 320,
                background: "#fff",
                borderRadius: 18,
                padding: 24,
                boxShadow: "0 2px 18px #8b93b320",
                marginBottom: 22,
              }}
            >
              <h4 style={{ marginBottom: 16 }}>Thống kê lượt đặt theo phim</h4>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={bookingStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="bookings" fill="green" name="Lượt đặt" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Kết thúc biểu đồ */}

            <table
              className="table table-bordered"
              style={{
                background: "#fff",
                borderRadius: 10,
                overflow: "hidden",
                width: "100%",
              }}
            >
              <thead style={{ background: "#f2f2f2" }}>
                <tr>
                  <th>Stt</th>
                  <th>Người Dùng</th>
                  <th>Phim</th>
                  <th>Ghế</th>
                  <th>Combo</th>
                  <th>Tổng tiền</th>
                  <th>Thời gian</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, i) => {
                  const user = users.find((u) => u.id === b.userId);
                  const movie = movies.find((m) => m.id === b.movieId);
                  return (
                    <tr key={b.id}>
                      <td>{i + 1}</td>
                      <td>
                        {user
                          ? `${user.firstname} ${user.lastname} (${user.username})`
                          : b.userId}
                      </td>
                      <td>{movie ? movie.title : b.movieId}</td>
                      <td>{b.seats ? b.seats.join(", ") : ""}</td>
                      <td>
                        {b.combo && b.combo.length ? b.combo.join(", ") : "—"}
                      </td>
                      <td>{b.total.toLocaleString()}đ</td>
                      <td>
                        {b.time && new Date(b.time).toLocaleString("vi-VN")}
                      </td>
                      <td>{b.status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// CSS inline cho box thống kê và button tab
const statBoxStyle = {
  background: "#fff",
  borderRadius: 18,
  minWidth: 170,
  padding: "24px 22px 10px 22px",
  boxShadow: "0 2px 18px #8b93b320",
  textAlign: "center",
};
const tabBtnStyle = (active, accent) => ({
  background: active ? "#764ba2" : accent ? "#e0e7ef" : "#fff",
  color: active ? "#fff" : accent ? "#333" : "#764ba2",
  fontWeight: 600,
  border: "1px solid #eee",
  borderRadius: 8,
  padding: "8px 20px",
  margin: "0 6px",
  fontSize: 16,
  boxShadow: active ? "0 2px 8px #764ba220" : "none",
  cursor: "pointer",
  outline: "none",
});
