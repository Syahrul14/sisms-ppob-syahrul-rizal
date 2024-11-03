import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import CardingSaldo from './carding/CardingSaldo';
import InputField from './InputField';
import Modal from './Modal'; 
import successImage from '../assets/sucessImage.svg';
import errorImage from '../assets/errorImage.svg';
import Logo from '../assets/Logo.png';
import { faWallet } from '@fortawesome/free-solid-svg-icons';

const Payment = () => {
  const location = useLocation();
  const service = location.state?.service || {};
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [modalType, setModalType] = useState('success');
  const [paymentAmount, setPaymentAmount] = useState(service.service_tariff || 0);

  const handlePaymentSubmit = (event) => {
    event.preventDefault();
    setConfirmModal(true); // Tampilkan modal konfirmasi sebelum proses pembayaran
  };

  const confirmPayment = async () => {
    setConfirmModal(false);
    const token = localStorage.getItem('token');
    
    if (!token) {
      setErrorMessage('Token tidak tersedia, silakan login kembali.');
      setModalType('error');
      setShowModal(true);
      return;
    }

    try {
      const response = await fetch('https://take-home-test-api.nutech-integrasi.com/transaction', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ service_code: service.service_code }),
      });

      const data = await response.json();

      if (response.ok && data.status === 0) {
        setSuccessMessage(`Transaksi berhasil! Nomor Invoice: ${data.data.invoice_number}`);
        setModalType('success');
        setShowModal(true);
      } else {
        setErrorMessage(data.message || 'Gagal melakukan transaksi.');
        setModalType('error');
        setShowModal(true);
      }
    } catch (error) {
      setErrorMessage('Terjadi kesalahan saat memproses transaksi.');
      setModalType('error');
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setConfirmModal(false);
  };

  return (
    <div>
      <Navbar />
      <CardingSaldo />
      <div className="mt-10 px-20">
        <p className="text-2xl">Pembayaran</p>
        <div className="flex items-center mt-2 gap-5">
          <img src={service.service_icon} alt={service.service_name} />
          <p>Pembayaran {service.service_name}</p>
        </div>
        <div>
          <form onSubmit={handlePaymentSubmit}>
            <InputField
              name="topup"
              placeholder="Masukan nominal pembayaran"
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              icon={faWallet}
            />
            <button
              type="submit"
              className="w-full mt-4 bg-red-500 text-white p-2 rounded"
            >
              Bayar
            </button>
          </form>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={"Pembayaran " + service.service_name + " sebesar"} 
        message={modalType === 'success' ? "berhasil!" : "gagal!"}
        image={modalType === 'success' ? successImage : errorImage}
        amount={paymentAmount}
      />

      {confirmModal && (
        <Modal
          isOpen={confirmModal}
          onClose={handleCloseModal}
          title={"Beli " + service.service_name + " senilai"}
          message={`Rp${paymentAmount.toLocaleString('id-ID')} ?`}
          image={Logo}
          onConfirm={confirmPayment} 
          confirmButtonText="Ya, Lanjutkan Pembayaran"
          cancelButtonText="Batalkan"
        />
      )}
    </div>
  );
};

export default Payment;
