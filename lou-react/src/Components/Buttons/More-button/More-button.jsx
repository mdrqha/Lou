import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiMoreVertical } from 'react-icons/fi';
import Button from '../Button/Button';
import MoreButtonSubItem from './Sub-item/Sub-item';
import { text } from 'express';

const MoreButton = ({ subItem = [], variant = 'white'}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const buttonList = subItem;

//   const variantClasses = {
//     primary: 'lou-bg-white hover:lou-bg-primary-200',
//     success: 'lou-bg-white hover:lou-bg-success-100',
//     danger: 'lou-bg-white hover:lou-bg-danger-100',
//     warning: 'lou-bg-white hover:lou-bg-warning-100',
//     info: 'lou-bg-white hover:lou-bg-info-100',
//     white: 'lou-bg-white hover:lou-bg-dark-50'
//   };

  return (
    <section className='lou-relative'>
        <Button 
            iconOnly={true}
            icon={<FiMoreVertical/>}
            variant='white'
            onClick={toggleDropdown}
        />
      <div className={`lou-bg-white lou-z-10 lou-p-xs lou-border lou-border-dark-50 lou-absolute lou-right-0 lou-top-[2.8rem] lou-rounded-lg lou-w-[12rem] lou-transition-all lou-duration-300 lou-shadow-lg ${isOpen ? 'lou-translate-y-0 lou-opacity-1000' : 'lou--translate-y-2.5 lou-opacity-0 lou-pointer-events-none'}`}>
        {/* <button onClick={() => navigate('/profile')} className='lou-grid lou-gap-xs lou-grid-cols-[auto_1fr] lou-items-center lou-p-xs lou-w-full hover:lou-bg-dark-30 lou-rounded lou-transition-all lou-duration-300'> 
          <FiUser className='lou-text-dark-500'/>
          <span className='lou-text-left'>Profile</span>
        </button> */}
        {/* {buttonList.map((SubButton, index) => (
            // <button
            //     key={index}
            //     onClick={SubButton.click}
            //     className={`lou-grid lou-gap-xs lou-grid-cols-[auto_1fr] lou-items-center lou-p-xs lou-w-full hover:lou-bg-dark-30 lou-rounded lou-transition-all lou-duration-300 ${variantClasses[variant] || variantClasses.default}`}
            // >
            //     {SubButton.text}
            // </button>


            <MoreButtonSubItem
                key={index}
                text={SubButton.text}
                variant={variant}
                onClick={SubButton.click}
            />
        ))} */}


        {/* <button onClick={() => logout()} className='lou-grid lou-gap-xs lou-grid-cols-[auto_1fr] lou-items-center lou-p-xs lou-w-full hover:lou-bg-danger-50 lou-rounded lou-transition-all lou-duration-300'>
          <FiLogOut className='lou-text-danger' />
          <span className='lou-text-left'>Logout</span>
        </button> */}
      </div>
    </section>
  );
};

export default MoreButton;
