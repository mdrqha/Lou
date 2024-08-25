import axios from 'axios';

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


  const extractIdsFromUrl = (url, setError) => {
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
      let figmaToCssShadow = [];
      let figmaToCssBackgroundBlur = "";
      let figmaToCssBackgroundFilterBlur = "";

      node.effects.forEach(effect => {
        //VERIFIER QUE QUAND IL Y A RIEN C'EST NULL ET QUE QUAND IL Y A DE LA VALEUR C'EST BIEN PRINT
        //Get shadow value
        if ((effect.type === "DROP_SHADOW" && effect.visible === true) || (effect.type === "INNER_SHADOW" && effect.visible === true)) {
          figmaToCssShadow.push({
            type: effect.type,
            x: effect.offset.x,
            y: effect.offset.y,
            blur: effect.radius,
            color: {
              r: Math.round(effect.color.r * 255),
              g: Math.round(effect.color.g * 255),
              b: Math.round(effect.color.b * 255),
              a: parseFloat(effect.color.a.toFixed(2))
            }
          })
        }

        // Get background blur value
        if (effect.type === "BACKGROUND_BLUR" && effect.visible === true) {
          figmaToCssBackgroundBlur = effect.radius;
        }

        // Get Blur bg filter
        if (effect.type === "LAYER_BLUR" && effect.visible === true) {
            figmaToCssBackgroundFilterBlur = effect.radius;
          }
      });
    
      if(figmaToCssShadow.length === 0){
        figmaToCssShadow = null;
      }

      // Get background color
      let figmaToCssBackgroundColor = [];
      let figmaToCssBackgroundGradient = [];   

      if(node.background){
        // let backgroundLength = node.background.length;
        let finalColor = { r: 0, g: 0, b: 0 };
        let alphaFinal = 0;

        node.background.forEach(backgrounds => {
          if(backgrounds.visible === undefined){
            switch (backgrounds.type) {
              case 'SOLID':
                const rCurrent = backgrounds.color.r * 255;
                const gCurrent = backgrounds.color.g * 255;
                const bCurrent = backgrounds.color.b * 255;
                const alphaCurrent = backgrounds.opacity !== undefined ? backgrounds.opacity * backgrounds.color.a : backgrounds.color.a;

                const alphaCombined = alphaFinal + alphaCurrent * (1 - alphaFinal);
        
                finalColor.r = (rCurrent * alphaCurrent + finalColor.r * alphaFinal * (1 - alphaCurrent)) / alphaCombined;
                finalColor.g = (gCurrent * alphaCurrent + finalColor.g * alphaFinal * (1 - alphaCurrent)) / alphaCombined;
                finalColor.b = (bCurrent * alphaCurrent + finalColor.b * alphaFinal * (1 - alphaCurrent)) / alphaCombined;
        
                alphaFinal = alphaCombined;
              break;

              case "GRADIENT_LINEAR":
              case "GRADIENT_RADIAL":
              case "GRADIENT_DIAMOND":
                backgrounds.gradientStops.forEach(gradientData =>{
                    figmaToCssBackgroundGradient.push({
                        "r" : Math.round(gradientData.color.r * 255),
                        "g" : Math.round(gradientData.color.g * 255),
                        "b" : Math.round(gradientData.color.b * 255),
                        "a" : parseFloat(gradientData.color.a.toFixed(2)),
                        "position" : Math.round(gradientData.position * 100)
                    });
                });
              break;

              default:
                console.log("Type non pris en charge");
              break;
            }
          }
        });

        finalColor.r = Math.round(finalColor.r);
        finalColor.g = Math.round(finalColor.g);
        finalColor.b = Math.round(finalColor.b);

        figmaToCssBackgroundColor.push({r:finalColor.r,g:finalColor.g,b:finalColor.b,a:parseFloat(alphaFinal.toFixed(2))});

        if(figmaToCssBackgroundColor[0].r === 0 && figmaToCssBackgroundColor[0].g === 0 && figmaToCssBackgroundColor[0].b === 0 && figmaToCssBackgroundColor[0].a === 0){
          figmaToCssBackgroundColor = null;
        }

        if(figmaToCssBackgroundGradient.length === 0){
          figmaToCssBackgroundGradient = null;
        }
      }

      // Get border
      // Get border Colors
      let figmaToCssStrokeColor = [];
      let figmaToCssStrokeSize = null;
      let figmaToCssStrokePosition = null;
      let figmaToCssStrokeStyle = null; // JE PEUX RETIRER LE IF DU NULL GRACE A CE EGALE

      if(node.strokes.length > 0){
        let strokeFinalColor = { r: 0, g: 0, b: 0 };
        let strokeAlphaFinal = 0;

        node.strokes.forEach(stroke => {
          if(stroke.visible === undefined){
            switch (stroke.type) {
              case 'SOLID':
                const rCurrent = stroke.color.r * 255;
                const gCurrent = stroke.color.g * 255;
                const bCurrent = stroke.color.b * 255;
                const alphaCurrent = stroke.opacity !== undefined ? stroke.opacity * stroke.color.a : stroke.color.a;

                const alphaCombined = strokeAlphaFinal + alphaCurrent * (1 - strokeAlphaFinal);
        
                strokeFinalColor.r = (rCurrent * alphaCurrent + strokeFinalColor.r * strokeAlphaFinal * (1 - alphaCurrent)) / alphaCombined;
                strokeFinalColor.g = (gCurrent * alphaCurrent + strokeFinalColor.g * strokeAlphaFinal * (1 - alphaCurrent)) / alphaCombined;
                strokeFinalColor.b = (bCurrent * alphaCurrent + strokeFinalColor.b * strokeAlphaFinal * (1 - alphaCurrent)) / alphaCombined;
        
                strokeAlphaFinal = alphaCombined;
              break;

              case "GRADIENT_LINEAR":
              case "GRADIENT_RADIAL":
              case "GRADIENT_DIAMOND":
                stroke.gradientStops.forEach(gradientData =>{
                  figmaToCssStrokeColor.push({
                        "r" : Math.round(gradientData.color.r * 255),
                        "g" : Math.round(gradientData.color.g * 255),
                        "b" : Math.round(gradientData.color.b * 255),
                        "a" : parseFloat(gradientData.color.a.toFixed(2)),
                        "position" : Math.round(gradientData.position * 100),
                        "type" : "Gradient"
                    });
                });
              break;

              default:
                console.log("Type non pris en charge");
              break;
            }
          }
        });

        strokeFinalColor.r = Math.round(strokeFinalColor.r);
        strokeFinalColor.g = Math.round(strokeFinalColor.g);
        strokeFinalColor.b = Math.round(strokeFinalColor.b);

        figmaToCssStrokeColor.push({
          r:strokeFinalColor.r,
          g:strokeFinalColor.g,
          b:strokeFinalColor.b,
          a:parseFloat(strokeAlphaFinal.toFixed(2)),
          type:"Solid"
        });

        // Get border position
        figmaToCssStrokePosition = node.strokeAlign ? node.strokeAlign : null;

        // Get border size
        if(node.individualStrokeWeights){
          let strokeWeightCurrent = node.individualStrokeWeights;
          figmaToCssStrokeSize = {strokeWeightCurrent};
        } else {
          figmaToCssStrokeSize = {
            top: node.strokeWeight ? node.strokeWeight : null,
            bottom : node.strokeWeight ? node.strokeWeight : null,
            right : node.strokeWeight ? node.strokeWeight : null,
            left : node.strokeWeight ? node.strokeWeight : null
          };
        }

        // Get style
          figmaToCssStrokeStyle = {
            dashValue: node.strokeDashes ? node.strokeDashes : null,
            type: node.strokeCap ? node.strokeCap : "SOLID",
            angle: node.strokeJoin ? node.strokeJoin : "ANGLE"
          }
      } else {
        figmaToCssStrokeColor = null;
        figmaToCssStrokeSize = null;
        figmaToCssStrokePosition = null;
      }

      // Get border radius
      // console.log(node);
      // console.log(node.rectangleCornerRadii)
      // console.log(node.cornerRadius);
      // console.log(node.cornerSmoothing);

      // FAIRE LA CONDITION POUR SIBORDER RADIUS POUSSER BORDER RADIUS SI NON NULL MAIS SI BORDER RECTANGLE METTRE RECTANGLE
      // let figmaToCssRadius = {
      //   radius: node.cornerRadius ? node.cornerRadius : null, // ICI LA CONDITION
      //   radiusSmoothing : node.cornerSmoothing
      // };

      let figmaToCssRadius = null;
      

      if(node.cornerRadius){
        figmaToCssRadius = {
          radius: {
            topRight: node.cornerRadius ? node.cornerRadius : null,
            topLeft: node.cornerRadius ? node.cornerRadius : null,
            bottomLeft: node.cornerRadius ? node.cornerRadius : null,
            bottomRight: node.cornerRadius ? node.cornerRadius : null
          },
          smoothingRadius: node.cornerSmoothing ? node.cornerSmoothing : null,
        }
        console.log(node.cornerSmoothing)
      } else if(node.rectangleCornerRadii) {
        console.log(node)
        figmaToCssRadius = {
          radius: {
            topRight: node.rectangleCornerRadii ? node.rectangleCornerRadii[0] : null,
            topLeft: node.rectangleCornerRadii && node.rectangleCornerRadii.length > 1 ? node.rectangleCornerRadii[1] : null,
            bottomRight: node.rectangleCornerRadii && node.rectangleCornerRadii.length > 2 ? node.rectangleCornerRadii[2] : null,
            bottomLeft: node.rectangleCornerRadii && node.rectangleCornerRadii.length > 3 ? node.rectangleCornerRadii[3] : null
          },
          smoothingRadius: node.cornerSmoothing ? node.cornerSmoothing : null, // VERIFIER POURQUOI CA FONCTIONNE, CA MET NULL QUNAD C'EST ZERO ALORS QUE CA EXISTE
        };
        
      }

      // if(node.cornerRadius){
      //   console.log(`radius`,node.cornerRadius)
      //   console.log(`smoothing`,node.cornerRadius)
      // } else if (node.rectangleCornerRadii) {
      //   console.log(`mixed`,node.rectangleCornerRadii)
      // }


      figmaComponent.push({
          nodeTOREMOVE : node,
          name : componentName,
          css : {
                backgroundColor : figmaToCssBackgroundColor,
                background : figmaToCssBackgroundGradient,
                border : {
                  color : figmaToCssStrokeColor,
                  size : figmaToCssStrokeSize,
                  position : figmaToCssStrokePosition,
                  style: figmaToCssStrokeStyle
                 },
                 borderRadius: figmaToCssRadius,
                //  borderRadius: node.cornerRadius ? node.cornerRadius : null,
                //  radiusSmoothing
                // border-radius
                // background-gradient
                // width si le layout sizing est fixe
                boxShadow : figmaToCssShadow ? figmaToCssShadow : null,
                backgroundBlur : figmaToCssBackgroundBlur ? figmaToCssBackgroundBlur : null,
                blur : figmaToCssBackgroundFilterBlur ? figmaToCssBackgroundFilterBlur : null
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
    }
    if (node.children && node.children.length > 0) {
      node.children.forEach((child) => {
        figmaComponent = figmaComponent.concat(extractComponentToJson(child));
      });
    }
  
    return figmaComponent;
  };
  

  const figmaFetchFrames = async (url, setLoading, setError, setAllFigmaComponent, setFrameCount, setFigmaData) => {
    const ids = extractIdsFromUrl(url);
    if (!ids) return;
  
    const { fileId, nodeId } = ids;
    setLoading(true);  // Activer le spinner
  
    try {
      const response = await axios.get(`http://localhost:3002/figma`, {
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

  export { figmaFetchFrames };