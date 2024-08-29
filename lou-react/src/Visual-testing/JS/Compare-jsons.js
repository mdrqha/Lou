import { figmaFetchFrames, figmaComponent } from './Fetch-Figma';
import { fetchProductDom, productComponent } from './Fecth-product-url';


function compareJSON(obj1, obj2) {
    const diffs = {};
  
    function findDiffs(o1, o2, basePath = '') {

        // o1.forEach(element => {
        //     console.log(element);
        // });


      for (const key in o1) {
        if (!(key in o2)) {
          diffs[`${basePath}${key}`] = { figmaValue: o1[key], productValue: undefined };
        } else if (typeof o1[key] === 'object' && o1[key] !== null && typeof o2[key] === 'object' && o2[key] !== null) {
          // Les deux sont des objets, effectuer une comparaison récursive
          findDiffs(o1[key], o2[key], `${basePath}${key}.`);
        } else if (o1[key] !== o2[key]) {
          // Valeurs différentes
          diffs[`${basePath}${key}`] = { figmaValue: o1[key], productValue: o2[key] };
        }
      }
  
      for (const key in o2) {
        if (!(key in o1)) {
          diffs[`${basePath}${key}`] = { figmaValue: undefined, productValue: o2[key] };
        }
      }
    }
  
    findDiffs(obj1, obj2);
    
    return diffs;
  }

const compareData = async (url, productUrl, setLoading, setError, setAllFigmaComponent, setFrameCount, setFigmaData, setDomJson, domData) => {
    try {
      const figmaData = await figmaFetchFrames(url, setLoading, setError, setAllFigmaComponent, setFrameCount, setFigmaData);
      const productData = await fetchProductDom(productUrl, setLoading, setError, setDomJson);
      const productJsonData = productComponent;
      const figmaJsonData = figmaComponent;

    //   const productDataTest = required url('./Fecth-product-url')

    //   console.log(`Product`, productJsonData);
    //   console.log(`Figma`,figmaJsonData);
      const compareDataStockage = compareJSON(figmaJsonData,productJsonData);
    //   console.log(compareDataStockage);
      
      
    } catch (error) {
      console.error('Erreur lors de la comparaison des données :', error);
    }
  };

  export {compareData};


  
//   // Exemple d'utilisation
//   const json1 = {
//     name: "John",
//     age: 30,
//     address: {
//       city: "New York",
//       zip: 10001,
//       size:{
//         km: 250, 
//       }
//     },
//     hobbies: ["reading", "traveling"]
//   };
  
//   const json2 = {
//     name: "John",
//     age: 31,
//     address: {
//       city: "Los Angeles",
//       zip: 90001
//     },
//     hobbies: ["reading", "music"]
//   };
  
//   const differences = compareJSON(json1, json2);
//   console.log(differences);
  

//   export {compareJSON};