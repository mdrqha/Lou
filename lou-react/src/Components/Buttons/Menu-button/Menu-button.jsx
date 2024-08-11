import React from 'react';
import "./Menu-button.scss";

// Composant de bouton de menu généralisé
const MenuButton = ({ text, onClick, type = 'button', className = '', icon, isActive = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`lou-flex lou-gap-xs lou-w-full lou-p-xs lou-items-center lou-rounded-sm hover:lou-bg-dark-50 lou-transition-all lou-duration-300 ${isActive ? 'menu--item-active' : ''} ${className}`}
    >
      {icon && <span className='lou-opacity-400'>{icon}</span>} {/* Affiche l'icône s'il est passé en prop */}
      <p>{text}</p>
    </button>
  );
};

export default MenuButton;
