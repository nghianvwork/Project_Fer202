import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, Clock, ArrowLeft, MapPin, CreditCard, User, Phone, Mail, CheckCircle, XCircle } from "lucide-react";

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
const combos = [
  { id: 1, name: "Bắp ngọt nhỏ + nước ngọt", price: 49000 },
  { id: 2, name: "Bắp lớn + nước + snack", price: 79000 },
  { id: 3, name: "Nước ngọt lớn", price: 35000 },
  { id: 4, name: "Combo 2 bắp + 2 nước", price: 99000 },
];

const getSeatZone = (row) => {
  if (['D', 'E', 'F', 'G'].includes(row)) return { zone: 'vip', price: 120000, color: '#ef4444' };     // Đỏ (VIP)
  if (['B', 'C', 'H'].includes(row))      return { zone: 'regular', price: 80000, color: '#a78bfa' };  // Tím (Thường)
  if (['A', 'S'].includes(row))           return { zone: 'cheap', price: 50000, color: '#f472b6' };    // Hồng (Rẻ)
  return { zone: 'regular', price: 80000, color: '#a78bfa' };
};

const BookingMovie = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedCombos, setSelectedCombos] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [seatError, setSeatError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:9999/moviesData/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Không tìm thấy phim!');
        return res.json();
      })
      .then(data => {
        setSelectedMovie(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const generateDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('vi-VN', {
          weekday: 'short',
          day: '2-digit',
          month: '2-digit'
        })
      });
    }
    return dates;
  };

  const generateSeats = () => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'S'];
    const seatsPerRow = 18;
    const seats = [];
    const occupiedSeats = ['A3', 'A4', 'B5', 'C7', 'D2', 'D8', 'E6', 'F4', 'F5'];
    rows.forEach(row => {
      for (let i = 1; i <= seatsPerRow; i++) {
        const seatId = `${row}${i}`;
        const { zone, price, color } = getSeatZone(row);
        seats.push({
          id: seatId,
          row,
          col: i,
          zone,
          price,
          color,
          occupied: occupiedSeats.includes(seatId),
          selected: selectedSeats.includes(seatId)
        });
      }
    });
    return seats;
  };

  const seatsList = generateSeats();

  // Validate ghế phải liền kề (trên cùng một hàng, số ghế liên tiếp)
  const validateSeatsAdjacent = (seatIds) => {
    if (seatIds.length <= 1) return true;
    const seatsByRow = seatIds.reduce((acc, id) => {
      const row = id[0];
      const col = parseInt(id.slice(1), 10);
      if (!acc[row]) acc[row] = [];
      acc[row].push(col);
      return acc;
    }, {});
    if (Object.keys(seatsByRow).length !== 1) return false;
    const cols = seatsByRow[Object.keys(seatsByRow)[0]].sort((a, b) => a - b);
    for (let i = 1; i < cols.length; i++) {
      if (cols[i] !== cols[i - 1] + 1) return false;
    }
    return true;
  };

  const handleSeatClick = (seatId) => {
    const seat = seatsList.find(s => s.id === seatId);
    if (!seat || seat.occupied) return;
    let newSeats;
    if (selectedSeats.includes(seatId)) {
      newSeats = selectedSeats.filter(id => id !== seatId);
    } else {
      newSeats = [...selectedSeats, seatId];
    }
    setSelectedSeats(newSeats);
    setTimeout(() => {
      if (!validateSeatsAdjacent(newSeats)) {
        setSeatError('Bạn chỉ được chọn các ghế liền kề trên cùng một hàng!');
      } else {
        setSeatError('');
      }
    }, 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const totalTicket = seatsList.filter(seat => selectedSeats.includes(seat.id)).reduce((sum, seat) => sum + seat.price, 0);
  const totalCombo = combos.filter(c => selectedCombos.includes(c.id)).reduce((a, b) => a + b.price, 0);
  const totalAmount = totalTicket + totalCombo;

  const handleNextStep = () => {
    if (currentStep === 2 && !validateSeatsAdjacent(selectedSeats)) {
      setSeatError('Bạn chỉ được chọn các ghế liền kề trên cùng một hàng!');
      return;
    }
    setSeatError('');
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    setSeatError('');
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedDate && selectedShowtime !== null;
      case 2: return selectedSeats.length > 0 && seatError === '';
      case 3: return true;
      case 4: return customerInfo.name && customerInfo.phone && customerInfo.email;
      case 5: return paymentMethod !== '';
      default: return false;
    }
  };

  const handleVNPayPayment = () => {
    setPaymentStatus('processing');
    setTimeout(() => {
      const success = Math.random() > 0.3;
      setPaymentStatus(success ? 'success' : 'failed');
      if (success) {
        setTimeout(() => handleBookingSuccess(), 2000);
      }
    }, 3000);
  };
  const handleCounterPayment = () => {
    setPaymentStatus('counter');
    setTimeout(() => handleBookingSuccess(), 1500);
  };
  const handleBookingSuccess = () => {
    setSuccess(true);
    
  };
const generateInvoicePDFSimple = () => {
  const invoiceHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Hóa đơn đặt vé</title>
      <style>
        @media print {
          @page {
            margin: 1cm;
            size: A4;
          }
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
        }
        
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background: white;
        }
        
        .header {
          text-align: center;
          border-bottom: 3px solid #e74c3c;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        
        .header h1 {
          color: #e74c3c;
          font-size: 24px;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .section {
          margin-bottom: 20px;
          padding: 15px;
          border-radius: 8px;
          border-left: 4px solid #007bff;
          background: #f8f9fa;
        }
        
        .section h3 {
          margin: 0 0 10px 0;
          color: #007bff;
          font-size: 16px;
        }
        
        .total-section {
          text-align: center;
          padding: 20px;
          background: #e74c3c;
          color: white;
          border-radius: 8px;
          margin: 20px 0;
        }
        
        .total-amount {
          font-size: 24px;
          font-weight: bold;
        }
        
        .thank-you {
          text-align: center;
          padding: 15px;
          background: #d4edda;
          border: 1px solid #c3e6cb;
          border-radius: 8px;
          color: #155724;
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="header">
          <h1>HÓA ĐƠN ĐẶT VÉ XEM PHIM</h1>
          <p>Mã hóa đơn: #${Date.now().toString().slice(-8)}</p>
        </div>
        
        <div class="section">
          <h3>🎬 Thông tin phim</h3>
          <p><strong>Phim:</strong> ${selectedMovie?.title || 'N/A'}</p>
          <p><strong>Ngày chiếu:</strong> ${new Date(selectedDate).toLocaleDateString('vi-VN')}</p>
          <p><strong>Suất chiếu:</strong> ${selectedShowtime?.time} - ${selectedShowtime?.cinema}</p>
        </div>
        
        <div class="section">
          <h3>🎫 Ghế đã chọn</h3>
          <p><strong>${selectedSeats.join(', ')}</strong></p>
        </div>
        
        <div class="section">
          <h3>👤 Thông tin khách hàng</h3>
          <p><strong>Họ tên:</strong> ${customerInfo.name}</p>
          <p><strong>Email:</strong> ${customerInfo.email}</p>
          <p><strong>Số điện thoại:</strong> ${customerInfo.phone}</p>
        </div>
        
        <div class="total-section">
          <h3>💰 Tổng thanh toán</h3>
          <div class="total-amount">${formatCurrency(totalAmount)}</div>
        </div>
        
        <div class="thank-you">
          <h3>🎉 Cảm ơn bạn đã đặt vé!</h3>
          <p>Vui lòng mang theo hóa đơn này khi đến rạp chiếu phim</p>
        </div>
      </div>
      
      <script>
        window.onload = function() {
          window.print();
          setTimeout(() => {
            window.close();
          }, 1000);
        }
      </script>
    </body>
    </html>
  `;

  const newWindow = window.open('', '_blank');
  newWindow.document.write(invoiceHTML);
  newWindow.document.close();
  
  setTimeout(() => {
    navigate('/home');
  }, 3000);
};

  // ===== UI
  const renderStepIndicator = () => (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '32px',
      padding: '0 16px'
    }}>
      {[1, 2, 3, 4, 5].map(step => (
        <div key={step} style={{
          display: 'flex',
          alignItems: 'center',
          flex: 1,
          maxWidth: '180px'
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
            fontSize: '12px',
            color: currentStep >= step ? '#ef4444' : '#9ca3af'
          }}>
            {step === 1 && 'Chọn suất'}
            {step === 2 && 'Chọn ghế'}
            {step === 3 && 'Combo (tùy chọn)'}
            {step === 4 && 'Thông tin'}
            {step === 5 && 'Thanh toán'}
          </div>
          {step < 5 && (
            <div style={{
              flex: 1,
              height: '2px',
              backgroundColor: currentStep > step ? '#ef4444' : '#374151',
              margin: '0 8px'
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
          <p style={{ fontSize: '14px', color: '#9ca3af' }}>
            <strong>Mô tả:</strong> {selectedMovie.description}
          </p>
        </div>
      </div>
    );
  };

  const renderShowtimeSelection = () => (
    <div>
      <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>Chọn ngày và suất chiếu</h3>
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '16px', marginBottom: '12px' }}>Chọn ngày:</h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '8px',
          marginBottom: '20px'
        }}>
          {generateDates().map(date => (
            <div
              key={date.value}
              onClick={() => {
                setSelectedDate(date.value);
                setSelectedShowtime(null);
              }}
              style={{
                backgroundColor: selectedDate === date.value ? '#ef4444' : '#374151',
                borderRadius: '8px',
                padding: '12px',
                cursor: 'pointer',
                textAlign: 'center',
                border: '2px solid',
                borderColor: selectedDate === date.value ? '#ef4444' : 'transparent',
                transition: 'all 0.2s',
                fontSize: '14px'
              }}
            >
              {date.label}
            </div>
          ))}
        </div>
      </div>
      {selectedDate && (
        <div>
          <h4 style={{ fontSize: '16px', marginBottom: '12px' }}>Chọn suất chiếu:</h4>
          {selectedMovie && selectedMovie.showtimes && selectedMovie.showtimes.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px'
            }}>
              {selectedMovie.showtimes
                .filter(showtime => showtime.date === selectedDate)
                .map(showtime => (
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
                      <Clock size={16} />
                      <span>{showtime.time}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <MapPin size={16} />
                      <span>{showtime.cinema}</span>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div style={{ color: "#f87171", marginTop: 24, fontWeight: 500 }}>
              Không có suất chiếu nào cho ngày này!
            </div>
          )}
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
          gridTemplateColumns: 'repeat(18, 1fr)',
          gap: '8px',
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          {seatsList.map(seat => (
            <div
              key={seat.id}
              onClick={() => handleSeatClick(seat.id)}
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
                backgroundColor: seat.occupied ? '#6b7280'
                  : selectedSeats.includes(seat.id) ? '#16a34a'
                  : seat.color,
                color: '#fff',
                border: selectedSeats.includes(seat.id) ? '2px solid #fff' : 'none',
                transition: 'all 0.2s'
              }}
              title={`Ghế ${seat.id} - ${seat.zone === 'vip' ? 'VIP' : seat.zone === 'regular' ? 'Thường' : 'Rẻ'} - ${formatCurrency(seat.price)}`}
            >
              {seat.id}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '16px', height: '16px', backgroundColor: '#ef4444', borderRadius: '4px' }} />
            <span>VIP - 120.000đ</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '16px', height: '16px', backgroundColor: '#a78bfa', borderRadius: '4px' }} />
            <span>Thường - 80.000đ</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '16px', height: '16px', backgroundColor: '#f472b6', borderRadius: '4px' }} />
            <span>Rẻ - 50.000đ</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '16px', height: '16px', backgroundColor: '#16a34a', borderRadius: '4px' }} />
            <span>Đã chọn</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '16px', height: '16px', backgroundColor: '#6b7280', borderRadius: '4px' }} />
            <span>Đã đặt</span>
          </div>
        </div>
      </div>
      {seatError && (
        <div style={{ color: "#ef4444", textAlign: "center", fontWeight: 500, marginBottom: 12 }}>
          {seatError}
        </div>
      )}
      {selectedSeats.length > 0 && (
        <div style={{
          backgroundColor: '#1a1a2e',
          borderRadius: '8px',
          padding: '16px',
          marginTop: '16px'
        }}>
          <h4 style={{ marginBottom: '8px' }}>Ghế đã chọn:</h4>
          <ul style={{ color: '#9ca3af', marginBottom: '8px' }}>
            {selectedSeats.map(seatId => {
              const seat = seatsList.find(s => s.id === seatId);
              if (!seat) return null;
              return (
                <li key={seat.id}>
                  {seat.id} - {seat.zone === 'vip' ? 'VIP' : seat.zone === 'regular' ? 'Thường' : 'Rẻ'} ({formatCurrency(seat.price)})
                </li>
              );
            })}
          </ul>
          <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
            Tổng tiền vé: {formatCurrency(totalTicket)}
          </p>
        </div>
      )}
    </div>
  );

  const renderComboSelection = () => (
    <div>
      <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>Chọn combo đồ ăn/thức uống <span style={{ color: '#6ee7b7' }}>(không bắt buộc)</span></h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        {combos.map(combo => (
          <div key={combo.id}
            style={{
              background: selectedCombos.includes(combo.id) ? "#ef4444" : "#1a1a2e",
              border: selectedCombos.includes(combo.id) ? "2px solid #ef4444" : "2px solid #374151",
              borderRadius: 10, padding: 16, cursor: 'pointer'
            }}
            onClick={() => {
              setSelectedCombos(prev =>
                prev.includes(combo.id)
                  ? prev.filter(id => id !== combo.id)
                  : [...prev, combo.id]
              )
            }}>
            <div style={{ fontWeight: 'bold' }}>{combo.name}</div>
            <div style={{ marginTop: 8, color: '#fbbf24' }}>{formatCurrency(combo.price)}</div>
            {selectedCombos.includes(combo.id) && <span style={{ color: '#fff', fontSize: 12 }}>✓ Đã chọn</span>}
          </div>
        ))}
      </div>
      <p style={{ color: '#9ca3af', marginTop: 20, fontSize: 14 }}>
        Bạn có thể bỏ qua nếu không muốn mua thêm.
      </p>
      {selectedCombos.length > 0 && (
        <div style={{
          backgroundColor: '#1a1a2e',
          borderRadius: '8px',
          padding: '16px',
          marginTop: '16px',
          color: '#fff'
        }}>
          <h4 style={{ marginBottom: 8 }}>Đã chọn:</h4>
          <ul>
            {combos.filter(c => selectedCombos.includes(c.id)).map(c => (
              <li key={c.id}>{c.name} ({formatCurrency(c.price)})</li>
            ))}
          </ul>
          <div style={{ fontWeight: 600, marginTop: 10 }}>
            Tổng tiền combo: {formatCurrency(totalCombo)}
          </div>
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
              fontSize: '16px',
              backgroundColor: '#374151',
              color: '#fff'
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
              fontSize: '16px',
              backgroundColor: '#374151',
              color: '#fff'
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
              fontSize: '16px',
              backgroundColor: '#374151',
              color: '#fff'
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
          <strong>Ngày:</strong> {selectedDate ? new Date(selectedDate).toLocaleDateString('vi-VN') : ''}
        </div>
        <div style={{ marginBottom: '12px' }}>
          <strong>Suất chiếu:</strong> {selectedShowtime?.time} - {selectedShowtime?.cinema}
        </div>
        <div style={{ marginBottom: '12px' }}>
          <strong>Ghế:</strong> {selectedSeats.join(', ')}
        </div>
        {selectedCombos.length > 0 && (
          <div style={{ marginBottom: '12px' }}>
            <strong>Đồ ăn/nước:</strong>
            <ul>
              {combos.filter(c => selectedCombos.includes(c.id)).map(c => (
                <li key={c.id}>{c.name} ({formatCurrency(c.price)})</li>
              ))}
            </ul>
          </div>
        )}
        <div style={{ marginBottom: '12px' }}>
          <strong>Khách hàng:</strong> {customerInfo.name}
        </div>
        <div style={{
          borderTop: '1px solid #374151',
          paddingTop: '12px',
          marginTop: '16px',
          fontSize: '18px',
          fontWeight: 'bold'
        }}>
          <div>Tổng tiền vé: {formatCurrency(totalTicket)}</div>
          {totalCombo > 0 && <div>Tổng combo: {formatCurrency(totalCombo)}</div>}
          <strong style={{ color: "#ef4444" }}>TỔNG THANH TOÁN: {formatCurrency(totalAmount)}</strong>
        </div>
      </div>
      <div style={{
        backgroundColor: '#1a1a2e',
        borderRadius: '8px',
        padding: '20px'
      }}>
        <h4 style={{ marginBottom: '16px' }}>Phương thức thanh toán</h4>
        {paymentStatus === '' && (
          <div style={{
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            marginBottom: '20px'
          }}>
            <button
              onClick={() => setPaymentMethod('vnpay')}
              style={{
                backgroundColor: paymentMethod === 'vnpay' ? '#ef4444' : '#374151',
                color: '#fff',
                border: paymentMethod === 'vnpay' ? '2px solid #ef4444' : '2px solid transparent',
                borderRadius: '8px',
                padding: '12px 24px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              <CreditCard size={16} />
              Thanh toán VNPay
            </button>
            <button
              onClick={() => setPaymentMethod('counter')}
              style={{
                backgroundColor: paymentMethod === 'counter' ? '#22c55e' : '#374151',
                color: '#fff',
                border: paymentMethod === 'counter' ? '2px solid #22c55e' : '2px solid transparent',
                borderRadius: '8px',
                padding: '12px 24px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Thanh toán tại quầy
            </button>
          </div>
        )}
        {paymentMethod === 'vnpay' && paymentStatus === '' && (
          <div style={{
            backgroundColor: '#22223b',
            borderRadius: '8px',
            padding: '20px',
            marginTop: '16px'
          }}>
            <h5 style={{ marginBottom: '12px' }}>Thanh toán qua VNPay</h5>
            <p style={{ marginBottom: '16px', color: '#9ca3af' }}>
              Bạn sẽ được chuyển đến cổng thanh toán VNPay để hoàn tất giao dịch.
            </p>
            <button
              onClick={handleVNPayPayment}
              style={{
                backgroundColor: '#ef4444',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Thanh toán ngay
            </button>
          </div>
        )}
        {paymentMethod === 'counter' && paymentStatus === '' && (
          <div style={{
            backgroundColor: '#22223b',
            borderRadius: '8px',
            padding: '20px',
            marginTop: '16px'
          }}>
            <h5 style={{ marginBottom: '12px' }}>Thanh toán tại quầy</h5>
            <p style={{ marginBottom: '16px', color: '#9ca3af' }}>
              Vui lòng đến quầy vé trước 15 phút để thanh toán và nhận vé.
            </p>
            <button
              onClick={handleCounterPayment}
              style={{
                backgroundColor: '#22c55e',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Xác nhận đặt vé
            </button>
          </div>
        )}
        {paymentStatus === 'processing' && (
          <div style={{
            backgroundColor: '#1e40af',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center',
            marginTop: '16px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #3b82f6',
              borderTop: '4px solid #fff',
              borderRadius: '50%',
              margin: '0 auto 12px',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p>Đang xử lý thanh toán...</p>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}
        {paymentStatus === 'success' && (
          <div style={{
            backgroundColor: '#22c55e',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center',
            marginTop: '16px'
          }}>
            <CheckCircle size={48} style={{ margin: '0 auto 12px', display: 'block' }} />
            <p style={{ fontWeight: 'bold', fontSize: '18px' }}>Thanh toán thành công!</p>
            <p>Vé của bạn đã được xác nhận.</p>
          </div>
        )}
        {paymentStatus === 'failed' && (
          <div style={{
            backgroundColor: '#ef4444',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center',
            marginTop: '16px'
          }}>
            <XCircle size={48} style={{ margin: '0 auto 12px', display: 'block' }} />
            <p style={{ fontWeight: 'bold', fontSize: '18px' }}>Thanh toán thất bại!</p>
            <p>Vui lòng thử lại hoặc chọn phương thức khác.</p>
            <button
              onClick={() => {
                setPaymentStatus('');
                setPaymentMethod('');
              }}
              style={{
                backgroundColor: '#fff',
                color: '#ef4444',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                cursor: 'pointer',
                marginTop: '12px'
              }}
            >
              Thử lại
            </button>
          </div>
        )}
        {paymentStatus === 'counter' && (
          <div style={{
            backgroundColor: '#22c55e',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center',
            marginTop: '16px'
          }}>
            <CheckCircle size={48} style={{ margin: '0 auto 12px', display: 'block' }} />
            <p style={{ fontWeight: 'bold', fontSize: '18px' }}>Đặt vé thành công!</p>
            <p>Vui lòng đến quầy vé để thanh toán trước 15 phút.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return renderShowtimeSelection();
      case 2: return renderSeatSelection();
      case 3: return renderComboSelection();
      case 4: return renderCustomerInfo();
      case 5: return renderPayment();
      default: return null;
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#0f3460",
        color: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #374151',
            borderTop: '4px solid #ef4444',
            borderRadius: '50%',
            margin: '0 auto 12px',
            animation: 'spin 1s linear infinite'
          }}></div>
          Đang tải dữ liệu phim...
        </div>
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
            fontSize: 18,
            textAlign: 'center'
          }}
        >
          🎉 Đặt vé thành công! 🎉
          <br />
          <span style={{ fontSize: 14 }}>Cảm ơn bạn đã sử dụng dịch vụ</span>
        </div>
      )}



      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '0 16px'
      }}>
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
          <h1 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            margin: '0 0 0 20px'
          }}>
            Đặt vé xem phim
          </h1>
        </div>
        {renderStepIndicator()}
        {renderMovieInfo()}
        {renderStepContent()}
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
              opacity: currentStep === 1 ? 0.5 : 1,
              fontSize: '16px'
            }}
          >
            Quay lại
          </button>
          {currentStep < 5 && (
            <button
              onClick={handleNextStep}
              disabled={!canProceed()}
              style={{
                backgroundColor: (currentStep === 3 || canProceed()) ? '#ef4444' : '#374151',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                cursor: (currentStep === 3 || canProceed()) ? 'pointer' : 'not-allowed',
                opacity: (currentStep === 3 || canProceed()) ? 1 : 0.5,
                fontSize: '16px'
              }}
            >
              Tiếp tục
            </button>
            
          )}
        </div>
        {(paymentStatus === 'success' || paymentStatus === 'counter') && (
  <button
    style={{
      marginTop: 16,
      backgroundColor: "#fff",
      color: "#ef4444",
      border: 'none',
      borderRadius: '8px',
      padding: '8px 16px',
      cursor: 'pointer',
      fontWeight: 600
    }}
    onClick={generateInvoicePDFSimple}
  >
    Tải hóa đơn
  </button>
)}


        <div style={{
          marginTop: '40px',
          padding: '20px',
          backgroundColor: '#1a1a2e',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>
            🎬 Cảm ơn bạn đã chọn dịch vụ đặt vé của chúng tôi
          </p>
          <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>
            Hotline hỗ trợ: 1900-1234 | Email: support@cinema.vn
          </p>
        </div>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default BookingMovie;
