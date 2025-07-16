import React from "react";
import "./CinemaFooter.css"; // Nếu bạn muốn thêm CSS tùy chỉnh

const CinemaFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light pt-5 mt-5">
      <div className="container">
        <div className="row">
          {/* Thương hiệu */}
          <div className="col-md-3 mb-4">
            <h5 className="text-uppercase text-danger mb-3">🎬 Cinema</h5>
            <p>
              Đặt vé trực tuyến tại hệ thống rạp chiếu phim hiện đại bậc nhất Việt Nam.
            </p>
          </div>

          {/* Liên kết nhanh */}
          <div className="col-md-3 mb-4">
            <h6 className="text-uppercase mb-3">Liên kết nhanh</h6>
            <ul className="list-unstyled">
              <li><a href="#" className="text-light text-decoration-none">Phim đang chiếu</a></li>
              <li><a href="#" className="text-light text-decoration-none">Phim sắp chiếu</a></li>
              <li><a href="#" className="text-light text-decoration-none">Lịch chiếu</a></li>
              <li><a href="#" className="text-light text-decoration-none">Ưu đãi</a></li>
              <li><a href="#" className="text-light text-decoration-none">Thành viên</a></li>
            </ul>
          </div>

          {/* Hỗ trợ khách hàng */}
          <div className="col-md-3 mb-4">
            <h6 className="text-uppercase mb-3">Hỗ trợ khách hàng</h6>
            <ul className="list-unstyled">
              <li><a href="#" className="text-light text-decoration-none">Hướng dẫn đặt vé</a></li>
              <li><a href="#" className="text-light text-decoration-none">Câu hỏi thường gặp</a></li>
              <li><a href="#" className="text-light text-decoration-none">Chính sách bảo mật</a></li>
              <li><a href="#" className="text-light text-decoration-none">Điều khoản sử dụng</a></li>
            </ul>
          </div>

          {/* Liên hệ */}
          <div className="col-md-3 mb-4">
            <h6 className="text-uppercase mb-3">Liên hệ</h6>
            <ul className="list-unstyled">
              <li>📍 Đại học FPT Hà Nội</li>
              <li>📞 1900 1234</li>
              <li>📧 support@cinema.com</li>
              <li>🕒 Hỗ trợ 24/7</li>
            </ul>
          </div>
        </div>

        <hr className="border-secondary" />

        {/* Các điểm nổi bật */}
        <div className="row text-center text-md-start">
          <div className="col-md-3 mb-3">
            ⭐ Chất lượng 4K & Dolby Atmos
          </div>
          <div className="col-md-3 mb-3">
            🔐 Bảo mật thông tin cá nhân
          </div>
          <div className="col-md-3 mb-3">
            👥 Hỗ trợ khách hàng chuyên nghiệp
          </div>
          <div className="col-md-3 mb-3">
            📱 Có ứng dụng trên iOS & Android
          </div>
        </div>

        <hr className="border-secondary" />

        {/* Bản quyền & thông tin cuối */}
        <div className="row">
          <div className="col-md-12 text-center text-md-start mb-2 mb-md-0">
            © {currentYear} Cinema
          </div>
        </div>
      </div>
    </footer>
  );
};

export default CinemaFooter;
