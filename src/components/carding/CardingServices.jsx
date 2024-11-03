import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CardingServices = () => {
  const [services, setServices] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setErrorMessage('Token tidak tersedia, silakan login kembali.');
          return;
        }

        const response = await fetch('https://take-home-test-api.nutech-integrasi.com/services', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok && data.status === 0) {
          setServices(data.data);
        } else {
          setErrorMessage(data.message || 'Gagal mengambil layanan.');
        }
      } catch (error) {
        setErrorMessage('Terjadi kesalahan saat mengakses layanan.');
      }
    };

    fetchServices();
  }, []);

  const handleServiceClick = (service) => {
    navigate('/payment', { state: { service } }); 
  };

  return (
    <div className="mt-10 px-4 md:px-20">
      <div className="flex gap-4 overflow-x-auto scrollbar-hide"> 
        {services.map((service) => (
          <div
            key={service.service_code}
            className="w-36 flex flex-col items-center text-center cursor-pointer"
            onClick={() => handleServiceClick(service)}
          >
            <img src={service.service_icon} alt={service.service_name} className="w-20 h-20 mb-2" />
            <p className="text-center break-words">{service.service_name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardingServices;
