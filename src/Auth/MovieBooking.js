import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, Clock, ArrowLeft, Calendar, MapPin, CreditCard, User, Phone, Mail } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

const BookingMovie = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', email: '' });
  const [showQR, setShowQR] = useState(false);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:9999/moviesData/${id}`)
      .then(res => res.json())
      .then(data => setSelectedMovie(data))
      .finally(() => setLoading(false));
  }, [id]);

  const generateSeats = () => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const seatsPerRow = 10;
    const seats = [];
    const occupiedSeats = ['A3', 'A4', 'B5', 'C7', 'D2', 'D8', 'E6', 'F4', 'F5'];
    rows.forEach(row => {
      for (let i = 1; i <= seatsPerRow; i++) {
        const seatId = `${row}${i}`;
        seats.push({
          id: seatId,
          occupied: occupiedSeats.includes(seatId),
          selected: selectedSeats.includes(seatId)
        });
      }
    });
    return seats;
  };

  const handleSeatClick = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const totalAmount = selectedSeats.length * (selectedShowtime?.price || 0);

  const handleNextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedShowtime !== null;
      case 2: return selectedSeats.length > 0;
      case 3: return customerInfo.name && customerInfo.phone && customerInfo.email;
      case 4: return true;
      default: return false;
    }
  };

  // Hàm xử lý hoàn thành đặt vé
  const handleBookingSuccess = () => {
    setSuccess(true);
    setTimeout(() => {
      navigate('/home'); // hoặc "/" tùy trang chủ của bạn
    }, 1500);
  };

  // ==== Render UI từng bước ====
  const renderStepIndicator = () => (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '32px',
      padding: '0 16px'
    }}>
      {[1, 2, 3, 4].map(step => (
        <div key={step} style={{
          display: 'flex',
          alignItems: 'center',
          flex: 1,
          maxWidth: '200px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: currentStep >= step ? '#ef4444' : '#374151',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            {step}
          </div>
          <div style={{
            marginLeft: '8px',
            fontSize: '14px',
            color: currentStep >= step ? '#ef4444' : '#9ca3af'
          }}>
            {step === 1 && 'Chọn suất'}
            {step === 2 && 'Chọn ghế'}
            {step === 3 && 'Thông tin'}
            {step === 4 && 'Thanh toán'}
          </div>
          {step < 4 && (
            <div style={{
              flex: 1,
              height: '2px',
              backgroundColor: currentStep > step ? '#ef4444' : '#374151',
              margin: '0 16px'
            }} />
          )}
        </div>
      ))}
    </div>
  );

  const renderMovieInfo = () => {
    if (!selectedMovie) return <div>Đang tải thông tin phim...</div>;
    return (
      <div style={{
        backgroundColor: '#1a1a2e',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px',
        display: 'flex',
        gap: '20px'
      }}>
        <img
          src={selectedMovie.poster}
          alt={selectedMovie.title}
          style={{ width: '120px', height: '180px', objectFit: 'cover', borderRadius: '8px' }}
        />
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>{selectedMovie.title}</h2>
          <p style={{ color: '#9ca3af', marginBottom: '8px' }}>{selectedMovie.genre}</p>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '8px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Star size={16} color="#facc15" />{selectedMovie.rating}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={16} />{selectedMovie.duration}
            </span>
          </div>
          <p style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '4px' }}>
            <strong>Mô tả:</strong> {selectedMovie.description}
          </p>
        </div>
      </div>
    );
  };

  const renderShowtimeSelection = () => (
    <div>
      <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>Chọn suất chiếu</h3>
      {selectedMovie && selectedMovie.showtimes && selectedMovie.showtimes.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px'
        }}>
          {selectedMovie.showtimes.map(showtime => (
            <div
              key={showtime.id}
              onClick={() => setSelectedShowtime(showtime)}
              style={{
                backgroundColor: selectedShowtime?.id === showtime.id ? '#ef4444' : '#374151',
                borderRadius: '8px',
                padding: '16px',
                cursor: 'pointer',
                border: '2px solid',
                borderColor: selectedShowtime?.id === showtime.id ? '#ef4444' : 'transparent',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Calendar size={16} />
                <span>{showtime.time}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <MapPin size={16} />
                <span>{showtime.cinema}</span>
              </div>
              <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                {formatCurrency(showtime.price)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ color: "#f87171", marginTop: 24, fontWeight: 500 }}>
          Không có suất chiếu nào cho phim này!
        </div>
      )}
    </div>
  );

  const renderSeatSelection = () => (
    <div>
      <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>Chọn ghế</h3>
      <div style={{ marginBottom: '24px' }}>
        <div style={{
          backgroundColor: '#374151',
          borderRadius: '8px',
          padding: '8px',
          textAlign: 'center',
          marginBottom: '16px'
        }}>
          MÀN HÌNH
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(10, 1fr)',
          gap: '8px',
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          {generateSeats().map(seat => (
            <div
              key={seat.id}
              onClick={() => !seat.occupied && handleSeatClick(seat.id)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: seat.occupied ? 'not-allowed' : 'pointer',
                backgroundColor: seat.occupied ? '#6b7280' :
                  selectedSeats.includes(seat.id) ? '#ef4444' : '#374151',
                color: '#fff',
                transition: 'all 0.2s'
              }}
            >
              {seat.id}
            </div>
          ))}
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '24px',
          marginTop: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '16px', height: '16px', backgroundColor: '#374151', borderRadius: '4px' }} />
            <span>Trống</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '16px', height: '16px', backgroundColor: '#ef4444', borderRadius: '4px' }} />
            <span>Đã chọn</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '16px', height: '16px', backgroundColor: '#6b7280', borderRadius: '4px' }} />
            <span>Đã đặt</span>
          </div>
        </div>
      </div>
      {selectedSeats.length > 0 && (
        <div style={{
          backgroundColor: '#1a1a2e',
          borderRadius: '8px',
          padding: '16px',
          marginTop: '16px'
        }}>
          <h4 style={{ marginBottom: '8px' }}>Ghế đã chọn:</h4>
          <p style={{ color: '#9ca3af', marginBottom: '8px' }}>
            {selectedSeats.join(', ')}
          </p>
          <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
            Tổng tiền: {formatCurrency(totalAmount)}
          </p>
        </div>
      )}
    </div>
  );

  const renderCustomerInfo = () => (
    <div>
      <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>Thông tin khách hàng</h3>
      <div style={{
        backgroundColor: '#1a1a2e',
        borderRadius: '8px',
        padding: '20px'
      }}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px' }}>
            <User size={16} style={{ marginRight: '8px' }} />
            Họ và tên
          </label>
          <input
            type="text"
            value={customerInfo.name}
            onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              outline: 'none',
              fontSize: '16px'
            }}
            placeholder="Nhập họ và tên"
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px' }}>
            <Phone size={16} style={{ marginRight: '8px' }} />
            Số điện thoại
          </label>
          <input
            type="tel"
            value={customerInfo.phone}
            onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              outline: 'none',
              fontSize: '16px'
            }}
            placeholder="Nhập số điện thoại"
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px' }}>
            <Mail size={16} style={{ marginRight: '8px' }} />
            Email
          </label>
          <input
            type="email"
            value={customerInfo.email}
            onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              outline: 'none',
              fontSize: '16px'
            }}
            placeholder="Nhập email"
          />
        </div>
      </div>
    </div>
  );

  const renderPayment = () => (
    <div>
      <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>Xác nhận thanh toán</h3>
      <div style={{
        backgroundColor: '#1a1a2e',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '16px'
      }}>
        <h4 style={{ marginBottom: '16px' }}>Thông tin đặt vé</h4>
        <div style={{ marginBottom: '12px' }}>
          <strong>Phim:</strong> {selectedMovie ? selectedMovie.title : ''}
        </div>
        <div style={{ marginBottom: '12px' }}>
          <strong>Suất chiếu:</strong> {selectedShowtime?.time} - {selectedShowtime?.cinema}
        </div>
        <div style={{ marginBottom: '12px' }}>
          <strong>Ghế:</strong> {selectedSeats.join(', ')}
        </div>
        <div style={{ marginBottom: '12px' }}>
          <strong>Khách hàng:</strong> {customerInfo.name}
        </div>
        <div style={{ marginBottom: '12px' }}>
          <strong>Số điện thoại:</strong> {customerInfo.phone}
        </div>
        <div style={{ marginBottom: '12px' }}>
          <strong>Email:</strong> {customerInfo.email}
        </div>
        <div style={{
          borderTop: '1px solid #374151',
          paddingTop: '12px',
          marginTop: '16px',
          fontSize: '18px',
          fontWeight: 'bold'
        }}>
          <strong>Tổng tiền: {formatCurrency(totalAmount)}</strong>
        </div>
      </div>
      <div style={{
        backgroundColor: '#1a1a2e',
        borderRadius: '8px',
        padding: '20px'
      }}>
        <h4 style={{ marginBottom: '16px' }}>Phương thức thanh toán</h4>
        <div style={{
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          <button
            style={{
              backgroundColor: '#ef4444',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onClick={() => setShowQR(true)}
          >
            <CreditCard size={16} />
            Thanh toán online
          </button>
          <button
            style={{
              backgroundColor: '#22c55e',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              cursor: 'pointer'
            }}
          >
            Thanh toán tại quầy
          </button>
        </div>
        {/* Hiển thị mã QR khi showQR = true */}
        {showQR && (
          <div style={{
            marginTop: 24,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            background: '#22223b',
            borderRadius: 12,
            padding: 20
          }}>
            <p style={{ color: "#fff", marginBottom: 10 }}>Quét mã QR để thanh toán qua VNPAY:</p>
            <QRCodeCanvas
              value={`https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?amount=${totalAmount}`}
              size={180}
              bgColor="#ffffff"
              fgColor="#000000"
              level="H"
              includeMargin={true}
            />
            <button
              onClick={() => setShowQR(false)}
              style={{
                marginTop: 10,
                padding: "8px 18px",
                background: "#ef4444",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              Đóng
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return renderShowtimeSelection();
      case 2: return renderSeatSelection();
      case 3: return renderCustomerInfo();
      case 4: return renderPayment();
      default: return null;
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0f3460", color: "#fff", display: "flex", justifyContent: "center", alignItems: "center" }}>
        Đang tải dữ liệu phim...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f3460',
      color: '#fff',
      padding: '20px 0'
    }}>
      {/* Thông báo thành công */}
      {success && (
        <div
          style={{
            position: 'fixed',
            top: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#22c55e',
            color: '#fff',
            fontWeight: 'bold',
            padding: '20px 40px',
            borderRadius: 10,
            boxShadow: '0 6px 24px 0 rgba(0,0,0,0.18)',
            zIndex: 9999,
            fontSize: 24
          }}
        >
          Đặt vé thành công!
        </div>
      )}

      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '0 16px'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '16px'
            }}
          >
            <ArrowLeft size={20} />
            Quay lại
          </button>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Movie Info */}
        {renderMovieInfo()}

        {/* Step Content */}
        {renderStepContent()}

        {/* Navigation Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '32px'
        }}>
          <button
            onClick={handlePrevStep}
            disabled={currentStep === 1}
            style={{
              backgroundColor: currentStep === 1 ? '#374151' : '#6b7280',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
              opacity: currentStep === 1 ? 0.5 : 1
            }}
          >
            Quay lại
          </button>
          <button
            onClick={currentStep === 4 ? handleBookingSuccess : handleNextStep}
            disabled={!canProceed()}
            style={{
              backgroundColor: canProceed() ? '#ef4444' : '#374151',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              cursor: canProceed() ? 'pointer' : 'not-allowed',
              opacity: canProceed() ? 1 : 0.5
            }}
          >
            {currentStep === 4 ? 'Hoàn thành' : 'Tiếp tục'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingMovie;
