import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleBalanceVisibility } from '../../store/authSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import ProfilePhoto from '../../assets/ProfilePhoto.png';

const CardingSaldo = () => {
  const [balance, setBalance] = useState(null);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    profileImage: ProfilePhoto,
  });
  const [errorMessage, setErrorMessage] = useState('');
  const isBalanceVisible = useSelector((state) => state.auth.isBalanceVisible);
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  const dispatch = useDispatch();
  console.log(profile);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setErrorMessage('Token tidak tersedia, silakan login kembali.');
          return;
        }

        const balanceResponse = await fetch('https://take-home-test-api.nutech-integrasi.com/balance', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        const balanceData = await balanceResponse.json();
        if (balanceResponse.ok && balanceData.status === 0) {
          setBalance(balanceData.data.balance);
        } else {
          setErrorMessage(balanceData.message || 'Gagal mengambil saldo.');
        }
      } catch (error) {
        setErrorMessage('Terjadi kesalahan saat mengakses saldo.');
      }
    };

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const profileResponse = await fetch('https://take-home-test-api.nutech-integrasi.com/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const profileData = await profileResponse.json();
        console.log(profileData);
        if (profileResponse.ok && profileData.status === 0) {
          const { first_name, last_name, profile_image } = profileData.data;
          setProfile({
            firstName: first_name,
            lastName: last_name,
            profileImage: profile_image || ProfilePhoto,
          });
        } else {
          setErrorMessage(profileData.message || 'Gagal mengambil profil.');
        }
      } catch (error) {
        setErrorMessage('Terjadi kesalahan saat mengakses profil.');
      }
    };

    fetchBalance();
    fetchProfile();
  }, []);


  return (
    <div className="flex flex-col md:flex-row mt-10 px-4 md:px-20">
      <div className="w-full md:w-1/2 flex flex-col items-center lg:items-start">
        <img
          src={profile.profileImage ? profile.profileImage : ProfilePhoto}
          alt="Profile"
          className="rounded-full w-24 h-24"
        />
        <p className="mt-4 text-xl md:text-2xl">Selamat datang,</p>
        <p className="mt-2 font-bold text-2xl md:text-3xl">{`${capitalize(profile.firstName)} ${capitalize(profile.lastName)}`}</p>
      </div>
      <div className="text-white bg-red-500 rounded-lg p-5 md:p-10 w-full mt-4 md:mt-0">
        <p className="mb-2">Saldo anda</p>
        <p className="mb-2 text-2xl md:text-4xl font-bold">
          {balance !== null ? 
            (isBalanceVisible ? `Rp ${balance.toLocaleString()}` : 'Rp. ••••••') : 'Rp 0'}
        </p>
        {errorMessage && <p className="text-red-300">{errorMessage}</p>}
        <div className="flex items-center mt-4">
          <button onClick={() => dispatch(toggleBalanceVisibility())} className="flex items-center text-white">
            <span>{isBalanceVisible ? 'Tutup Saldo' : 'Lihat Saldo'}</span>
            <FontAwesomeIcon icon={isBalanceVisible ? faEye : faEyeSlash} className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardingSaldo;
