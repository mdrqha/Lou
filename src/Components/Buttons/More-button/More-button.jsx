import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FiMoreVertical } from 'react-icons/fi';
import Button from '../Button/Button';
import MoreButtonSubItem from './Sub-item/Sub-item';
// import { text } from 'express';

const MoreButton = ({ subItem = [], variant = 'white', icon}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const buttonList = subItem;

  return (
    <section className='lou-relative' ref={dropdownRef}>
        <Button 
            iconOnly={true}
            icon={<FiMoreVertical/>}
            variant='white'
            onClick={toggleDropdown}
        />
      <div className={`lou-bg-white lou-z-10 lou-p-xs lou-border lou-border-dark-50 lou-absolute lou-right-0 lou-top-[2.8rem] lou-rounded-lg lou-w-[12rem] lou-transition-all lou-duration-300 lou-shadow-lg ${isOpen ? 'lou-translate-y-0 lou-opacity-1000' : 'lou--translate-y-2.5 lou-opacity-0 lou-pointer-events-none'}`}>
        {buttonList.map((SubButton, index) => (
            <MoreButtonSubItem
                key={index}
                text={SubButton.text}
                variant={SubButton.variant || variant}
                icon={SubButton.icon}
                onClick={SubButton.click}
            />
        ))}
      </div>
    </section>
  );
};

export default MoreButton;
