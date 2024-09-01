// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

// Composant de route protégée
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Si l'utilisateur n'est pas authentifié, redirigez vers /login
    return <Navigate to="/login" />;
  }

  // Sinon, rend le composant enfant (la page protégée)
  return children;
};

export default ProtectedRoute;
