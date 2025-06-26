import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Auth/Register';
import Nav from './Header/Header';
function App() {
  return (
   <Router>
    <Nav/>
       <Routes>
        
           <Route path='/signup' element={<Register/>} />
       </Routes>

   </Router>
  );
}

export default App;
