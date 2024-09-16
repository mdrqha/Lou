import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiMoreVertical } from 'react-icons/fi';


const MoreButtonSubItem = ({ text, onClick, icon, variant = 'white', key}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const variantClasses = {
    primary: 'lou-bg-white hover:lou-bg-primary-200',
    success: 'lou-bg-white hover:lou-bg-success-100',
    danger: 'lou-bg-white hover:lou-bg-danger-100',
    warning: 'lou-bg-white hover:lou-bg-warning-100',
    info: 'lou-bg-white hover:lou-bg-info-100',
    white: 'lou-bg-white hover:lou-bg-dark-50'
  };

  return (
    <button
        key={key}
        onClick={onClick}
        className={`lou-grid lou-gap-xs lou-grid-cols-[auto_1fr] lou-items-center lou-p-xs lou-w-full hover:lou-bg-dark-30 lou-rounded lou-transition-all lou-duration-300 ${variantClasses[variant] || variantClasses.default}`}
    >
        {icon && (<span>{icon}</span>)}{text}
    </button>
  );
};

export default MoreButtonSubItem;
