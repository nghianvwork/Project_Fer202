const fs = require('fs');
const path = require('path');

// Đổi tên file database tại đây nếu bạn muốn
const inputPath = path.join(__dirname, 'database.json');
const outputPath = path.join(__dirname, 'database_generated.json');

const NUM_DAYS = 7; // Số ngày tiếp theo
const SHOWTIMES_PER_DAY = [
  { time: "09:00", cinema: "CGV Vincom", price: 120000 },
  { time: "14:00", cinema: "Lotte Cinema", price: 150000 },
  { time: "19:00", cinema: "BHD Star, Cộng Hòa", price: 180000 }
];

// Set ngày bắt đầu (nếu muốn lấy đúng ngày hôm nay, dùng new Date())
const today = new Date(); // Hoặc new Date('2025-07-07')

function pad(n) {
  return n < 10 ? '0' + n : n;
}

function dateToString(date) {
  return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate());
}

// Đọc database
const database = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

let globalShowtimeId = 10001;

database.moviesData.forEach(movie => {
  movie.showtimes = [];
  for (let i = 0; i < NUM_DAYS; i++) {
    const showDate = new Date(today);
    showDate.setDate(today.getDate() + i);
    const dateStr = dateToString(showDate);
    SHOWTIMES_PER_DAY.forEach(st => {
      movie.showtimes.push({
        id: globalShowtimeId++,
        time: st.time,
        date: dateStr,
        cinema: st.cinema,
        price: st.price
      });
    });
  }
});

// Ghi ra file mới (không ghi đè file cũ)
fs.writeFileSync(outputPath, JSON.stringify(database, null, 2), 'utf8');
console.log(`✅ Đã tạo file ${outputPath} với showtimes cho ${NUM_DAYS} ngày tới!`);
