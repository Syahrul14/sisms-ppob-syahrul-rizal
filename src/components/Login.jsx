import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearErrorMessage } from '../store/authSlice';
import InputField from './InputField';
import IllustrasiLogin from '../assets/IllustrasiLogin.png';
import Logo from '../assets/Logo.png';
import { faLock, faAt } from '@fortawesome/free-solid-svg-icons';
import Toast from './Toast';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { token, errorMessage, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      navigate('/dashboard');
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  const handleCloseToast = () => {
    dispatch(clearErrorMessage());
  };

  return (
    <div className="flex flex-col h-screen md:flex-row w-full min-h-screen">
      <div className="flex flex-col items-center justify-center w-full md:w-1/2 p-4">
        <div className="flex gap-2 items-center mb-4">
          <img src={Logo} alt="Logo" className="w-8 h-8" />
          <p className="text-lg font-bold">SIMS PPOB</p>
        </div>
        <div className="px-4 md:px-36 text-center"> 
          <h1 className="font-semibold text-2xl md:text-3xl mb-6">Masuk atau buat akun untuk memulai</h1>
        </div>
        <form className="w-full max-w-md" onSubmit={handleSubmit}>
          <InputField
            name="email"
            placeholder="Masukkan email anda"
            type="email"
            value={formData.email}
            onChange={handleChange}
            icon={faAt}
          />
          <InputField
            name="password"
            placeholder="Masukkan password anda"
            type="password"
            value={formData.password}
            onChange={handleChange}
            icon={faLock}
          />
          <button
            type="submit"
            className="w-full mt-4 bg-red-500 text-white p-2 rounded"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Masuk'}
          </button>
        </form>
        <p className="mt-4 text-center">
          Belum punya akun? Registrasi{' '}
          <Link to="/register" className="text-red-500 font-bold">di sini</Link>
        </p>
        {errorMessage && <Toast message={errorMessage} onClose={handleCloseToast} />}
      </div>
      <div className="hidden md:block w-1/2 h-full"> 
        <img src={IllustrasiLogin} alt="Login Illustration" className="w-full h-full object-cover" />
      </div>
      <div className="block md:hidden w-full h-1/2"> 
        <img src={IllustrasiLogin} alt="Login Illustration" className="w-full h-full object-cover" />
      </div>
    </div>
  );
};

export default Login;