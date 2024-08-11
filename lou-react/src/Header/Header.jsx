import React from 'react';
import './Header.scss';
import { useTranslation } from 'react-i18next';
import { FiAlignLeft, FiArrowDownLeft, FiArrowLeft, FiChevronDown, FiChevronLeft, FiChevronsLeft, FiCoffee, FiEye, FiFolder, FiHelpCircle, FiLayers, FiSettings, FiTrash } from 'react-icons/fi';

const Header = () => {
  const { t } = useTranslation();
  return (
    <div className='lou-grid lou-grid-cols-[1fr_auto]' lou-component='header'>
        <section className='lou-flex lou-items-center lou-gap-xs'>
            <FiArrowLeft className='lou-text-dark lou-text-lg'/>
            <h3 className='lou-text-2xl lou-font-bold'>Test 2000</h3>
        </section>
        <section className='lou-bg-white lou-rounded-xl lou-p-2xs lou-pl-md lou-grid lou-grid-cols-[1fr_auto] lou-items-center lou-gap-sm hover:lou-cursor-pointer'>
            <div className='lou-grid lou-grid-cols-[1fr_auto] lou-items-center lou-gap-2xs'>
                <p>James L.</p>
                <FiChevronDown className='lou-text-dark-400'/>
            </div>
            <div className='header--avatar lou-w-[32px] lou-h-[32px] lou-rounded-xl'></div>
        </section>
    </div>
  );
};

export default Header;
