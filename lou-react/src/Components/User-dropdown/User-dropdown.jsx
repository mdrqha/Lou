import React, { useEffect, useState } from 'react';
import './User-dropdown.scss';
import { useTranslation } from 'react-i18next';
import { FiChevronDown } from 'react-icons/fi';
import useUser from '../../Hooks/useUser';
import axios from 'axios';

const UserDropdown = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Erreur: {error.message}</p>;

  return (
    <section className='lou-bg-white lou-rounded-xl lou-p-2xs lou-pr-xs lou-grid lou-grid-cols-[1fr_auto] lou-items-center lou-gap-sm hover:lou-cursor-pointer'>
      <div className='header--avatar lou-w-[32px] lou-h-[32px] lou-rounded-xl'></div>
      <div className='lou-grid lou-grid-cols-[1fr_auto] lou-items-center lou-gap-2xs'>
        <p className='lou-text-sm'>{user ? `${t('welcome')}, ${user.username}` : 'Utilisateur'}</p>
        <FiChevronDown className='lou-text-dark-400'/>
      </div>
    </section>
  );
};

export default UserDropdown;
