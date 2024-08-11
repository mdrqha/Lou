import React from 'react';
import "./Button.scss";

const Button = ({ text, onClick, type, className = '', isActive = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`lou-py-xs lou-px-sm lou-rounded-sm lou-bg-primary hover:lou-bg-primary-700 lou-transition-all lou-duration-300 ${isActive ? 'menu--item-active' : ''} ${className}`}
    >
      <p>{text}</p>
    </button>
  );
};

export default Button;
