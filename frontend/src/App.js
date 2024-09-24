import React, { useEffect, useState } from 'react';
import './i18n';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom';
import Menu from './Components/Menu/Menu';
import VisualTestingPage from './Pages/Visual-testing/Visual-testing';
import DesignSystemPage from './Pages/Design-system/Design-system';
import EndToEndPage from './Pages/End-to-end/End-to-end';
import ProofreadingPage from './Pages/Proofreading/Proofreading';
import ProfilePage from './Pages/Profile/Profile';
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import { AuthProvider, useAuth } from './Context/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute';
import RedirectIfAuthenticated from './Components/RedirectIfAuthenticated';
import axios from 'axios';
import VisualTestingDetailPage from './Pages/Visual-testing/Details/Visual-testing-details';

const LouAppContent = () => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [userLang, setUserLang] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isMenuClosed, setIsMenuClosed] = useState(() => {
    // Récupérer l'état de isMenuClosed à partir du localStorage, sinon retourner false par défaut
    const savedState = localStorage.getItem('isMenuClosed');
    return savedState ? JSON.parse(savedState) : false;
  });

  // Utiliser useEffect pour mettre à jour le localStorage chaque fois que isMenuClosed change
  useEffect(() => {
    localStorage.setItem('isMenuClosed', JSON.stringify(isMenuClosed));
  }, [isMenuClosed]);

  useEffect(() => {
    // Vérifier la taille de la fenêtre une seule fois au montage du composant
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsMenuClosed(true); // Fermer le menu si la taille de la fenêtre est inférieure à 1024px
      }
    };

    // Appel initial lors du montage du composant
    handleResize();

    // Ajouter un écouteur pour le redimensionnement de la fenêtre
    window.addEventListener('resize', handleResize);

    // Nettoyer l'écouteur lors du démontage
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Pas de dépendance à isMenuClosed ici, donc pas de boucle

  useEffect(() => {
    const fetchUserLanguage = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:50005/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userLanguage = response.data.lang; // Récupère la langue depuis l'API
        setUserLang(userLanguage); // Met à jour la langue dans le state local
        i18n.changeLanguage(userLanguage); // Change la langue de l'application
      } catch (error) {
        console.error("Erreur lors de la récupération de la langue de l'utilisateur:", error);
      } finally {
        setLoading(false); // Fin du chargement une fois la langue définie
      }
    };

    fetchUserLanguage();
  }, [i18n]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:50005/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur:", error);
        setError(error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const hideMenuPaths = ['/login', '/register', '/profile'];
  const hideMenu = hideMenuPaths.includes(location.pathname);
  const withMenuClass = hideMenu
    ? ''
    : isMenuClosed
    ? 'lou-grid-cols-layout-close lou-bg-dark-30 lou-duration-200' // Menu fermé
    : 'lou-grid-cols-layout-main lou-bg-dark-30 lou-duration-200';

  const toggleMenuLayout = () => {
    setIsMenuClosed(!isMenuClosed);
  };

  const { t } = useTranslation();

  if (loading) {
    return <p>Loading language...</p>;
  }

  return (
    <div className={`lou-text-dark lou-w-screen lou-h-screen lou-gap-md lou-grid ${withMenuClass} lou-p-sm`} lou-component='page'>
      {!hideMenu && <Menu onToggleMenu={toggleMenuLayout} isMenuClosed={isMenuClosed} />}
      <Routes>
        {/* Utiliser RedirectIfAuthenticated pour rediriger les utilisateurs authentifiés depuis /login et /register */}
        <Route
          path='/login'
          element={
            <RedirectIfAuthenticated>
              <Login />
            </RedirectIfAuthenticated>
          }
        />
        <Route
          path='/register'
          element={
            <RedirectIfAuthenticated>
              <Register />
            </RedirectIfAuthenticated>
          }
        />

        {/* Routes Protégées */}
        <Route
          path='/visual-testing'
          element={
            <ProtectedRoute>
              <VisualTestingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/visual-testing/:projectId'
          element={
            <ProtectedRoute>
              <VisualTestingDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/design-system'
          element={
            <ProtectedRoute>
              <DesignSystemPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/end-to-end'
          element={
            <ProtectedRoute>
              <EndToEndPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/proofreading'
          element={
            <ProtectedRoute>
              <ProofreadingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

const LouApp = () => {
  return (
    <AuthProvider>
      {' '}
      {/* AuthProvider doit envelopper l'ensemble du Router */}
      <Router>
        <LouAppContent />
      </Router>
    </AuthProvider>
  );
};

export default LouApp;
