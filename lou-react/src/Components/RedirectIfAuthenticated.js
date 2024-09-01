// src/components/RedirectIfAuthenticated.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const RedirectIfAuthenticated = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    // Si l'utilisateur est authentifié, rediriger vers la page visual-testing
    return <Navigate to="/visual-testing" />;
  }

  // Sinon, rendre les enfants (page de connexion)
  return children;
};

export default RedirectIfAuthenticated;
