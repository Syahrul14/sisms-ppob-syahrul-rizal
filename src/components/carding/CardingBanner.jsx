import React, { useEffect, useState } from 'react';

const CardingBanner = () => {
  const [banners, setBanners] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchBanners = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMessage('Token tidak tersedia, silakan login kembali.');
        return;
      }

      try {
        const response = await fetch('https://take-home-test-api.nutech-integrasi.com/banner', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok && data.status === 0) {
          setBanners(data.data);
        } else if (data.status === 108) { 
          setErrorMessage('Token tidak valid atau kadaluwarsa, silakan login kembali.');
          localStorage.removeItem('token');
        } else {
          setErrorMessage(data.message || 'Gagal mengambil data banner.');
        }
      } catch (error) {
        setErrorMessage('Terjadi kesalahan saat mengakses data banner.');
      }
    };

    fetchBanners();
  }, []);

  return (
    <div className="mt-10 mb-10 px-4 md:px-20">
      <h1 className="mb-6 text-xl md:text-2xl font-bold">Temukan promo menarik</h1>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {banners.length > 0 && (
        <div className="overflow-x-auto hide-scrollbar">
          <div className="flex space-x-2 scrolling-carousel">
            {banners.concat(banners).map((banner, index) => (
              <div key={index} className="flex-shrink-0 w-64 sm:w-72 md:w-80">
                <img src={banner.banner_image} alt={banner.banner_name} className="w-full h-auto rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CardingBanner;
