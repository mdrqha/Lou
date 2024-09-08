import React, { useState, useEffect } from 'react';
import '../../i18n';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiX } from 'react-icons/fi'

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lang, setLang] = useState("en"); // Langue par défaut
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();

  // Récupérer les informations utilisateur, y compris la langue
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:50005/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
        setLang(response.data.lang);  // Mettre à jour la langue depuis la base de données
        i18n.changeLanguage(response.data.lang);  // Changer la langue dans l'interface
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [i18n]);

  // Fonction pour gérer le changement de langue
  const handleLanguageChange = async (e) => {
    const selectedLanguage = e.target.value;
    setLang(selectedLanguage);
    i18n.changeLanguage(selectedLanguage);

    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:50005/api/auth/me/language', 
        { language: selectedLanguage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la langue:', error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Erreur: {error.message}</p>;

  return (
    <div className='lou-grid lou-gap-lg lou-overflow-auto'>
      <main className='lou-bg-white lou-rounded lou-border lou-border-dark-50 lou-grid lou-grid-rows-[auto_1fr] lou-overflow-auto lou-p-md'>
        <section className='lou-grid lou-grid-cols-[1fr_auto]'>
          <div>
            Mon profil
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
            <p>Mail</p>
            <h3>{user ? `${user.email}` : 'Pas de mail'}</h3>
          </div>
          <div>
            <p>Langue</p>
            {/* Sélection de la langue */}
            <select 
              value={lang}
              onChange={handleLanguageChange}
              className="lou-p-xs lou-bg-dark-50 lou-rounded-sm hover:lou-bg-dark-100 lou-transition-all lou-duration-300">
              <option value="en">{t('register.language.select.en')}</option>
              <option value="fr">{t('register.language.select.fr')}</option>
            </select>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProfilePage;
