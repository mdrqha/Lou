import React, { useState } from 'react';
import '../../i18n';
import { useTranslation } from 'react-i18next';
import Header from '../../Components/Header/Header';

const EndToEndPage = () => {

const { t } = useTranslation();

  return (
    <div className='lou-grid lou-grid-rows-[auto_1fr] lou-gap-lg lou-overflow-auto' lou-component='right-container'>
        <Header />
        <main className='lou-bg-white lou-rounded lou-border lou-border-dark-50 lou-grid lou-grid-rows-[auto_1fr] lou-overflow-auto'>
            
            END TO END
            
        </main>
    </div>
  );
};

export default EndToEndPage;
