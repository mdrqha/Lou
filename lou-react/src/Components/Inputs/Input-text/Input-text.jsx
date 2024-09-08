import React from 'react';
import "./Input-text.scss";

// Composant de bouton de menu généralisé
const InputText = ({type, value, onChange, placeholder, className = '', required = false}) => {
  return (
      <input 
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`lou-p-xs lou-bg-dark-50 lou-rounded-sm hover:lou-bg-dark-100 lou-transition-all lou-duration-300 ${className}`}
      />
  );
};

export default InputText;
