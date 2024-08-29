import { figmaFetchFrames, figmaComponent } from './Fetch-Figma';
import { fetchProductDom, productComponent } from './Fecth-product-url';

let compareDataStockage = [];
let finalCompareDataJson = {};

function compareJSON(figmaObj, productObj) {
    // const diffs = []; // Utiliser un tableau pour stocker les différences par objet

    console.log(figmaObj)
    console.log(productObj)
    
    if(figmaObj.length > productObj.length) {
        figmaObj.forEach(figmaObjCurrent => {
            productObj.forEach( productObjCurrent=> {
                if(figmaObjCurrent.name === productObjCurrent.name) {
                    finalCompareDataJson = {};
                    console.log(figmaObjCurrent.name)

                    finalCompareDataJson.name = figmaObjCurrent.name;

                    //Comparaison couleur, on retient que ce qui ne correpond pas
                    const figmabgColorR = figmaObjCurrent.style.backgroundColor !== null ? figmaObjCurrent.style.backgroundColor[0].r : null;
                    const figmabgColorG = figmaObjCurrent.style.backgroundColor !== null ? figmaObjCurrent.style.backgroundColor[0].g : null;
                    const figmabgColorB = figmaObjCurrent.style.backgroundColor !== null ? figmaObjCurrent.style.backgroundColor[0].b : null;
                    const figmabgColorA = figmaObjCurrent.style.backgroundColor !== null ? figmaObjCurrent.style.backgroundColor[0].a : null;
                    const figmaBgColorAll = `rgba(${figmabgColorR}, ${figmabgColorG}, ${figmabgColorB}, ${figmabgColorA})`

                    const productBgColorR = productObjCurrent.style.background !== null ? productObjCurrent.style.background.r : null;
                    const productBgColorG = productObjCurrent.style.background !== null ? productObjCurrent.style.background.g : null;
                    const productBgColorB = productObjCurrent.style.background !== null ? productObjCurrent.style.background.b : null;
                    const productBgColorA = productObjCurrent.style.background !== null ? productObjCurrent.style.background.a : null;
                    const productBgColorAll = `rgba(${productBgColorR}, ${productBgColorG}, ${productBgColorB}, ${productBgColorA})`

                    if(figmaBgColorAll != productBgColorAll) {
                        finalCompareDataJson.background = {figma: figmaBgColorAll, product: productBgColorAll};
                    }

                    // Comparaison blur
                    if(figmaObjCurrent.style.blur != productObjCurrent.style.blur) {
                        finalCompareDataJson.blur = {figma: figmaObjCurrent.style.blur, product: productObjCurrent.style.blur};
                    }

                    // Comparaison border
                    // console.log(figmaObjCurrent.style.border)
                    // console.log(productObjCurrent.style.border)
                    // if(figmaObjCurrent.style.border != productObjCurrent.style.border) {
                    //     console.log(border)
                    // }

                    // Comparaison border radius
                    if(figmaObjCurrent.style.borderRadius != productObjCurrent.style.borderRadius) {
                        finalCompareDataJson.borderRadius = {figma: figmaObjCurrent.style.borderRadius, product: productObjCurrent.style.borderRadius};
                    }

                    // Comparaison gap
                    if(figmaObjCurrent.style.gap != productObjCurrent.style.gap) {
                        finalCompareDataJson.gap = {figma: figmaObjCurrent.style.gap, product: productObjCurrent.style.gap};
                    }
                    


                    // console.log(finalCompareDataJson)
                    compareDataStockage.push(finalCompareDataJson)
                    
                    
                }
                
            });
        });
    } else {
        // console.log('c obj 2')
    }
    console.log(compareDataStockage)
    
  
    // function findDiffs(o1, o2, basePath = '', parentIndex = 0) {
    //   const currentDiff = diffs[parentIndex] || {}; // Obtenir ou créer l'objet de différences courant
  
    //   // Utiliser Object.keys() pour obtenir les clés et forEach pour itérer
    //   Object.keys(o1).forEach(key => {
    //     if (!(key in o2)) {
    //       currentDiff[`${basePath}${key}`] = { figmaValue: o1[key], productValue: undefined };
    //     } else if (typeof o1[key] === 'object' && o1[key] !== null && typeof o2[key] === 'object' && o2[key] !== null) {
    //       // Les deux sont des objets, effectuer une comparaison récursive
    //       const newIndex = diffs.length; // Déterminer un nouvel index pour un nouvel objet dans le tableau
    //       diffs[newIndex] = diffs[newIndex] || {}; // Initialiser le nouvel objet si nécessaire
    //       findDiffs(o1[key], o2[key], `${basePath}${key}.`, newIndex);
    //     } else if (o1[key] !== o2[key]) {
    //       currentDiff[`${basePath}${key}`] = { figmaValue: o1[key], productValue: o2[key] };
    //     }
    //   });
  
    //   // Vérifier les clés présentes dans o2 mais pas dans o1
    //   Object.keys(o2).forEach(key => {
    //     if (!(key in o1)) {
    //       currentDiff[`${basePath}${key}`] = { figmaValue: undefined, productValue: o2[key] };
    //     }
    //   });
  
    //   diffs[parentIndex] = currentDiff; // Stocker les différences actuelles dans le tableau
    // }
  
    // findDiffs(obj1, obj2);
  
    // return diffs;
  }
  

const compareData = async (url, productUrl, setLoading, setError, setAllFigmaComponent, setFrameCount, setFigmaData, setDomJson, domData) => {
    try {
      const figmaData = await figmaFetchFrames(url, setLoading, setError, setAllFigmaComponent, setFrameCount, setFigmaData);
      const productData = await fetchProductDom(productUrl, setLoading, setError, setDomJson);
      const productJsonData = productComponent;
      const figmaJsonData = figmaComponent;
    
    compareDataStockage = compareJSON(figmaJsonData,productJsonData);
    //   console.log(compareDataStockage);
      
      
    } catch (error) {
      console.error('Erreur lors de la comparaison des données :', error);
    }
  };

  export {compareData};