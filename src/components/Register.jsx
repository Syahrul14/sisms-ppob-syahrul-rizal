import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import IllustrasiLogin from '../assets/IllustrasiLogin.png';
import Logo from '../assets/Logo.png';
import InputField from './InputField';
import Toast from './Toast';
import { faLock, faAt, faUser } from '@fortawesome/free-solid-svg-icons';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.first_name || !formData.last_name || !formData.password || !formData.confirmPassword) {
      setErrorMessage('Semua field wajib diisi.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMessage('Format email tidak valid.');
      return;
    }
    if (formData.password.length < 8) {
      setErrorMessage('Password harus minimal 8 karakter.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Password dan konfirmasi password tidak cocok.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch('https://take-home-test-api.nutech-integrasi.com/registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          first_name: formData.first_name,
          last_name: formData.last_name,
          password: formData.password,
        }),
      });
      const data = await response.json();

      if (response.ok && data.status === 0) {
        setSuccessMessage(data.message); 
        setFormData({ email: '', first_name: '', last_name: '', password: '', confirmPassword: '' });
      } else {
        setErrorMessage(data.message || 'Registrasi gagal.');
      }
    } catch (error) {
      setErrorMessage('Terjadi kesalahan saat registrasi.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseToast = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-screen">
      <div className="flex flex-col items-center justify-center w-full md:w-1/2 p-4">
        <div className="flex gap-2 items-center mb-4">
          <img src={Logo} alt="Logo" />
          <p className="text-lg font-bold">SIMS PPOB</p>
        </div>
        <div className="px-4 md:px-36 text-center">
          <h1 className="font-semibold text-2xl md:text-3xl mb-4">Lengkapi data untuk membuat akun</h1>
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
            name="first_name"
            placeholder="Masukkan nama depan"
            type="text"
            value={formData.first_name}
            onChange={handleChange}
            icon={faUser}
          />
          <InputField
            name="last_name"
            placeholder="Masukkan nama belakang"
            type="text"
            value={formData.last_name}
            onChange={handleChange}
            icon={faUser}
          />
          <InputField
            name="password"
            placeholder="Masukkan password anda"
            type="password"
            value={formData.password}
            onChange={handleChange}
            icon={faLock}
          />
          <InputField
            name="confirmPassword"
            placeholder="Konfirmasi password anda"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            icon={faLock}
          />
          <button
            type="submit"
            className="w-full mt-4 bg-red-500 text-white p-2 rounded"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Registrasi'}
          </button>
        </form>
        <p className="mt-4 text-center">
          Sudah punya akun? Login{' '}
          <Link to="/" className="text-red-500 font-bold">di sini</Link>
        </p>
        {errorMessage && <Toast message={errorMessage} onClose={handleCloseToast} />}
        {successMessage && <Toast message={successMessage} onClose={handleCloseToast} success />}
      </div>
      <div className="w-full md:w-1/2 h-full">
        <img src={IllustrasiLogin} alt="Login Illustration" className="w-full h-full object-cover" />
      </div>
    </div>
  );
};

export default Register;
