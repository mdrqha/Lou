import React from 'react';
import './User-dropdown.scss';
import { useTranslation } from 'react-i18next';
import { FiChevronDown } from 'react-icons/fi';

const UserDropdown = () => {
  const { t } = useTranslation();
  return (
    <section className='lou-bg-white lou-rounded-xl lou-p-2xs lou-pr-xs lou-grid lou-grid-cols-[1fr_auto] lou-items-center lou-gap-sm hover:lou-cursor-pointer'>
        <div className='header--avatar lou-w-[32px] lou-h-[32px] lou-rounded-xl'></div>
        <div className='lou-grid lou-grid-cols-[1fr_auto] lou-items-center lou-gap-2xs'>
            <p className='lou-text-sm'>User Name</p>
            <FiChevronDown className='lou-text-dark-400'/>
        </div>
    </section>
  );
};

export default UserDropdown;
