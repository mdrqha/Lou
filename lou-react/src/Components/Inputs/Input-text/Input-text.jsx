import React from 'react';
import "./Input-text.scss";

// Composant de bouton de menu généralisé
const InputText = ({type, value, onChange, placeholder, className = '', required = false, icon = null}) => {
  return (
    <div className='lou-relative lou-flex lou-items-center'>
      {icon && (
        <span className="lou-absolute lou-left-3 lou-text-dark-400 lou-text-sm">
          {icon}
        </span>
      )}
      <input 
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`lou-p-xs lou-w-full lou-bg-dark-50 lou-rounded-sm hover:lou-bg-dark-100 lou-transition-all lou-duration-300 ${icon ? 'lou-pl-xl' : ''} ${className}`}
      />
    </div>
  );
};

export default InputText;
