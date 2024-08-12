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
  const [loading, setLoading] = useState(false);
  const [figmaData, setFigmaData] = useState(null);
  const [allFigmaComponent, setAllFigmaComponent] = useState([]);

  //const [figmaJsonCompare, setToFigmaJson] = useState(null);

  const validateUrl = (url) => {
    const trimmedUrl = url.trim();
    if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
      throw new Error('URL must start with "http://" or "https://"');
    }
    return trimmedUrl;
  };

  const extractComponentNameAndValues = (node) => {
    const componentName = extractComponentName(node.name); // Extrait le nom après [component:]
    
    if (componentName) {
      // Crée un objet avec le nom du composant comme clé et les valeurs du nœud comme valeur
      const componentData = {
        name: componentName,
        values: {
          fills: node.fills || [],
          strokes: node.strokes || [],
          effects: node.effects || [],
          children: node.children ? node.children.map(child => extractComponentNameAndValues(child)) : [],
          // Ajoutez ici d'autres propriétés du nœud que vous souhaitez inclure
        }
      };
  
      return componentData;
    }
    
    return null; // Si le nom n'a pas de [component:], renvoie null
  };
  


  const extractIdsFromUrl = (url) => {
    try {
      const validUrl = validateUrl(url);
      const urlObj = new URL(validUrl);
      const pathParts = urlObj.pathname.split('/');
  
      // Récupérer le fileId et nodeId selon le chemin
      let fileId, nodeId;
  
      if (pathParts.includes('file')) {
        fileId = pathParts[pathParts.indexOf('file') + 1];
      } else if (pathParts.includes('design')) {
        fileId = pathParts[pathParts.indexOf('design') + 1];
      } else {
        throw new Error('URL must contain "/file/" or "/design/"');
      }
  
      const searchParams = new URLSearchParams(urlObj.search);
      nodeId = searchParams.get('node-id');
  
      if (!fileId || !nodeId) {
        throw new Error('Missing fileId or nodeId');
      }
  
      return { fileId, nodeId };
    } catch (err) {
      console.error('Error extracting IDs from URL:', err);
      setError('Invalid URL');
      return null;
    }
  };

  const extractComponentName = (name) => {
    const match = name.match(/\[component:(.*?)\]/);
    return match ? match[1] : null;
  };
  
  const extractComponentToJson = (node) => {
    let figmaComponent = [];
  
    if (node.name && node.name.includes('[component:')) {
      let componentName = extractComponentName(node.name);
      //console.log(componentName)

      figmaComponent.push({
          "nodeTOREMOVE" : node,
          "name" : componentName,
          "background-color" : (node.background && node.background[0]) ? node.background[0].color : null,
          "effects" : node.effects ? node.effects : null, // récupérer les effets différents et écrire différent type d'effets comme le css
          "border-radius" : node.cornerRadius ? `${node.cornerRadius}px` : null,
          "border-width" : node.strokeWeight ? `${node.strokeWeight}px` : null,
          "border-color" : (node.strokes && node.strokes[0]) ? node.strokes[0].color : null, // convertir rgba en hex
          "border-style" : (node.strokes && node.strokes[0]) ? node.strokes[0].type : null,
          "border" : node.strokes ? node.strokes : null, // attention à individualStrokeWeight
          "gap" : node.itemSpacing ? node.itemSpacing : null,
          "padding-left" : node.paddingLeft ? `${node.paddingLeft}px` :null,
          "padding-right" : node.paddingRight ? `${node.paddingRight}px` :null,
          "padding-top" : node.paddingTop ? `${node.paddingTop}px` :null,
          "padding-bottom" : node.paddingBottom ? `${node.paddingBottom}px` :null,
          "padding" : `${node.paddingTop !== undefined ? node.paddingTop + 'px' : '0px'} ${node.paddingRight !== undefined ? node.paddingRight + 'px' : '0px'} ${node.paddingBottom !== undefined ? node.paddingBottom + 'px' : '0px'} ${node.paddingLeft !== undefined ? node.paddingLeft + 'px' : '0px'}`,
        });
    }
  
    // Si le nœud a des enfants, on appelle la fonction récursive sur chaque enfant
    if (node.children && node.children.length > 0) {
      node.children.forEach((child) => {
        figmaComponent = figmaComponent.concat(extractComponentToJson(child));
      });
    }
  
    return figmaComponent;
  };
  

  const fetchFrames = async () => {
    const ids = extractIdsFromUrl(url);
    if (!ids) return;
  
    const { fileId, nodeId } = ids;
    setLoading(true);  // Activer le spinner
  
    try {
      const response = await axios.get(`http://localhost:3001/figma`, {
        params: { fileId, nodeId }
      });
  
      const figmaDataNodes = response.data.nodes;

      setFigmaData(figmaDataNodes);
  
      let allFigmaComponent = [];
      Object.keys(figmaDataNodes).forEach(nodeKey => {
        const figmaDataItem = figmaDataNodes[nodeKey].document;
        const figmaComponent = extractComponentToJson(figmaDataItem);
        allFigmaComponent = allFigmaComponent.concat(figmaComponent);
        console.log(allFigmaComponent) //Toutes les donnée dont j'ai besoin pour figma
      });
      setAllFigmaComponent(allFigmaComponent);
  
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
    } finally {
      setLoading(false);  // Désactiver le spinner
    }
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
            />
            <Button
              text='Comparer'
              onClick={() => {fetchFrames();}}
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
                {error && <p className="text-red-500">{error}</p>}
                {frameCount !== null && <p className="text-green-500">Number of frames found: {frameCount}</p>}
                {allFigmaComponent && allFigmaComponent.map((component, index) => (
                  <div key={index}>
                    <pre>{JSON.stringify(component, null, 2)}</pre>
                  </div>
                ))}
              </>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default FigmaFrameCounter;
