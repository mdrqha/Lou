import React from 'react';
import './i18n';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
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
import Button from './Components/Buttons/Button/Button';

const LouAppContent = () => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const goToProfile = () => {
    navigate('/profile');
  };

  // Définir les chemins où le menu ne doit pas être affiché
  const hideMenuPaths = ['/login', '/register', '/profile'];
  const hideMenu = hideMenuPaths.includes(location.pathname);
  const withMenuClass = hideMenu ? '' : 'lou-grid-cols-layout-main lou-bg-dark-30';

  const { t } = useTranslation();

  return (
    <div className={`lou-text-dark lou-w-screen lou-h-screen lou-gap-md lou-grid ${withMenuClass} lou-p-sm`} lou-component="page">
      {!hideMenu && <Menu />}
      {/* Afficher le bouton de déconnexion uniquement si l'utilisateur est authentifié */}
      {/* <div>
        {isAuthenticated && (
          <Button
            text='LOGOUT'
            onClick={handleLogout}
          />
        )}
      </div> */}
      <Routes>
        {/* Utiliser RedirectIfAuthenticated pour rediriger les utilisateurs authentifiés depuis /login et /register */}
        <Route path="/login" element={<RedirectIfAuthenticated><Login /></RedirectIfAuthenticated>} />
        <Route path="/register" element={<RedirectIfAuthenticated><Register /></RedirectIfAuthenticated>} />

        {/* Routes Protégées */}
        <Route path="/visual-testing" element={<ProtectedRoute><VisualTestingPage /></ProtectedRoute>} />
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
