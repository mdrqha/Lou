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
            
          function parseColor(colorString) {
            // Enlève les espaces inutiles
            colorString = colorString.replace(/\s+/g, '').toLowerCase();

            const values = colorString.match(/(\d+(\.\d+)?)/g);
            let colorObject = {};

            if (values) {
              if (colorString.startsWith('rgba(') && values.length === 4) {
                colorObject = {
                  r: parseInt(values[0], 10),
                  g: parseInt(values[1], 10),
                  b: parseInt(values[2], 10),
                  a: parseFloat(values[3])
                };
              } else if (colorString.startsWith('rgb(') && values.length === 3) {
                colorObject = {
                  r: parseInt(values[0], 10),
                  g: parseInt(values[1], 10),
                  b: parseInt(values[2], 10),
                  a: 1
                };
              }
            }
            return colorObject;
          }

          let productToCssbackgroundColor = parseColor(styles["background-color"]);

          if(productToCssbackgroundColor.r === 0 && productToCssbackgroundColor.g === 0 && productToCssbackgroundColor.b === 0 && productToCssbackgroundColor.a === 0) {
            productToCssbackgroundColor = null
          }

          // Get border radius
          let productToCssRadius = null;
          
          const borderRadiusTopLeft = parseInt(styles['border-top-left-radius']);
          const borderRadiusTopRight = parseInt(styles['border-top-right-radius']);
          const borderRadiusBottomLeft = parseInt(styles['border-bottom-left-radius']);
          const borderRadiusBottomRight = parseInt(styles['border-bottom-right-radius']);

          if(borderRadiusTopLeft > 0 || borderRadiusTopRight > 0 || borderRadiusBottomLeft > 0 || borderRadiusBottomRight > 0) {
              productToCssRadius = {
                radius: {
                  bottomLeft: borderRadiusBottomLeft,
                  bottomRight: borderRadiusBottomRight,
                  topLeft: borderRadiusTopLeft,
                  topRight: borderRadiusTopRight

                }
              }
          }

          // console.log(child.attributes['lou-component'])

          // Get border
          // border color

          // border size
          let borderSize = null;

          let borderWidthRight = parseInt(styles['border-right-width']);
          let borderWidthLeft = parseInt(styles['border-left-width']);
          let borderWidthBottom = parseInt(styles['border-bottom-width']);
          let borderWidthTop = parseInt(styles['border-top-width']);

          if(borderWidthRight > 0 || borderWidthLeft > 0  || borderWidthBottom > 0 || borderWidthTop > 0){
            borderSize = {
              top: borderWidthTop,
              right: borderWidthRight,
              bottom: borderWidthBottom,
              left: borderWidthLeft
            }
          }

          //border style
          const borderStylesBrut = [
            styles['border-top-style'],
            styles['border-right-style'],
            styles['border-bottom-style'],
            styles['border-left-style']
          ];
          
          const uniqueStyles = new Set(borderStylesBrut);
          const borderStyle =
            uniqueStyles.size === 1
              ? borderStylesBrut[0]
              : borderStylesBrut.reduce((a, b, i, arr) =>
                  arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b
                );      
                

          // boder color
          const borderColors = [
            styles['border-top-color'],
            styles['border-right-color'],
            styles['border-bottom-color'],
            styles['border-left-color']
          ];
          
          // Utilisation d'un Set pour vérifier les couleurs uniques
          const uniqueColors = new Set(borderColors);
          
          // Détermination de la couleur finale
          const borderColor =
            uniqueColors.size === 1
              ? borderColors[0]
              : borderColors.reduce((a, b, i, arr) =>
                  arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b
                );

          const productToCssBorderColor = parseColor(borderColor);

          // console.log(styles['box-shadow'])

          // Get box shadow
          const inputString = styles['box-shadow'] ? styles['box-shadow'] : null;
          let boxShadowBrut = [];

          if(inputString != 'none'){
            const shadowRegex = /rgba\((\d{1,3},\s*\d{1,3},\s*\d{1,3},\s*[\d.]+)\)\s*-?\d+px\s*-?\d+px\s*-?\d+px\s*-?\d+px/g;
            const shadows = inputString.match(shadowRegex);

            shadows.forEach((shadow, index) => {
              boxShadowBrut.push(shadow)
            });
          }

          let productToCssBoxShadow = [];

          boxShadowBrut.forEach((shadowCurrent) => {
            const match = shadowCurrent.match(/rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*([\d.]+)\)\s*(-?\d+)px\s*(-?\d+)px\s*(-?\d+)px\s*(-?\d+)px/);

            if (match) {
              const shadowObject = {
                color: {
                  r: parseInt(match[1], 10),
                  g: parseInt(match[2], 10),
                  b: parseInt(match[3], 10),
                  a: parseFloat(match[4])
                },
                x: parseInt(match[5]),
                y: parseInt(match[6]),
                blur: parseInt(match[7]),
                spread: parseInt(match[8])
              };

              if(shadowObject.color.a > 0) productToCssBoxShadow.push(shadowObject);
            }
          });

          if(productToCssBoxShadow.length === 0) productToCssBoxShadow = null;

          // Get gap
          let productToCssGap = null;

          if(styles['column-gap'] != "normal") productToCssGap = parseInt(styles['column-gap']);

          let productToCssTextDecoration = null;

          switch(styles['text-decoration-line']){
            case 'underline':
              productToCssTextDecoration = "UNDERLINE";
            break;

            case 'line-through': 
              productToCssTextDecoration = "STRIKETHROUGH";
            break;
          }


            productComponent.push({
                name: child.attributes['lou-component'],
                // "class": child.attributes['class'],
                type: child.type,
                style: {
                  background: productToCssbackgroundColor,
                  border: {
                    color: productToCssBorderColor,
                    size: borderSize,
                    style: borderStyle
                  },
                  backgroundBlur: styles['backdrop-filter'] !== "none" ? parseInt(styles['backdrop-filter']) : null,
                  blur: styles['filter'] !== "none" ? parseInt(styles['filter']) : null,
                  borderRadius: productToCssRadius,
                  boxShadow: productToCssBoxShadow,
                  gap: productToCssGap,
                  padding: {
                    top: parseInt(styles['padding-top']) !== 0 ? parseInt(styles['padding-top']) : null,
                    left: parseInt(styles['padding-left']) !== 0 ? parseInt(styles['padding-left']) : null,
                    bottom: parseInt(styles['padding-bottom']) !== 0 ? parseInt(styles['padding-bottom']) : null,
                    right: parseInt(styles['padding-right']) !== 0 ? parseInt(styles['padding-right']) : null
                  },
                  font: {
                    case: styles['font-variant-caps'] ? styles['font-variant-caps'] : null, // a vérifier
                    color: parseColor(styles['color']),
                    decoration: productToCssTextDecoration,
                    ellipsis: styles["text-overflow"] === "ellipsis" ? "ENDING" : null,
                    familly: styles['font-family'] ? styles['font-family'] : null,
                    // famillyDetail: ,
                    // fontCustomisation: ,
                    letterSpacing: styles['letter-spacing'],
                    lineHeightPercent: (parseInt(styles['line-height']) / parseInt(styles['font-size'])) * 100,
                    lineHeightPx: parseInt(styles['line-height']) ? parseInt(styles['line-height']) : null,
                    // lineHeightUnit: ,
                    // liste: ,
                    // listeIndentation: ,
                    size: styles['font-size'] ? parseInt(styles['font-size']) : null,
                    textAlignHorizontal: styles['text-align'] ? styles['text-align'] : null,
                    // textAlignVertical: ,
                    // textAutoResize: ,
                    weight: styles['font-weight'] ? parseInt(styles['font-weight']) : null
                  },
                  fill: parseColor(styles['fill']), // verifier la couleur avec fill-opacity
                  size: {
                    width: {
                      render: parseInt(styles['width']),
                      boundingBox: parseInt(styles['width']),
                      max: styles['max-width'] !== "none" ? parseInt(styles['max-width']) : null,
                      min: styles['min-width'] !== "none" ? parseInt(styles['min-width']) : null,
                    },
                    height: {
                      render: parseInt(styles['height']),
                      boundingBox: parseInt(styles['height']),
                      max: styles['max-height'] !== "none" ? parseInt(styles['max-height']) : null,
                      min: styles['min-height'] !== "none" ? parseInt(styles['min-height']) : null,
                    }
                  },
                  
                  opacity: styles['opacity'] ? styles['opacity'] : 1,
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