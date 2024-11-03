import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import CardingSaldo from './carding/CardingSaldo';
import CardingServices from './carding/CardingServices';
import CardingBanner from './carding/CardingBanner';

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); 
    }
  }, [navigate]);
  return (
    <div>
      <Navbar />
      <CardingSaldo />
      <CardingServices />
      <CardingBanner />
    </div>
  )
}

export default Dashboard