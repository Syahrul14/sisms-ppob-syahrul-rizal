import { Link, useLocation } from 'react-router-dom';
import Logo from '../assets/Logo.png';

const Navbar = () => {
  const location = useLocation();

  return (
    <div className="shadow-lg p-4 px-20 flex justify-between items-center flex-wrap">
      <Link to="/dashboard" className="flex gap-2 items-center">
        <img src={Logo} alt="Logo" className="h-8 w-auto" />
        <p className="text-lg font-bold">SIMS PPOB</p>
      </Link>

      <div className="flex gap-4 mt-2 md:mt-0">
        <Link 
          to="/topup" 
          className={`hover:text-red-500 font-medium ${location.pathname === '/topup' ? 'text-red-500 font-bold' : ''}`}
        >
          Top up
        </Link>
        <Link 
          to="/transaction" 
          className={`hover:text-red-500 font-medium ${location.pathname === '/transaction' ? 'text-red-500 font-bold' : ''}`}
        >
          Transaction
        </Link>
        <Link 
          to="/akun" 
          className={`hover:text-red-500 font-medium ${location.pathname === '/akun' ? 'text-red-500 font-bold' : ''}`}
        >
          Akun
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
