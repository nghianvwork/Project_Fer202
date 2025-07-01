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
import CreateMovie from './Auth/CreateMovie';

import HeroBanner from './Banner';
// npx json-server --watch database.json --port 9999
function App() {
  return (
    <Router>

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/home' element={<Home />} />
        <Route path='/signup' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path='/changepassword'
          element={
            <PrivateRole>
              <ChangePassword />
            </PrivateRole>
          }
        />
        <Route
          path="/create-movie" element={<CreateMovie />}
        />

      </Routes>
    </Router>
  );
}

export default App;
