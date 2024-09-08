import React, { useEffect, useState } from 'react';
import './i18n';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, useParams } from "react-router-dom";
import Menu from './Components/Menu/Menu';
import VisualTestingPage from './Pages/Visual-testing/Visual-testing';
import DesignSystemPage from './Pages/Design-system/Design-system';
import EndToEndPage from './Pages/End-to-end/End-to-end';
import ProofreadingPage from './Pages/Proofreading/Proofreading';
import ProfilePage from './Pages/Profile/Profile';
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import { AuthProvider, useAuth } from './Context/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute';
import RedirectIfAuthenticated from './Components/RedirectIfAuthenticated';
import axios from 'axios';
import VisualTestingDetailPage from './Pages/Visual-testing/Details/Visual-testing-details';
import Button from './Components/Buttons/Button/Button';

const LouAppContent = () => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [userLang, setUserLang] = useState(null);


  useEffect(() => {
    const fetchUserLanguage = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:50005/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const userLanguage = response.data.lang;  // Récupère la langue depuis l'API
        setUserLang(userLanguage); // Met à jour la langue dans le state local
        i18n.changeLanguage(userLanguage);  // Change la langue de l'application
      } catch (error) {
        console.error('Erreur lors de la récupération de la langue de l\'utilisateur:', error);
      } finally {
        setLoading(false); // Fin du chargement une fois la langue définie
      }
    };

    fetchUserLanguage();
  }, [i18n]);

  const hideMenuPaths = ['/login', '/register', '/profile'];
  const hideMenu = hideMenuPaths.includes(location.pathname);
  const withMenuClass = hideMenu ? '' : 'lou-grid-cols-layout-main lou-bg-dark-30';

  const { t } = useTranslation();

  if (loading) {
    return <p>Loading language...</p>;
  }

  return (
    <div className={`lou-text-dark lou-w-screen lou-h-screen lou-gap-md lou-grid ${withMenuClass} lou-p-sm`} lou-component="page">
      {!hideMenu && <Menu />}
      <Routes>
        {/* Utiliser RedirectIfAuthenticated pour rediriger les utilisateurs authentifiés depuis /login et /register */}
        <Route path="/login" element={<RedirectIfAuthenticated><Login /></RedirectIfAuthenticated>} />
        <Route path="/register" element={<RedirectIfAuthenticated><Register /></RedirectIfAuthenticated>} />

        {/* Routes Protégées */}
        <Route path="/visual-testing" element={<ProtectedRoute><VisualTestingPage /></ProtectedRoute>} />
        <Route path="/visual-testing/:projectId" element={<ProtectedRoute><VisualTestingDetailPage /></ProtectedRoute>} />
        <Route path="/design-system" element={<ProtectedRoute><DesignSystemPage /></ProtectedRoute>} />
        <Route path="/end-to-end" element={<ProtectedRoute><EndToEndPage /></ProtectedRoute>} />
        <Route path="/proofreading" element={<ProtectedRoute><ProofreadingPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      </Routes>
    </div>
  );
};

const LouApp = () => {
  return (
    <AuthProvider> {/* AuthProvider doit envelopper l'ensemble du Router */}
      <Router>
        <LouAppContent />
      </Router>
    </AuthProvider>
  );
};

export default LouApp;
