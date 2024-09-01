// src/components/RedirectIfAuthenticated.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const RedirectIfAuthenticated = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated && (location.pathname === "/login" || location.pathname === "/register")) {
    // Rediriger vers /visual-testing si l'utilisateur est authentifié et essaie d'accéder à /login ou /register
    return <Navigate to="/visual-testing" />;
  }

  // Sinon, afficher le composant enfant
  return children;
};

export default RedirectIfAuthenticated;
