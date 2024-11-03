import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { faAt, faUser } from '@fortawesome/free-solid-svg-icons';
import InputField from '../InputField';
import Toast from '../Toast';

const FormProfile = () => {
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("Token tidak tersedia, silakan login kembali.");
        return;
      }

      try {
        const response = await fetch("https://take-home-test-api.nutech-integrasi.com/profile", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok && data.status === 0) {
          setFormData({
            email: data.data.email,
            first_name: data.data.first_name,
            last_name: data.data.last_name,
          });
        } else {
          setErrorMessage(data.message || "Gagal mengambil data profil.");
        }
      } catch (error) {
        setErrorMessage("Terjadi kesalahan saat mengambil data profil.");
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditProfile = () => {
    setIsEditing(true);
    setToastMessage('');
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    
    if (!token) {
      setErrorMessage("Token tidak tersedia, silakan login kembali.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://take-home-test-api.nutech-integrasi.com/profile/update", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
        }),
      });

      const data = await response.json();
      if (response.ok && data.status === 0) {
        setToastMessage(data.message);
        setIsToastVisible(true);
        window.location.reload();
      } else {
        setErrorMessage(data.message || "Gagal mengupdate profil.");
      }
    } catch (error) {
      setErrorMessage("Terjadi kesalahan saat mengupdate profil.");
    } finally {
      setLoading(false);
      setIsEditing(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    navigate("/");
  };

  const closeToast = () => {
    setIsToastVisible(false);
  };

  return (
    <div className="flex w-full h-full items-center justify-center">
      <div className="w-full max-w-md px-4">
        <form className="w-full">
          <InputField
            name="email"
            placeholder="Masukkan email anda"
            type="email"
            value={formData.email}
            onChange={handleChange}
            icon={faAt}
            disabled={!isEditing}
          />
          <InputField
            name="first_name"
            placeholder="Masukkan nama depan"
            type="text"
            value={formData.first_name}
            onChange={handleChange}
            icon={faUser}
            disabled={!isEditing}
          />
          <InputField
            name="last_name"
            placeholder="Masukkan nama belakang"
            type="text"
            value={formData.last_name}
            onChange={handleChange}
            icon={faUser}
            disabled={!isEditing}
          />
          <div className="flex flex-col gap-4 mt-6">
            {isEditing ? (
              <button
                type="button"
                onClick={handleSaveProfile}
                className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition duration-200"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Simpan'}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleEditProfile}
                className="w-full border border-red-500 text-red-500 py-2 rounded hover:bg-red-500 hover:text-white transition duration-200"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Edit Profile'}
              </button>
            )}
            {!isEditing && (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition duration-200"
              >
                Logout
              </button>
            )}
          </div>
          {errorMessage && <p className="text-red-500 mt-2 text-center">{errorMessage}</p>}
        </form>
        {isToastVisible && <Toast message={toastMessage} onClose={closeToast} success={true} />}
      </div>
    </div>
  );
};

export default FormProfile;
