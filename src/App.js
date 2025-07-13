import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Auth/Register';
import Nav from './Header/Header';
import Login from './Auth/Login';
import Home from './Home';
import ChangePassword from './Auth/Changepassword';
import PrivateRole from './Auth/PrivateRole';
import ForgotPassword from './Auth/ForgotPassword';
import TopFilm from './Auth/TopFilm';
import MovieDetail from './Auth/MovieDetail';
import CreateMovie from './Auth/CreateMovie';
import HeroBanner from './Banner';
import Profile from './Auth/Profile';
import CinemaDetail from './Component/CinemaDetail';
import AdminDashboard from './Auth/admindashboard';
import EditMovie from './Auth/EditMovie';
import ShowtimeForm from './Auth/ShowtimeForm';
// npx json-server --watch database.json --port 9999
function App() {
  return (
    <Router>

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/home' element={<Home />} />
        <Route path='/profile' element={<Profile />} />
        <Route path="/movies/:id" element={<MovieDetail />} />
        <Route path='/signup' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path="/admin" element={<PrivateRole adminOnly={true}><AdminDashboard /></PrivateRole>} />
        <Route path="/edit-movie/:id" element={<PrivateRole adminOnly={true}><EditMovie /></PrivateRole>} />
        <Route path="/create-movie" element={<PrivateRole adminOnly={true}><CreateMovie /></PrivateRole>} />
        <Route path="/showtime-form/:movieId" element={<PrivateRole adminOnly={true}><ShowtimeForm /></PrivateRole>} />



        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path='/changepassword'
          element={
            <PrivateRole>
              <ChangePassword />
            </PrivateRole>
          }
        />
        <Route path="/topfilm" element={<TopFilm />} />
        <Route
          path="/create-movie" element={<CreateMovie />}
        />
        <Route path="/cinema/:cinemaName" element={<CinemaDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
