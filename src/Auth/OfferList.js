import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./OfferList.css";
import Header from "../Header/Header";
import Footer from "../Component/Footer"

const OfferList = () => {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:9999/Offers")
      .then((res) => res.json())
      .then((data) => {
        console.log("Dữ liệu ưu đãi từ server:", data);
        setOffers(data);
      })
      .catch((error) => console.error("Lỗi khi tải ưu đãi:", error));
  }, []);

  return (
    <div>
      <Header />
      <div className="title">
        <h4>ƯU ĐÃI</h4>
      </div>

      <div className="offer-container">
        {/* Danh sách ưu đãi */}
        <section className="offers-section">
          {offers.length === 0 ? (
            <p className="loading-message">Đang tải ưu đãi...</p>
          ) : (
            <div className="offers-grid">
              {offers.map((offer) => {
                console.log("URL ảnh đang render:", offer.image);

                return (
                  <Link
                    to={`/offer/${offer.id}`}
                    key={offer.id}
                    className="offer-image-link"
                  >
                    <img
                      src={offer.image}
                      alt={offer.title}
                      className="offer-image"
                      onError={(e) => {
                        console.warn("Không load được ảnh:", offer.image);
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/300x200?text=Ảnh+Không+Tồn+Tại";
                      }}
                    />
                    <div className="offer-overlay">
                      <span className="offer-title">{offer.title}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default OfferList;
