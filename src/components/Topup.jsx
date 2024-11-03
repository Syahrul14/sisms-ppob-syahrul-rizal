import React, { useState } from 'react';
import Navbar from './Navbar';
import CardingSaldo from './carding/CardingSaldo';
import InputField from './InputField';
import { faWallet } from '@fortawesome/free-solid-svg-icons';
import Modal from './Modal'; 
import successImage from '../assets/sucessImage.svg';
import errorImage from '../assets/errorImage.svg';
import Logo from '../assets/Logo.png';

const Topup = () => {
  const [formData, setFormData] = useState({ topup: 0 });
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [topupAmount, setTopupAmount] = useState(0);
  const [modalType, setModalType] = useState('success');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value ? Number(value) : '' });
  };

  const handleNominalClick = (amount) => {
    setFormData({ ...formData, topup: amount });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      setErrorMessage('Token tidak tersedia, silakan login kembali.');
      setModalType('error');
      setShowModal(true);
      return;
    }

    if (formData.topup <= 0 || isNaN(formData.topup)) {
      setErrorMessage('Parameter amount hanya boleh angka dan tidak boleh lebih kecil dari 0');
      setModalType('error');
      setShowModal(true);
      return;
    }

    setTopupAmount(formData.topup);
    setConfirmModal(true);
  };

  const confirmTopup = async () => {
    setConfirmModal(false);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('https://take-home-test-api.nutech-integrasi.com/topup', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ top_up_amount: topupAmount }),
      });

      const data = await response.json();
      if (response.ok && data.status === 0) {
        setModalType('success');
        setShowModal(true);
        setFormData({ topup: 0 });
      } else {
        setErrorMessage(data.message || 'Gagal melakukan top up.');
        setModalType('error');
        setShowModal(true);
      }
    } catch (error) {
      setErrorMessage('Terjadi kesalahan saat melakukan top up.');
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
        <p className="text-2xl">Silahkan masukan</p>
        <p className="font-bold text-3xl">Nominal Top Up</p>
        <div className="lg:flex gap-8 w-full">
          <div className="lg:w-1/2">
            <form onSubmit={handleSubmit}>
              <InputField
                name="topup"
                placeholder="Masukan nominal top up"
                type="number"
                value={formData.topup === 0 ? '' : formData.topup}
                onChange={handleChange}
                icon={faWallet}
              />
              <button
                type="submit"
                className={`w-full mt-4 p-2 rounded ${formData.topup > 0 ? 'bg-red-500 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                disabled={formData.topup <= 0} 
              >
                Top Up
              </button>
              {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
            </form>
          </div>
          <div className="lg:w-1/2 flex flex-col gap-4 mt-4">
            <div className="flex gap-4 justify-center items-center">
              <button onClick={() => handleNominalClick(10000)} className="border shadow-lg border-gray-200 w-full p-2 rounded hover:bg-red-500 hover:text-white">Rp10.000</button>
              <button onClick={() => handleNominalClick(20000)} className="border shadow-lg border-gray-200 w-full p-2 rounded hover:bg-red-500 hover:text-white">Rp20.000</button>
              <button onClick={() => handleNominalClick(50000)} className="border shadow-lg border-gray-200 w-full p-2 rounded hover:bg-red-500 hover:text-white">Rp50.000</button>
            </div>
            <div className="flex gap-4 justify-center items-center">
              <button onClick={() => handleNominalClick(100000)} className="border shadow-lg border-gray-200 w-full p-2 rounded hover:bg-red-500 hover:text-white">Rp100.000</button>
              <button onClick={() => handleNominalClick(250000)} className="border shadow-lg border-gray-200 w-full p-2 rounded hover:bg-red-500 hover:text-white">Rp250.000</button>
              <button onClick={() => handleNominalClick(500000)} className="border shadow-lg border-gray-200 w-full p-2 rounded hover:bg-red-500 hover:text-white">Rp500.000</button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title="Top Up sebesar"
        message={modalType === 'success' ? "berhasil!" : "gagal!"}
        image={modalType === 'success' ? successImage : errorImage}
        amount={topupAmount}
      />

      {confirmModal && (
        <Modal
          isOpen={confirmModal}
          onClose={handleCloseModal}
          title="Anda yakin untuk Top Up sebesar"
          message={`Rp${topupAmount.toLocaleString('id-ID')} ?`}
          image={Logo}
          onConfirm={confirmTopup} 
          confirmButtonText="Ya, Lanjutkan Top Up"
          cancelButtonText="Batalkan"
        />
      )}
    </div>
  );
};

export default Topup;
