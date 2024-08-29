import React, { useState } from 'react';
import axios from 'axios';
import Menu from './Menu/Menu';
import './i18n';
import { useTranslation } from 'react-i18next';
import Header from './Header/Header';
import InputText from './Components/Inputs/Input-text/Input-text';
import Button from './Components/Buttons/Button/Button';
import { figmaFetchFrames } from './Visual-testing/JS/Fetch-Figma';
import { fetchProductDom } from './Visual-testing/JS/Fecth-product-url';
import { compareData } from './Visual-testing/JS/Compare-jsons';

const FigmaFrameCounter = () => {
const [url, setUrl] = useState('');
const [productUrl, setProductUrl] = useState('');
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [allFigmaComponent, setAllFigmaComponent] = useState([]);
const [frameCount, setFrameCount] = useState(null);
const [figmaData, setFigmaData] = useState(null);
const [domJson, setDomJson] = useState(null);

const handleCompareClick = async () => {
  // Assurez-vous de passer toutes les fonctions d'état nécessaires
  await compareData(url, productUrl, setLoading, setError, setAllFigmaComponent, setFrameCount, setFigmaData, setDomJson);
};

const { t } = useTranslation();

  return (
    <div className="lou-w-screen lou-h-screen lou-bg-dark-30 lou-gap-md lou-grid lou-grid-cols-layout-main lou-p-sm" lou-component="page">
      <Menu />
      <div className='lou-grid lou-grid-rows-[auto_1fr] lou-gap-lg lou-overflow-auto' lou-component='right-container'>
        <Header />
        <main className='lou-bg-white lou-rounded lou-border lou-border-dark-50 lou-grid lou-grid-rows-[auto_1fr] lou-overflow-auto'>
          <section className='lou-grid lou-grid-cols-[1fr_1fr_auto] lou-gap-sm lou-border-b lou-border-dark-50 lou-p-sm'>
            <InputText
              placeholder='URL Figma'
              type="text"
              value={url}
              onChange={(e) => {setUrl(e.target.value);}}
            />
            <InputText
              placeholder='URL produit'
              type="text"
              value={productUrl}
              onChange={(e) => setProductUrl(e.target.value)}
            />
            <Button
              text='Fetch Figma'
              // FIGMA FETCH
              onClick={() => {figmaFetchFrames(url, setLoading, setError, setAllFigmaComponent, setFrameCount, setFigmaData);}}
            />
            <Button
              text='Fetch URL produit'
              // FIGMA FETCH
              // onClick={() => {figmaFetchFrames();}}
              onClick={() => {fetchProductDom(productUrl, setLoading, setError, setDomJson);}}
            />
            <Button
              text='Compare'
              // FIGMA FETCH
              // onClick={() => {figmaFetchFrames();}}
              onClick={() => {handleCompareClick();}}
            />
          </section>
          <section className='lou-p-sm lou-overflow-auto'>
            <h3 className='lou-text-2xl lou-font-bold'>
              {t('visual-design.results-tilte')} <span className='lou-text-base lou-font-medium lou-pl-xs lou-text-danger'>X {t('visual-design.results-errors')}</span>
            </h3>

            {loading ? (  // Affichage du spinner pendant le chargement
              <div className="spinner">Loading...</div>
            ) : (
              <>
                {/*{error && <p className="text-red-500">{error}</p>}*/}
                {/*{frameCount !== null && <p className="text-green-500">Number of frames found: {frameCount}</p>}*/}
                {/*{allFigmaComponent && allFigmaComponent.map((component, index) => (*/}
                 {/* <div key={index}>*/}
                  {/*  <pre>{JSON.stringify(component, null, 2)}</pre>*/}
                  {/*</div>*/}
                {/*))}*/}
              </>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default FigmaFrameCounter;
