import React from 'react';
import "./Button.scss";

const Button = ({ text, onClick, type, className = '', isActive = false, variant = 'primary', iconOnly = false, icon }) => {
  const variantClasses = {
    primary: 'lou-bg-primary hover:lou-bg-primary-700',
    success: 'lou-bg-success hover:lou-bg-success-700 lou-text-white',
    danger: 'lou-bg-danger hover:lou-bg-danger-700 lou-text-white',
    warning: 'lou-bg-warning hover:lou-bg-warning-700 lou-text-white',
    info: 'lou-bg-info hover:lou-bg-info-700 lou-text-white',
    white: 'lou-bg-white hover:lou-bg-dark-50'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`lou-py-xs lou-px-sm lou-rounded-sm lou-transition-all lou-duration-300 ${variantClasses[variant] || variantClasses.default} ${isActive ? 'menu--item-active' : ''} ${iconOnly ? 'lou-w-[40px] lou-h-[40px]' : ''} ${className}`}
    >
      {iconOnly ? (
        <span>{icon}</span>
      ) : (
        <p>{text}</p>
      )}
    </button>
  );
};

export default Button;
