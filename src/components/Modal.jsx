// Modal.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Modal = ({ isOpen, onClose, title, message, image, amount, onConfirm, confirmButtonText, cancelButtonText }) => {
  console.log(message);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-5 rounded shadow-lg">
        {image && (
          <div className="flex justify-center">
            <img src={image} alt="Modal Gambar" className="mt-2 w-10 rounded" />
          </div>
        )}
        <p className="text-lg text-gray-500 font-bold text-center">{title}</p>
        {amount !== undefined && (
          <p className="text-lg text-black-500 font-bold text-center">Rp{amount.toLocaleString('id-ID')}</p>
        )}
        <p className={`mt-2 text-black text-lg text-center ${message !== "berhasil!" && message !== "gagal!" ? "font-bold" : ""}`}>
          {message}
        </p>
        <div className="flex flex-col justify-centertext-center mt-4">
          {onConfirm && (
            <button onClick={onConfirm} className="text-red-500 font-bold p-2 rounded mr-2">
              {confirmButtonText}
            </button>
          )}

          <Link to="/dashboard" className="text-center">
            <button onClick={onClose} className={`${cancelButtonText ? "text-gray-500" : "text-red-500"} ${!cancelButtonText ? "font-bold" : ""}`}>
              {cancelButtonText || "Kembali ke Beranda"}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Modal; 
