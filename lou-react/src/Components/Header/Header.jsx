import React from 'react';
import './Header.scss';
import UserDropdown from '../User-dropdown/User-dropdown';
import { useTranslation } from 'react-i18next';
import { FiAlignLeft, FiArrowDownLeft, FiArrowLeft, FiChevronDown, FiChevronLeft, FiChevronsLeft, FiCoffee, FiEye, FiFolder, FiHelpCircle, FiLayers, FiSettings, FiTrash } from 'react-icons/fi';

const Header = () => {
  const { t } = useTranslation();
  return (
    <div className='lou-grid lou-grid-cols-[1fr_auto]' lou-component='header'>
        <section className='lou-flex lou-items-center lou-gap-xs'>
            <FiArrowLeft className='lou-text-dark lou-text-lg'/>
            <h3 className='lou-text-2xl lou-font-bold'>Titre de la page</h3>
        </section>
        <UserDropdown />
    </div>
  );
};

export default Header;
