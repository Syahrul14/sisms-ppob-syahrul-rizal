import React, { useEffect } from 'react';

const Toast = ({ message, onClose, success }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast w-1/3 fixed bottom-4 left-4 ${success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} rounded-lg p-4 shadow-lg transition-opacity duration-300`}>
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button onClick={onClose} className={`ml-4 font-bold ${success ? 'text-green-700' : 'text-red-700'}`}>
          &times;
        </button>
      </div>
    </div>
  );
};

export default Toast;
