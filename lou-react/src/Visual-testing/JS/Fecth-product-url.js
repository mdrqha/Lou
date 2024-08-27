import axios from 'axios';

const authToken = '1_HappyJames';
  
  const domStringToJson = (htmlString) => {
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
  
  // document.addEventListener('DOMContentLoaded', (productUrl, setLoading, setError, setDomJson) => {
  //   if (areStylesLoaded()) {
  //     fetchProductDom(productUrl, setLoading, setError, setDomJson);
  //   } else {
  //     console.error('Les styles ne sont pas complètement chargés.');
  //   }
  // });
  
  // const areStylesLoaded = () => {
  //   const stylesheets = Array.from(document.styleSheets);
  //   return stylesheets.every(sheet => {
  //     try {
  //       return sheet.cssRules; // Vérifier si les règles CSS sont chargées
  //     } catch (e) {
  //       return false; // Ignorer les exceptions pour les feuilles de style de domaines externes
  //     }
  //   });
  // };
  
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
      const domJsonData = domStringToJson(domContent);
  
      setDomJson(domJsonData);
      logLouComponents(domJsonData);
  
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
  
    const traverseChildren = (children) => {
      children.forEach((child) => {
        if (child.attributes && child.attributes['lou-component']) {
          if (child.type === 1) {  // Vérifier si c'est un ELEMENT_NODE
  
            const tempElement = document.createElement('div');
            if (child.attributes['class']) {
              tempElement.className = child.attributes['class'];
            }
            if (child.attributes['style']) {
              tempElement.setAttribute('style', child.attributes['style']);
            }
  
            document.body.appendChild(tempElement);  
            const computedStyle = window.getComputedStyle(tempElement);
  
            const styles = {};
            for (let i = 0; i < computedStyle.length; i++) {
              const propertyName = computedStyle[i];
              styles[propertyName] = computedStyle.getPropertyValue(propertyName);
            }

            productComponent.push({
                "name": child.attributes['lou-component'],
                "class": child.attributes['class'],
                "type": child.type,
                "css": {
                  "background-color": styles["background-color"] === "rgba(0, 0, 0, 0)" ? "none" : styles["background-color"]
                // background-color
                // border ou border-left, border-right,...
                // border-radius
                // background-gradient
                // Box-shadow
                // background-blur
                // blur effect
                // padding
                // margin
                // gap
                // color
                // fill si svg
                // Font familly
                // font-size
                // Font-weight
                // letter-spacing
                // line-height
                // Text-align vertical
                // Texte align Horizontal
                // Overflow hidden (clip content)
                // flex ??
                }
            });
            productComponent[productComponent.length - 1].styles = styles;
  
            document.body.removeChild(tempElement);
          }
        }
        if (child.children && child.children.length > 0) {
          traverseChildren(child.children);
        }
      });
    };
  
    if (node.children && node.children.length > 0) {
      traverseChildren(node.children);
    }
    console.log(productComponent);
  };

  export { fetchProductDom };