import React, { useState } from "react";

export default function ShowtimeForm({ onSubmit, initial, onCancel }) {
  const [showtime, setShowtime] = useState(
    initial || { time: "", date: "", cinema: "", price: "" }
  );

  const handleChange = (e) => {
    setShowtime({ ...showtime, [e.target.name]: e.target.value });
  };

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSubmit(showtime);
      }}
      className="row g-2 align-items-center"
      style={{ margin: "8px 0" }}
    >
      <div className="col-2"><input name="date" type="date" className="form-control" value={showtime.date} onChange={handleChange} required /></div>
      <div className="col-2"><input name="time" placeholder="Giờ" className="form-control" value={showtime.time} onChange={handleChange} required /></div>
      <div className="col-4"><input name="cinema" placeholder="Rạp" className="form-control" value={showtime.cinema} onChange={handleChange} required /></div>
      <div className="col-2"><input name="price" placeholder="Giá" type="number" className="form-control" value={showtime.price} onChange={handleChange} required /></div>
      <div className="col-2 d-flex gap-1">
        <button className="btn btn-success btn-sm" type="submit">{initial ? "Lưu" : "Thêm"}</button>
        {onCancel && (
          <button className="btn btn-secondary btn-sm" type="button" onClick={onCancel}>Huỷ</button>
        )}
      </div>
    </form>
  );
}
