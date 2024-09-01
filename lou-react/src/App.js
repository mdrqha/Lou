import React, { useState, useEffect } from 'react';
import './i18n';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Menu from './Components/Menu/Menu';
import VisualTestingPage from './Pages/Visual-testing/Visual-testing';
import ProfilePage from './Pages/Profile/Profile';
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import { AuthProvider, useAuth } from './Context/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute';
import RedirectIfAuthenticated from './Components/RedirectIfAuthenticated';
import Button from './Components/Buttons/Button/Button';

const LouAppContent = () => {
  const [url, setUrl] = useState('');
  const [productUrl, setProductUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();  // Appelle la fonction logout pour déconnecter l'utilisateur
  };

  const location = useLocation();

  // Définir les chemins où le menu ne doit pas être affiché
  const hideMenuPaths = ['/login', '/register', '/profile'];
  const hideMenu = hideMenuPaths.includes(location.pathname);
  const withMenuClass = hideMenu ? '' : 'lou-grid-cols-layout-main';

  const { t } = useTranslation();

  return (
    <div className={`lou-text-dark lou-w-screen lou-h-screen lou-bg-dark-30 lou-gap-md lou-grid ${withMenuClass} lou-p-sm`} lou-component="page">
      {!hideMenu && <Menu />}
      {/* <Button
        text='LOGOUT'
        onClick={handleLogout}
      /> */}
      <Routes>
        <Route path="/login" element={<RedirectIfAuthenticated><Login /></RedirectIfAuthenticated>} />
        <Route path="/register" element={<RedirectIfAuthenticated><Register /></RedirectIfAuthenticated>} />

        {/* Routes Protégées */}
        <Route path="/visual-testing" element={<ProtectedRoute><VisualTestingPage /></ProtectedRoute>} />
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
