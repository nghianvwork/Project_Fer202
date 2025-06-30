import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Auth/Register';
import Nav from './Header/Header';
import Login from './Auth/Login';
import Home from './Home';
import ChangePassword from './Auth/Changepassword';

function App() {
  return (
   <Router>
    <Nav/>
       <Routes>
           <Route path='/' element={<Home />} />
           <Route path='/signup' element={<Register/>} />
           <Route path='/login' element={<Login/>} />
           <Route path='/changepassword' element={<ChangePassword />} />
       </Routes>

   </Router>
  );
}

export default App;
