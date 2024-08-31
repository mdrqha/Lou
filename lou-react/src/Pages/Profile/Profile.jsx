import React, { useState } from 'react';
import '../../i18n';
import { useTranslation } from 'react-i18next';
import Header from '../../Components/Header/Header';
import InputText from '../../Components/Inputs/Input-text/Input-text';
import Button from '../../Components/Buttons/Button/Button';
import { compareData } from '../Visual-testing/Compare-jsons';

const ProfilePage = () => {
const [url, setUrl] = useState('');
const [productUrl, setProductUrl] = useState('');
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [allFigmaComponent, setAllFigmaComponent] = useState([]);
const [frameCount, setFrameCount] = useState(null);
const [figmaData, setFigmaData] = useState(null);
const [domJson, setDomJson] = useState(null);


const { t } = useTranslation();

  return (
    <div className='lou-grid lou-grid-rows-[auto_1fr] lou-gap-lg lou-overflow-auto' lou-component='right-container'>
        <Header />
        <main className='lou-bg-white lou-rounded lou-border lou-border-dark-50 lou-grid lou-grid-rows-[auto_1fr] lou-overflow-auto'>
            
            
        </main>
    </div>
  );
};

export default ProfilePage;
