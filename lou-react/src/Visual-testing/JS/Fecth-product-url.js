import axios from 'axios';

const authToken = '1_HappyJames';

  const extractStylesheetUrls = (doc) => {
    const links = doc.querySelectorAll('link[rel="stylesheet"]');
    const urls = [];
    links.forEach(link => {
      let url = link.getAttribute('href');
      // Convertir les URLs relatives en absolues
      if (url && !url.startsWith('http')) {
        const baseUrl = new URL(doc.baseURI);
        url = new URL(url, baseUrl).href;
      }
      if (url) {
        urls.push(url);
      }
    });
    return urls;
  };
  
  const fetchAndInjectCss = async (iframe, url) => {
    try {
      const response = await axios.get(url);
      const cssText = response.data;
  
      // Injecter le CSS dans l'iframe
      const styleElement = document.createElement('style');
      styleElement.textContent = cssText;
      iframe.contentDocument.head.appendChild(styleElement);
    } catch (error) {
      console.error('Erreur lors de la récupération du CSS:', error);
    }
  };
  
  const domStringToJson = (htmlString, iframe) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
  
    function domToJson(node) {
      if (!node) {
        return null;
      }
  
      const obj = {
        type: node.nodeType,
        name: node.nodeName,
      };
  
      if (node.nodeType === 1 && node.attributes) {
        obj.attributes = {};
        for (let i = 0; i < node.attributes.length; i++) {
          obj.attributes[node.attributes[i].name] = node.attributes[i].value;
        }
  
        // Injecter l'élément dans l'iframe pour s'assurer que les styles sont appliqués
        const tempElement = iframe.contentDocument.createElement(node.nodeName);
        for (const attr of node.attributes) {
          tempElement.setAttribute(attr.name, attr.value);
        }
        iframe.contentDocument.body.appendChild(tempElement);
  
        // Calculer les styles CSS calculés
        const computedStyle = iframe.contentWindow.getComputedStyle(tempElement);
        obj.styles = {};
        for (let i = 0; i < computedStyle.length; i++) {
          const propertyName = computedStyle[i];
          obj.styles[propertyName] = computedStyle.getPropertyValue(propertyName);
        }
  
        // Retirer l'élément temporaire
        iframe.contentDocument.body.removeChild(tempElement);
      }
  
      if (node.nodeType === 3) {
        obj.text = node.nodeValue;
      }
  
      if (node.childNodes && node.childNodes.length > 0) {
        obj.children = [];
        for (let i = 0; i < node.childNodes.length; i++) {
          const childJson = domToJson(node.childNodes[i]);
          if (childJson) {
            obj.children.push(childJson);
          }
        }
      }
  
      return obj;
    }
  
    return domToJson(doc.documentElement);
  };
  
  const fetchProductDom = async (productUrl, setLoading, setError, setDomJson) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3002/fetch-dom', {
        url: productUrl
      }, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
  
      const domContent = response.data.dom;
  
      // Créer un iframe invisible pour calculer les styles
      const iframe = document.createElement('iframe');
      document.body.appendChild(iframe);
      iframe.style.display = 'none';
  
      // Parser le HTML récupéré pour obtenir le document
      const parser = new DOMParser();
      const doc = parser.parseFromString(domContent, 'text/html');
  
      // Extraire les URLs des feuilles de style CSS
      const stylesheets = extractStylesheetUrls(doc);
      console.log('CSS URLs:', stylesheets);
  
      // Injecter les CSS dynamiquement dans l'iframe
      await Promise.all(stylesheets.map(url => fetchAndInjectCss(iframe, url)));
  
      // Convertir la chaîne DOM HTML en JSON avec styles calculés
      const domJsonData = domStringToJson(domContent, iframe);
  
      // Supprimer l'iframe après utilisation
      document.body.removeChild(iframe);
  
      setDomJson(domJsonData);
      logLouComponents(domJsonData);
  
      console.log(domJsonData); // Afficher le JSON avec les styles calculés
  
    } catch (error) {
      console.error('Erreur lors de la récupération du DOM:', error);
      setError('Erreur lors de la récupération du DOM');
    } finally {
      setLoading(false);
    }
  };
  
  

  // Fonction pour parcourir le JSON et loguer les éléments avec "lou-component"
  const logLouComponents = (node) => {
    let productComponent = [];
    if (!node) return;
  
    const obj = {
      type: node.nodeType,
      name: node.nodeName,
    };
  
    // Vérifier si l'élément est un BODY
    if (node.name === 'BODY') {
      const traverseChildren = (children) => {
        children.forEach((child) => {
          if (child.attributes && child.attributes['lou-component']) {
            productComponent.push({
              "name": child.attributes['lou-component'],
              "class": child.attributes['class']
            });
  
            if (child.nodeType === 1) {  // Assurez-vous que c'est un ELEMENT_NODE
              // Créer un élément temporaire et l'ajouter au DOM
              const tempElement = document.createElement('div');
              console.log('Creating element:', tempElement);
  
              // Appliquer les classes et les styles en ligne si présents
              if (child.attributes['class']) {
                tempElement.className = child.attributes['class'];
              }
              if (child.attributes['style']) {
                tempElement.setAttribute('style', child.attributes['style']);
              }
  
              document.body.appendChild(tempElement);  // Ajouter l'élément au DOM
              console.log('Appended to DOM:', tempElement);
  
              const computedStyle = window.getComputedStyle(tempElement);
              console.log('Computed style:', computedStyle);
  
              obj.styles = {};
              for (let i = 0; i < computedStyle.length; i++) {
                const propertyName = computedStyle[i];
                obj.styles[propertyName] = computedStyle.getPropertyValue(propertyName);
              }
  
              // Retirer l'élément du DOM après avoir récupéré les styles
              document.body.removeChild(tempElement);
            }
          }
          if (child.children && child.children.length > 0) {
            traverseChildren(child.children); // Parcourir les enfants des enfants
          }
        });
      };
  
      if (node.children && node.children.length > 0) {
        traverseChildren(node.children);
      }
      console.log(productComponent);
    }
  
    if (node.children && node.children.length > 0) {
      node.children.forEach((child) => logLouComponents(child));
    }
  };


  export { fetchProductDom };