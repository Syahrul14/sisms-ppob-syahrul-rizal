import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import CardingSaldo from './carding/CardingSaldo';

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [offset, setOffset] = useState(0);
  const limit = 5;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
  
    const formattedDate = date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  
    const formattedTime = date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  
    return `${formattedDate} ${formattedTime} WIB`;
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setErrorMessage('Token tidak tersedia, silakan login kembali.');
          return;
        }

        const response = await fetch(`https://take-home-test-api.nutech-integrasi.com/transaction/history?offset=${offset}&limit=${limit}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok && data.status === 0) {
          setTransactions((prevTransactions) => [
            ...prevTransactions,
            ...data.data.records,
          ]);
        } else {
          setErrorMessage(data.message || 'Gagal mengambil riwayat transaksi.');
        }
      } catch (error) {
        setErrorMessage('Terjadi kesalahan saat mengakses riwayat transaksi.');
      }
    };

    fetchTransactions();
  }, [offset]);

  const handleShowMore = () => {
    setOffset((prevOffset) => prevOffset + limit);
  };

  return (
    <div>
      <Navbar />
      <CardingSaldo />
      <div className="px-4 md:px-20 mt-10">
        <p className="text-xl md:text-2xl font-bold">Semua Transaksi</p>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {transactions.map((transaction, index) => (
          <div key={index} className="w-full border rounded-lg shadow-md mt-6 p-4">
            <div className="flex flex-col md:flex-row justify-between">
              <p className={`text-lg md:text-2xl font-bold ${transaction.transaction_type === "TOPUP" ? "text-green-500" : "text-red-500"}`}>
                {transaction.transaction_type === "TOPUP" ? `+ Rp.${new Intl.NumberFormat('id-ID').format(transaction.total_amount)}` : `- Rp.${new Intl.NumberFormat('id-ID').format(transaction.total_amount)}`}
              </p>
              <p className="text-md font-bold mt-2 md:mt-0">{transaction.transaction_type === "TOPUP" ? "Top Up Saldo" : transaction.description}</p>
            </div>
            <p className="text-sm text-gray-400 font-semibold mt-4">{formatDate(transaction.created_on)}</p>
          </div>
        ))}
        <p 
          className="text-lg text-red-500 font-bold mt-10 text-center cursor-pointer"
          onClick={handleShowMore}
        >
          Show more
        </p>
      </div>
    </div>
  );
};

export default Transaction;
