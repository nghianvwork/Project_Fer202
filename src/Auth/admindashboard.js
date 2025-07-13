import React, { useEffect, useState } from "react";
import { Trash2, Edit, PlusCircle, List } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ShowtimeForm from "./ShowtimeForm";
import AdminHeader from "../Header/AdminHeader";

const API_MOVIES = "http://localhost:9999/moviesData";
const API_USERS = "http://localhost:9999/users";

export default function AdminDashboard() {
  const [movies, setMovies] = useState([]);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState("dashboard");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [editShowtimeId, setEditShowtimeId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      const [mv, us] = await Promise.all([
        fetch(API_MOVIES).then(r => r.json()),
        fetch(API_USERS).then(r => r.json()),
      ]);
      setMovies(mv);
      setUsers(us);
    };
    fetchAll();
  }, []);

  // Xoá phim
  const handleDeleteMovie = async (id) => {
    if (!window.confirm("Xác nhận xoá phim này?")) return;
    await fetch(`${API_MOVIES}/${id}`, { method: "DELETE" });
    setMovies(movies.filter(m => m.id !== id));
    if (selectedMovie && selectedMovie.id === id) setSelectedMovie(null);
  };

  // Xoá user
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Xác nhận xoá tài khoản này?")) return;
    await fetch(`${API_USERS}/${id}`, { method: "DELETE" });
    setUsers(users.filter(u => u.id !== id));
  };

  // Xoá lịch chiếu
  const handleDeleteShowtime = async (movieId, showtimeId) => {
    const movie = movies.find(m => m.id === movieId);
    if (!movie) return;
    const updatedShowtimes = movie.showtimes.filter(st => st.id !== showtimeId);
    await fetch(`${API_MOVIES}/${movieId}`, {
      method: "PATCH",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ showtimes: updatedShowtimes })
    });
    setMovies(movies.map(m => m.id === movieId ? {...m, showtimes: updatedShowtimes} : m));
    if (selectedMovie && selectedMovie.id === movieId) {
      setSelectedMovie({...movie, showtimes: updatedShowtimes});
    }
  };

  // Thêm lịch chiếu
  const handleAddShowtime = async (data) => {
    if (!selectedMovie) return;
    const newShowtime = {
      ...data,
      id: Date.now(),
      price: Number(data.price)
    };
    const updatedShowtimes = [...(selectedMovie.showtimes || []), newShowtime];
    await fetch(`${API_MOVIES}/${selectedMovie.id}`, {
      method: "PATCH",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ showtimes: updatedShowtimes })
    });
    setMovies(movies.map(m =>
      m.id === selectedMovie.id ? { ...m, showtimes: updatedShowtimes } : m
    ));
    setSelectedMovie({ ...selectedMovie, showtimes: updatedShowtimes });
  };

  // Sửa lịch chiếu
  const handleEditShowtime = async (data) => {
    if (!selectedMovie) return;
    const updatedShowtimes = selectedMovie.showtimes.map(st =>
      st.id === editShowtimeId ? { ...st, ...data, price: Number(data.price) } : st
    );
    await fetch(`${API_MOVIES}/${selectedMovie.id}`, {
      method: "PATCH",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ showtimes: updatedShowtimes })
    });
    setMovies(movies.map(m =>
      m.id === selectedMovie.id ? { ...m, showtimes: updatedShowtimes } : m
    ));
    setSelectedMovie({ ...selectedMovie, showtimes: updatedShowtimes });
    setEditShowtimeId(null);
  };

  const totalShowtimes = movies.reduce((sum, mv) => sum + (mv.showtimes ? mv.showtimes.length : 0), 0);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f7f9fd 0%, #eef2fa 100%)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      {/* Header admin riêng */}
      <AdminHeader />

      {/* Tabs */}
      <div style={{textAlign: "center", margin: "24px 0"}}>
        <button onClick={() => {setTab("dashboard"); setSelectedMovie(null);}} style={tabBtnStyle(tab === "dashboard")}>Tổng quan</button>
        <button onClick={() => {setTab("movies"); setSelectedMovie(null);}} style={tabBtnStyle(tab === "movies")}>Quản lý phim</button>
        <button onClick={() => {setTab("showtimes"); setSelectedMovie(null);}} style={tabBtnStyle(tab === "showtimes")}>Lịch chiếu</button>
        <button onClick={() => setTab("users")} style={tabBtnStyle(tab === "users")}>Quản lý user</button>
        <button onClick={() => navigate("/home")} style={tabBtnStyle(false, true)}>Trang người dùng</button>
      </div>

      <div style={{maxWidth: 1200, margin: "0 auto"}}>
        {/* Thống kê tổng quan */}
        {tab === "dashboard" && (
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
        )}

        {/* Quản lý phim */}
        {tab === "movies" && (
          <div>
            <div style={{marginBottom: 18, display: "flex", justifyContent: "space-between", alignItems: "center"}}>
              <h3 style={{margin: 0}}>Danh sách phim</h3>
              <button
                style={{background: "#22c55e", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 16}}
                onClick={() => navigate("/create-movie")}
              >
                <PlusCircle size={18} style={{marginRight: 6}} /> Thêm phim mới
              </button>
            </div>
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
                {movies.map((mv, i) => (
                  <tr key={mv.id}>
                    <td>{i + 1}</td>
                    <td><img src={mv.poster} alt="" style={{width: 60, borderRadius: 6}} /></td>
                    <td>{mv.title}</td>
                    <td>{mv.genre}</td>
                    <td>{mv.duration}</td>
                    <td>{mv.rating}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-info"
                        onClick={() => { setTab("showtimes"); setSelectedMovie(mv); setEditShowtimeId(null); }}
                        style={{fontWeight: 500, borderRadius: 8}}
                      >
                        <List size={15} /> Xem ({mv.showtimes ? mv.showtimes.length : 0})
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        style={{marginRight: 6}}
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
            <div style={{marginBottom: 18, display: "flex", alignItems: "center"}}>
              {selectedMovie && (
                <button onClick={() => setSelectedMovie(null)} style={{
                  marginRight: 14, background: "#ececec", border: "none", borderRadius: 6, padding: "6px 12px", fontWeight: 500, cursor: "pointer"
                }}>← Danh sách phim</button>
              )}
              <h3 style={{margin: 0}}>
                Lịch chiếu {selectedMovie ? `"${selectedMovie.title}"` : ""}
              </h3>
            </div>
            {!selectedMovie ? (
              <ul>
                {movies.map((mv, i) => (
                  <li key={mv.id} style={{marginBottom: 6}}>
                    <button onClick={() => {setSelectedMovie(mv); setEditShowtimeId(null);}} style={{
                      background: "#667eea", color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", fontWeight: 600, cursor: "pointer"
                    }}>{mv.title}</button>
                    <span style={{marginLeft: 14, color: "#888"}}>({mv.showtimes?.length || 0} suất chiếu)</span>
                  </li>
                ))}
              </ul>
            ) : (
              <>
                <div style={{marginBottom: 8, marginTop: 10}}>
                  <b>Thêm lịch chiếu mới:</b>
                  <ShowtimeForm onSubmit={handleAddShowtime} />
                </div>
                <table className="table table-bordered" style={{background: "#fff", borderRadius: 10, overflow: "hidden", width: "100%"}}>
                  <thead style={{background: "#f2f2f2"}}>
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
                    {selectedMovie.showtimes && selectedMovie.showtimes.length > 0 ? (
                      selectedMovie.showtimes.map((st, idx) => (
                        <tr key={st.id}>
                          <td>{idx + 1}</td>
                          {editShowtimeId === st.id ? (
                            <td colSpan={5}>
                              <ShowtimeForm
                                initial={st}
                                onSubmit={d => handleEditShowtime(d)}
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
                                <button className="btn btn-sm btn-warning me-2"
                                  onClick={() => setEditShowtimeId(st.id)}>Sửa</button>
                                <button className="btn btn-sm btn-danger"
                                  onClick={() => handleDeleteShowtime(selectedMovie.id, st.id)}
                                >Xoá</button>
                              </td>
                            </>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={6} style={{textAlign: "center"}}>Chưa có lịch chiếu</td></tr>
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
            <table className="table table-bordered" style={{background: "#fff", borderRadius: 10, overflow: "hidden", width: "100%"}}>
              <thead style={{background: "#f2f2f2"}}>
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
                    <td>{u.firstname} {u.lastname}</td>
                    <td>{u.phone}</td>
                    <td>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDeleteUser(u.id)}>
                        <Trash2 size={18}/> Xoá
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const statBoxStyle = {
  background: "#fff",
  borderRadius: 18,
  minWidth: 170,
  padding: "24px 22px 10px 22px",
  boxShadow: "0 2px 18px #8b93b320",
  textAlign: "center"
};
const tabBtnStyle = (active, accent) => ({
  background: active ? "#764ba2" : (accent ? "#e0e7ef" : "#fff"),
  color: active ? "#fff" : (accent ? "#333" : "#764ba2"),
  fontWeight: 600,
  border: "1px solid #eee",
  borderRadius: 8,
  padding: "8px 20px",
  margin: "0 6px",
  fontSize: 16,
  boxShadow: active ? "0 2px 8px #764ba220" : "none",
  cursor: "pointer",
  outline: "none"
});
