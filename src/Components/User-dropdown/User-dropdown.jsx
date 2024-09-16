import React, { useEffect, useState } from 'react';
import './User-dropdown.scss';
import { useTranslation } from 'react-i18next';
import { FiChevronDown, FiLogOut, FiTrash, FiTrash2, FiUser } from 'react-icons/fi';
import useUser from '../../Hooks/useUser';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../../Context/AuthContext';


const UserDropdown = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:50005/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);


  return (
    <section className='lou-relative'>
      <button onClick={toggleDropdown} className='lou-bg-white lou-rounded-xl lou-p-2xs lou-pr-xs lou-grid lou-grid-cols-[1fr_auto] lou-items-center lou-gap-sm hover:lou-cursor-pointer'>
        <div className='header--avatar lou-w-[32px] lou-h-[32px] lou-rounded-xl'></div>
        <div className='lou-grid lou-grid-cols-[1fr_auto] lou-items-center lou-gap-2xs'>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Erreur: {error.message}</p>
          ) : (
            <p className='lou-text-sm'>{user ? `${user.username}` : 'Utilisateur'}</p>
          )}
          <FiChevronDown className='lou-text-dark-400'/>
        </div>
      </button>
      <div className={`lou-bg-white lou-z-10 lou-p-xs lou-border lou-border-dark-50 lou-absolute lou-right-0 lou-top-[2.8rem] lou-rounded-lg lou-w-[12rem] lou-transition-all lou-duration-300 lou-shadow-lg ${isOpen ? 'lou-translate-y-0 lou-opacity-1000' : 'lou--translate-y-2.5 lou-opacity-0 lou-pointer-events-none'}`}>
        <button onClick={() => navigate('/profile')} className='lou-grid lou-gap-xs lou-grid-cols-[auto_1fr] lou-items-center lou-p-xs lou-w-full hover:lou-bg-dark-30 lou-rounded lou-transition-all lou-duration-300'> 
          <FiUser className='lou-text-dark-500'/>
          <span className='lou-text-left'>Profile</span>
        </button>

        <button onClick={() => logout()} className='lou-grid lou-gap-xs lou-grid-cols-[auto_1fr] lou-items-center lou-p-xs lou-w-full hover:lou-bg-danger-50 lou-rounded lou-transition-all lou-duration-300'>
          <FiLogOut className='lou-text-danger' />
          <span className='lou-text-left'>Logout</span>
        </button>
      </div>
    </section>
  );
};

export default UserDropdown;
