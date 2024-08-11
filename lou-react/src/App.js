import React, { useState } from 'react';
import axios from 'axios';
import Menu from './Menu/Menu';
import './i18n';
import { useTranslation } from 'react-i18next';
import Header from './Header/Header';
import InputText from './Components/Inputs/Input-text/Input-text';
import Button from './Components/Buttons/Button/Button';

const FigmaFrameCounter = () => {
  const [url, setUrl] = useState('');
  const [frameCount, setFrameCount] = useState(null);
  const [error, setError] = useState(null);

  const extractIdsFromUrl = (url) => {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      const fileId = pathParts[2];
      const searchParams = new URLSearchParams(urlObj.search);
      const nodeId = searchParams.get('node-id');
      return { fileId, nodeId };
    } catch (err) {
      setError('Invalid URL');
      return null;
    }
  };

  const fetchFrames = async () => {
    const ids = extractIdsFromUrl(url);
    if (!ids) return;
  
    const { fileId, nodeId } = ids;
    try {
      const response = await axios.get(`http://localhost:3001/figma`, {
        params: { fileId, nodeId }
      });
  
      //console.log('Données reçues:', response.data);
      //console.log('Noeds 1:', response.data.nodes['0:1']);
      
      const figmaDataNodes = response.data.nodes;

      // Fonction récursive pour parcourir les nœuds
      function traverseFigmaData(node, level = 0) {
          if (!node || !node.children) {
              return;
          }
          console.log("");
            console.log("");
      
          Object.keys(node.children).forEach(childKey => {
              const child = node.children[childKey];
              console.log(`Niveau ${level}, Enfant n°${childKey}:`);
              console.log('Object Full', child);
              console.log(child.name);
      
              // Appel récursif pour parcourir les enfants du nœud courant
              traverseFigmaData(child, level + 1);
          });
      }
      
      // Parcours de tous les nœuds de données
      Object.keys(figmaDataNodes).forEach(nodeKey => {
          const figmaDataItem = figmaDataNodes[nodeKey].document;
          console.log(`Nœud principal: ${nodeKey}`, figmaDataItem);
      
          // Appel de la fonction récursive pour chaque nœud principal
          traverseFigmaData(figmaDataItem);
      });
      


      
  
      // Vérifier la présence des nodes et du document dans les données reçues
      if (response.data && response.data.nodes && response.data.nodes[nodeId]) {
        const nodeData = response.data.nodes[nodeId];
  
        // Vérifier la présence du document et des children
        if (nodeData && nodeData.document) {
          const frames = nodeData.document.children.filter(child => child.type === 'FRAME');
          setFrameCount(frames.length);
          setError(null);
        } else {
          setError('No document found or invalid data structure.');
          setFrameCount(null);
        }
      } else {
        setError('Invalid response data structure.');
        setFrameCount(null);
      }
  
    } catch (err) {
      console.error('Erreur lors de la récupération des frames:', err);
      setError('Error fetching frames. Please check the URL and try again.');
      setFrameCount(null);
    }
  };
  
  
  const { t } = useTranslation();
  return (
    // <div className="max-w-md mx-auto p-4">
    //   <h1 className="text-2xl font-bold mb-4">Figma Frame Counter</h1>
    //   <div className="mb-4">
    //     <input
    //       type="text"
    //       value={url}
    //       onChange={(e) => setUrl(e.target.value)}
    //       placeholder="Enter Figma URL"
    //       className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
    //     />
    //   </div>
    //   <div className="mb-4">
    //     <button
    //       onClick={fetchFrames}
    //       className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    //     >
    //       Search
    //     </button>
    //   </div>
    //   {error && <p className="text-red-500">{error}</p>}
    //   {frameCount !== null && <p className="text-green-500">Number of frames found: {frameCount}</p>}
    // </div>

    // </div>

    <div className="lou-w-screen lou-h-screen lou-bg-dark-30 lou-gap-md lou-grid lou-grid-cols-layout-main lou-p-sm" lou-component="page">
      <Menu />
      <div className='lou-grid lou-grid-rows-[auto_1fr] lou-gap-lg' lou-component='right-container'>
        <Header />
        <main className='lou-bg-white lou-rounded lou-shadow-lg lou-border lou-border-dark-50'>
          <section className='lou-grid lou-grid-cols-[1fr_1fr_auto] lou-gap-sm lou-border-b lou-border-dark-50 lou-p-sm'>
            <InputText
              placeholder='URL Figma'
            />
            <InputText
              placeholder='URL produit'
            />
            <Button
              text='Comparer'
              type='submit'
            />
          </section>
          <section className='lou-p-sm'>
            <h3 className='lou-text-2xl lou-font-bold'>{t('visual-design.results-tilte')} <span className='lou-text-base lou-font-medium lou-pl-xs lou-text-danger'>X {t('visual-design.results-errors')}</span></h3>

          </section>
        </main>
      </div>
    </div>
  );
};

export default FigmaFrameCounter;
