import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./OfferDetail.css";
import Header from "../Header/Header";
import Footer from "../Component/Footer"

const OfferDetail = () => {
  const { id } = useParams();
  const [offer, setOffer] = useState(null);

  useEffect(() => {
    fetch("http://localhost:9999/Offers") // hoặc "/database.json" nếu dùng import tĩnh
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((o) => String(o.id) === id); // vì fake server trả về mảng
        setOffer(found);
      })
      .catch((error) => {
        console.error("Lỗi khi tải ưu đãi:", error);
      });
  }, [id]);

  if (!offer)
    return <div className="offer-not-found">Không tìm thấy ưu đãi.</div>;

  return (
    <div>
      <Header />
      <div className="title">
        <h4>CHI TIẾT ƯU ĐÃI</h4>
      </div>

      <div className="offer-detail-content">
        <img
          src={offer.image}
          alt={offer.title}
          className="offer-detail-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://via.placeholder.com/600x300?text=Ảnh+không+tồn+tại";
          }}
        />

        <div className="offer-detail-info">
          <h2>{offer.title}</h2>

          <div className="offer-detail-section">
            <h3>Mô tả ưu đãi:</h3>
            <p>{offer.description}</p>
          </div>

          <div className="offer-detail-section">
            <h3>Giá trị ưu đãi:</h3>
            <div className="discount-badge-large">{offer.discount}</div>
          </div>

          <div className="offer-detail-section">
            <h3>Hạn sử dụng:</h3>
            <p className="valid-date">{offer.validUntil}</p>
          </div>
        </div>

        <Link to="/offerlist" className="back-button">
          ← Quay lại danh sách ưu đãi
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default OfferDetail;
