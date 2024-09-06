import React, { useState, useEffect } from 'react';
import '../../i18n';
import { useTranslation } from 'react-i18next';
import Header from '../../Components/Header/Header';
import InputText from '../../Components/Inputs/Input-text/Input-text';
import Button from '../../Components/Buttons/Button/Button';
import { compareData } from '../Visual-testing/Compare-jsons';
import axios from 'axios';
import { FiChevronDown, FiCrosshair, FiLogOut, FiTrash, FiTrash2, FiUser, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../../Context/AuthContext';
import Dropdown from '../../Components/Dropdown/Dropdown';


const ProfilePage = () => {
const [url, setUrl] = useState('');
const [user, setUser] = useState(null);
const [productUrl, setProductUrl] = useState('');
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [allFigmaComponent, setAllFigmaComponent] = useState([]);
const [frameCount, setFrameCount] = useState(null);
const [figmaData, setFigmaData] = useState(null);
const [domJson, setDomJson] = useState(null);
const { i18n } = useTranslation();

  const handleLanguageChange = async (e) => {
    const selectedLanguage = e.target.value;
    
    i18n.changeLanguage(selectedLanguage);
    
    // Envoyer la nouvelle langue au backend pour la sauvegarder
    try {
      await axios.put(`http://localhost:50005/api/auth/me/language`, {
        language: selectedLanguage
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la langue:', error);
    }
  };

const navigate = useNavigate();

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

// const { t } = useTranslation();

  return (
    <div className='lou-grid lou-gap-lg lou-overflow-auto'>
        <main className='lou-bg-white lou-rounded lou-border lou-border-dark-50 lou-grid lou-grid-rows-[auto_1fr] lou-overflow-auto lou-p-md'>
          <section className='lou-grid lou-grid-cols-[1fr_auto]'>
            <div>
              Mon profile
            </div>
            <button onClick={() => navigate('/visual-testing')}>
              <FiX/>
            </button>
          </section>
          <section>
            <div>
              <p>Username</p>
              <h3>{user ? `${user.username}` : 'Utilisateur'}</h3>
            </div>
            <div>
              <p>mail</p>
              <h3>{user ? `${user.email}` : 'Pas de mail'}</h3>
            </div>
            <div>
              <p>Langue</p>
              <Dropdown 
                text='Langue'
                options={['English', 'Francais']}
              />
            </div>
          </section>
        </main>
    </div>
  );
};

export default ProfilePage;
