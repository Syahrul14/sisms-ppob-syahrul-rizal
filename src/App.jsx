import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Topup from './components/Topup';
import Payment from './components/Payment';
import Transaction from './components/Transaction';
import Account from './components/Account/Account';
import './index.css';
import './App.css';

function App() {
  return (
    <Router>
      <div className="text-gray-700">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/topup" element={<Topup />} />
          <Route path="/transaction" element={<Transaction />} />
          <Route path="/akun" element={<Account />} />
          <Route path="/payment" element={<Payment />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;