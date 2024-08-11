import React from 'react';
import "./Input-text.scss";

// Composant de bouton de menu généralisé
const InputText = ({ placeholder, className = ''}) => {
  return (
      <input 
        placeholder={placeholder}
        className={`lou-p-xs lou-bg-dark-50 lou-rounded-sm hover:lou-bg-dark-100 lou-transition-all lou-duration-300 ${className}`}
      />
  );
};

export default InputText;
