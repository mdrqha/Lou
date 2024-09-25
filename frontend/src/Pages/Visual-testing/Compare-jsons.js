import { figmaFetchFrames, figmaComponent } from './Fetch-Figma';
import { fetchProductDom, productComponent } from './Fecth-product-url';

let compareDataStockage = [];
let finalCompareDataJson = {};
let figmaNameNoMatch = null;
let productNameNoMatch = null;


function stringifyToLowoerCase(varToStringify) {
    return JSON.stringify(varToStringify).toLowerCase();
}

function compareJSON(figmaObj, productObj) {
    compareDataStockage = [];
    let compareCounter = 0;
    console.log(figmaObj)
    console.log(productObj)
    
    if(figmaObj.length > productObj.length) {
        figmaObj.forEach(figmaObjCurrent => {
            productObj.forEach( productObjCurrent => {
                if(figmaObjCurrent.name === productObjCurrent.name) {
                    finalCompareDataJson = {};
                    compareCounter = compareCounter + 1;

                    finalCompareDataJson.name = figmaObjCurrent.name;

                    // Comparaison BackgroundColor
                    const figmaBgColor = figmaObjCurrent.style.backgroundColor !== null ? figmaObjCurrent.style.backgroundColor[0] : null;
                    const productBgColor = productObjCurrent.style.background !== null ? productObjCurrent.style.background : null;

                    if(JSON.stringify(figmaBgColor) !== JSON.stringify(productBgColor)) {
                        finalCompareDataJson.background = {
                            figma: figmaBgColor, 
                            product: productBgColor
                        };
                    }

                    // Comparaison blur
                    if(figmaObjCurrent.style.blur !== productObjCurrent.style.blur) {
                        finalCompareDataJson.blur = {
                            figma: figmaObjCurrent.style.blur, 
                            product: productObjCurrent.style.blur
                        };
                    }

                    // Comparaison border
                    // Border color
                    // console.log(figmaObjCurrent.style.border.size)
                    //     console.log(productObjCurrent.style.border.size)

                    if(productObjCurrent.style.border.size !== null) {
                        //Border Color
                        const figmaBorderColor = figmaObjCurrent.style.border.color !== null ? figmaObjCurrent.style.border.color[0] : null;
                        const productBorderColor = productObjCurrent.style.border.color !== null ? productObjCurrent.style.border.color : null;

                        if(JSON.stringify(figmaBorderColor) !== JSON.stringify(productBorderColor)) {
                            finalCompareDataJson.borderColor = {
                                    figma: figmaBorderColor, 
                                    product: productBorderColor
                                };
                        }

                        // Border size
                        const figmaBorderSize = figmaObjCurrent.style.border.size !== null ? figmaObjCurrent.style.border.size : null;
                        const productBorderSize = productObjCurrent.style.border.size !== null ? productObjCurrent.style.border.size : null;

                        if(JSON.stringify(figmaBorderSize) !== JSON.stringify(productBorderSize)) {
                            finalCompareDataJson.borderSize = {
                                figma: figmaBorderSize,
                                product: productBorderSize
                            };
                        }

                        // Border Style
                        const figmaBorderStyle = figmaObjCurrent.style.border.style ? figmaObjCurrent.style.border.style.style : "SOLID";
                        const productBorderStyle = productObjCurrent.style.border.style ? productObjCurrent.style.border.style : null;

                        if(stringifyToLowoerCase(figmaBorderStyle) !== JSON.stringify(productBorderStyle)) {
                            finalCompareDataJson.borderStyle = {
                                figma: figmaBorderStyle, 
                                product: productBorderStyle
                            };
                        }
                    }

                    // SI BORDER SIZE EST DIFFERENT ET QUE PRODUCT BORDER SIZE EST DIFF2RENT DE NULL ON METS LA COULEURS DE BORDERCOLOR AU PRODUCT SINON BORDER COLOR EST NULL, PAREIL POUR LE STYLE
                    // const figmaBorderColor = figmaObjCurrent.style.border.color !== null ? figmaObjCurrent.style.border.color[0] : null;
                    // const productBorderColor = productObjCurrent.style.border.color !== null ? productObjCurrent.style.border.color : null;

                    // if(JSON.stringify(figmaBorderColor) !== JSON.stringify(productBorderColor)) {
                    //     finalCompareDataJson.borderColor = {
                    //             figma: figmaBorderColor, 
                    //             product: productBorderColor
                    //         };
                    // }

                    // // Border size
                    // const figmaBorderSize = figmaObjCurrent.style.border.size !== null ? figmaObjCurrent.style.border.size : null;
                    // const productBorderSize = productObjCurrent.style.border.size !== null ? productObjCurrent.style.border.size : null;

                    // if(JSON.stringify(figmaBorderSize) !== JSON.stringify(productBorderSize)) {
                    //     finalCompareDataJson.borderSize = {
                    //         figma: figmaBorderSize,
                    //         product: productBorderSize
                    //     };
                        
                    // }

                    // const figmaBorderStyle = figmaObjCurrent.style.border.style ? figmaObjCurrent.style.border.style.style : "SOLID";
                    // const productBorderStyle = productObjCurrent.style.border.style ? productObjCurrent.style.border.style : null;

                    // if(stringifyToLowoerCase(figmaBorderStyle) !== JSON.stringify(productBorderStyle)) {
                    //     finalCompareDataJson.borderStyle = {
                    //         figma: figmaBorderStyle, 
                    //         product: productBorderStyle
                    //     };
                    // }

                    // Comparaison border radius
                    const figmaBorderRadius = figmaObjCurrent.style.borderRadius !== null ? figmaObjCurrent.style.borderRadius : null;
                   
                    const productBorderRadius = productObjCurrent.style.borderRadius !== null ? productObjCurrent.style.borderRadius : null;
                    
                    if(JSON.stringify(figmaBorderRadius) !== JSON.stringify(productBorderRadius)) {
                        finalCompareDataJson.borderRadius = {
                            figma: figmaBorderRadius, 
                            product: productBorderRadius
                        };
                    }

                    // Comparaison box shadow
                    const figmaBoxShadow = figmaObjCurrent.style.boxShadow ? figmaObjCurrent.style.boxShadow : null;
                    const productBoxShadow = productObjCurrent.style.boxShadow ? productObjCurrent.style.boxShadow : null;

                    if(JSON.stringify(figmaBoxShadow) !== JSON.stringify(productBoxShadow)) {
                        // ATTENTION ICI IL Y AURA TOUJOURS UNE ERREUR, SI IL Y A PLUSIEURS SHADOW, ET PUIS LES COULEURS,...
                        finalCompareDataJson.BoxShadow = {
                            figma: figmaBoxShadow, 
                            product: productBoxShadow
                        };
                    }

                    // Comparaison fill // A FAIRE

                    // Comparaison font // VERIFIER QUE TOUT FONCTIONNE BIEN
                    if(figmaObjCurrent.style.font !== null) {
                        // Font case
                        const figmaFontCase = figmaObjCurrent.style.font.case;
                        const productFontCase = productObjCurrent.style.font.case;

                        if(stringifyToLowoerCase(figmaFontCase) !== JSON.stringify(productFontCase)) {
                            finalCompareDataJson.fontCase = {
                                figma: figmaFontCase, 
                                product: productFontCase
                            };
                        }

                        // Font color
                        const figmaFontColor = figmaObjCurrent.style.font.color[0];
                        const productFontColor = productObjCurrent.style.font.color;

                        if(stringifyToLowoerCase(figmaFontColor) !== JSON.stringify(productFontColor)) { // VERIFIER QUE LA CONDITION FONCTIONNE
                            finalCompareDataJson.fontColor = {
                                figma: figmaFontColor, 
                                product: productFontColor
                            };
                        }

                        // Font decoration
                        const figmaFontDecoration = figmaObjCurrent.style.font.decoration;
                        const productFontDecoration = productObjCurrent.style.font.decoration;

                        if(stringifyToLowoerCase(figmaFontDecoration) !== JSON.stringify(productFontDecoration)) {
                            finalCompareDataJson.fontDecoration = {
                                figma: figmaFontDecoration, 
                                product: productFontDecoration
                            };
                        }

                        // Font ellipsis

                        // Font familly
                        const figmaFontFamilly = figmaObjCurrent.style.font.familly;
                        const productFontFamilly = productObjCurrent.style.font.familly;

                        if(stringifyToLowoerCase(figmaFontFamilly) !== JSON.stringify(productFontFamilly)) {
                            finalCompareDataJson.fontFamilly = {
                                figma: figmaFontFamilly, 
                                product: productFontFamilly
                            };
                        }

                        // font letterspacing
                        const figmaFontLetterSpacing = figmaObjCurrent.style.font.letterSpacing;
                        const productFontLetterSpacing = productObjCurrent.style.font.letterSpacing;

                        if(JSON.stringify(figmaFontLetterSpacing) !== JSON.stringify(productFontLetterSpacing)) {
                            finalCompareDataJson.fontLetterSpacing = {
                                figma: figmaFontLetterSpacing, 
                                product: productFontLetterSpacing
                            };
                        }

                        // font lineHeightPx
                        const figmaFontLineHeight = figmaObjCurrent.style.font.lineHeightPx;
                        const productFontLineHeight = productObjCurrent.style.font.lineHeightPx;

                        if(JSON.stringify(figmaFontLineHeight) !== JSON.stringify(productFontLineHeight)) {
                            finalCompareDataJson.fontLineHeight = {
                                figma: figmaFontLineHeight, 
                                product: productFontLineHeight
                            };
                        }
                        
                        // Font size
                        const figmaFontSize = figmaObjCurrent.style.font.lineHeightPx;
                        const productFontSize = productObjCurrent.style.font.lineHeightPx;

                        if(JSON.stringify(figmaFontSize) !== JSON.stringify(productFontSize)) {
                            finalCompareDataJson.fontSize = {
                                figma: figmaFontSize, 
                                product: productFontSize
                            };
                        }

                        // Font allign horizontal
                        const figmaFontAlignH = figmaObjCurrent.style.font.textAlignHorizontal;
                        const productFontAlignH =  productObjCurrent.style.font.textAlignHorizontal;

                        if(stringifyToLowoerCase(figmaFontAlignH) !== JSON.stringify(productFontAlignH)) {
                            finalCompareDataJson.fontAlignHorizontal = {
                                figma: figmaFontAlignH, 
                                product: productFontAlignH
                            };
                        }

                        // Font align vertical

                        // Font Auto resize

                        // Font weight
                        const figmaFontWeight = figmaObjCurrent.style.font.weight;
                        const productFontWeight = productObjCurrent.style.font.weight;

                        if(stringifyToLowoerCase(figmaFontWeight) !== JSON.stringify(productFontWeight)) {
                            finalCompareDataJson.fontAlignHorizontal = {
                                figma: figmaFontWeight, 
                                product: productFontWeight
                            };
                        }
                    }

                    // Comparaison gap
                    if(figmaObjCurrent.style.gapAuto !== true && figmaObjCurrent.style.gap !== productObjCurrent.style.gap) {
                        finalCompareDataJson.gap = {figma: figmaObjCurrent.style.gap, product: productObjCurrent.style.gap};
                    }

                    // Comparaison padding ou margin
                    const figmaPadding = figmaObjCurrent.style.padding;
                    const productPadding = productObjCurrent.style.padding;
                    // const productMargin = productObjCurrent.style.margin;

                    if(JSON.stringify(figmaPadding) !== JSON.stringify(productPadding)) {
                        // if(JSON.stringify(figmaPadding) !== JSON.stringify(productMargin)) {
                        //     finalCompareDataJson.paddingVSmargin = {
                        //         figma: figmaPadding, 
                        //         productMargin: productMargin
                        //     };
                        // } else {
                            finalCompareDataJson.padding = {
                                figma: figmaPadding, 
                                product: productPadding
                            };
                        // }
                    }

                    // Comparaison size
                    // Width
                    // const figmaWidth = figmaObjCurrent.style.size.width.boundingBox !== null ? figmaObjCurrent.style.size.width.boundingBox : null;
                    // const productWidth = productObjCurrent.style.size.width.boundingBox ? productObjCurrent.style.size.width.boundingBox : null;

                    // if(JSON.stringify(figmaWidth) !== JSON.stringify(productWidth)) {
                    //     finalCompareDataJson.width = {
                    //         figma: figmaWidth, 
                    //         product: productWidth
                    //     };
                    // } // ATTENTION RECUPPERATUION DE LA WIDTH DANS LE PRODUIT TJRS A 996PX dépend de la taille de l'écran du user

                    // Max width
                    const figmaMaxWidth = figmaObjCurrent.style.size.width.max !== null ? figmaObjCurrent.style.size.width.max : null;
                    const productMaxWidth = productObjCurrent.style.size.width.max ? productObjCurrent.style.size.width.max : null;

                    if(figmaMaxWidth !== null && JSON.stringify(figmaMaxWidth) !== JSON.stringify(productMaxWidth)) {
                        finalCompareDataJson.widthMax = {
                            figma: figmaMaxWidth, 
                            product: productMaxWidth
                        };
                    }

                    // Min width
                    const figmaMinWidth = figmaObjCurrent.style.size.width.min !== null ? figmaObjCurrent.style.size.width.min : null;
                    const productMinWidth = productObjCurrent.style.size.width.min ? productObjCurrent.style.size.width.min : null;

                    if(figmaMinWidth !== null && JSON.stringify(figmaMinWidth) !== JSON.stringify(productMinWidth)) {
                        finalCompareDataJson.widthMin = {
                            figma: figmaMinWidth, 
                            product: productMinWidth
                        };
                    }

                    // Height
                    // const figmaHeight = figmaObjCurrent.style.size.height.boundingBox !== null ? figmaObjCurrent.style.size.height.boundingBox : null;
                    // const productHeight = productObjCurrent.style.size.height.boundingBox ? productObjCurrent.style.size.height.boundingBox : null;

                    // if(JSON.stringify(figmaHeight) !== JSON.stringify(productHeight)) {
                    //     finalCompareDataJson.height = {
                    //         figma: figmaHeight, 
                    //         product: productHeight
                    //     };
                    // } // ATTENTION RECUPPERATUION DE LA WIDTH DANS LE PRODUIT TJRS A 996PX, dépend de la taille de l'écran du user

                    // Max height
                    const figmaMaxHeight = figmaObjCurrent.style.size.height.max !== null ? figmaObjCurrent.style.size.height.max : null;
                    const productMaxHeight = productObjCurrent.style.size.height.max ? productObjCurrent.style.size.height.max : null;

                    if(figmaMaxHeight !== null && JSON.stringify(figmaMaxHeight) !== JSON.stringify(productMaxHeight)) {
                        finalCompareDataJson.heightMax = {
                            figma: figmaMaxHeight, 
                            product: productMaxHeight
                        };
                    }

                    // Min height
                    const figmaMinHeight = figmaObjCurrent.style.size.height.min !== null ? figmaObjCurrent.style.size.height.min : null;
                    const productMinHeight = productObjCurrent.style.size.height.min ? productObjCurrent.style.size.height.min : null;

                    if(figmaMinHeight !== null && JSON.stringify(figmaMinHeight) !== JSON.stringify(productMinHeight)) {
                        finalCompareDataJson.heightMin = {
                            figma: figmaMinHeight,
                            product: productMinHeight
                        };
                    }

                    // Comparaison Opacity
                    const figmaOpacity = figmaObjCurrent.style.opacity !== null ? figmaObjCurrent.style.opacity : 1;
                    const productOpacity = parseFloat(productObjCurrent.style.opacity);

                    if(JSON.stringify(figmaOpacity) !== JSON.stringify(productOpacity)) {
                        finalCompareDataJson.Opacity = {
                            figma: figmaOpacity, 
                            product: productOpacity
                        };
                    }
                    if (Object.keys(finalCompareDataJson).length > 1) {
                        compareDataStockage.push(finalCompareDataJson)
                    }
                }
            });
        });
    } else { // DUPLICATION DU IF MAIS INVERTION DE PRODUCT ET FIGMA !!! REGARDER POUR RACCOURCIR LE CODE
        figmaObj.forEach(figmaObjCurrent => {
            productObj.forEach( productObjCurrent => {
                if(figmaObjCurrent.name === productObjCurrent.name) {
                    finalCompareDataJson = {};
                    compareCounter = compareCounter + 1;

                    // ATTENTION A LA RECEPTION D'INFO POUR LA COMPARAISON, CERTAINES COMPARAISON NE POURRONS JAMAIS ETRE VRAI
                    finalCompareDataJson.name = figmaObjCurrent.name;

                    // Comparaison BackgroundColor
                    const figmaBgColor = figmaObjCurrent.style.backgroundColor !== null ? figmaObjCurrent.style.backgroundColor[0] : null;
                    const productBgColor = productObjCurrent.style.background !== null ? productObjCurrent.style.background : null;

                    if(JSON.stringify(figmaBgColor) !== JSON.stringify(productBgColor)) {
                        finalCompareDataJson.background = {
                            figma: figmaBgColor, 
                            product: productBgColor
                        };
                    }

                    // Comparaison blur
                    if(figmaObjCurrent.style.blur !== productObjCurrent.style.blur) {
                        finalCompareDataJson.blur = {
                            figma: figmaObjCurrent.style.blur, 
                            product: productObjCurrent.style.blur
                        };
                    }

                    // Comparaison border
                    // Border color
                    // console.log(figmaObjCurrent.style.border.size)
                    //     console.log(productObjCurrent.style.border.size)

                    if(productObjCurrent.style.border.size !== null) {
                        //Border Color
                        const figmaBorderColor = figmaObjCurrent.style.border.color !== null ? figmaObjCurrent.style.border.color[0] : null;
                        const productBorderColor = productObjCurrent.style.border.color !== null ? productObjCurrent.style.border.color : null;

                        if(JSON.stringify(figmaBorderColor) !== JSON.stringify(productBorderColor)) {
                            finalCompareDataJson.borderColor = {
                                    figma: figmaBorderColor, 
                                    product: productBorderColor
                                };
                        }

                        // Border size
                        const figmaBorderSize = figmaObjCurrent.style.border.size !== null ? figmaObjCurrent.style.border.size : null;
                        const productBorderSize = productObjCurrent.style.border.size !== null ? productObjCurrent.style.border.size : null;

                        if(JSON.stringify(figmaBorderSize) !== JSON.stringify(productBorderSize)) {
                            finalCompareDataJson.borderSize = {
                                figma: figmaBorderSize,
                                product: productBorderSize
                            };
                        }

                        // Border Style
                        const figmaBorderStyle = figmaObjCurrent.style.border.style ? figmaObjCurrent.style.border.style.style : "SOLID";
                        const productBorderStyle = productObjCurrent.style.border.style ? productObjCurrent.style.border.style : null;

                        if(stringifyToLowoerCase(figmaBorderStyle) !== JSON.stringify(productBorderStyle)) {
                            finalCompareDataJson.borderStyle = {
                                figma: figmaBorderStyle, 
                                product: productBorderStyle
                            };
                        }
                    }

                    // SI BORDER SIZE EST DIFFERENT ET QUE PRODUCT BORDER SIZE EST DIFF2RENT DE NULL ON METS LA COULEURS DE BORDERCOLOR AU PRODUCT SINON BORDER COLOR EST NULL, PAREIL POUR LE STYLE
                    // const figmaBorderColor = figmaObjCurrent.style.border.color !== null ? figmaObjCurrent.style.border.color[0] : null;
                    // const productBorderColor = productObjCurrent.style.border.color !== null ? productObjCurrent.style.border.color : null;

                    // if(JSON.stringify(figmaBorderColor) !== JSON.stringify(productBorderColor)) {
                    //     finalCompareDataJson.borderColor = {
                    //             figma: figmaBorderColor, 
                    //             product: productBorderColor
                    //         };
                    // }

                    // // Border size
                    // const figmaBorderSize = figmaObjCurrent.style.border.size !== null ? figmaObjCurrent.style.border.size : null;
                    // const productBorderSize = productObjCurrent.style.border.size !== null ? productObjCurrent.style.border.size : null;

                    // if(JSON.stringify(figmaBorderSize) !== JSON.stringify(productBorderSize)) {
                    //     finalCompareDataJson.borderSize = {
                    //         figma: figmaBorderSize,
                    //         product: productBorderSize
                    //     };
                        
                    // }

                    // const figmaBorderStyle = figmaObjCurrent.style.border.style ? figmaObjCurrent.style.border.style.style : "SOLID";
                    // const productBorderStyle = productObjCurrent.style.border.style ? productObjCurrent.style.border.style : null;

                    // if(stringifyToLowoerCase(figmaBorderStyle) !== JSON.stringify(productBorderStyle)) {
                    //     finalCompareDataJson.borderStyle = {
                    //         figma: figmaBorderStyle, 
                    //         product: productBorderStyle
                    //     };
                    // }

                    // Comparaison border radius
                    const figmaBorderRadius = figmaObjCurrent.style.borderRadius !== null ? figmaObjCurrent.style.borderRadius : null;
                   
                    const productBorderRadius = productObjCurrent.style.borderRadius !== null ? productObjCurrent.style.borderRadius : null;
                    
                    if(JSON.stringify(figmaBorderRadius) !== JSON.stringify(productBorderRadius)) {
                        finalCompareDataJson.borderRadius = {
                            figma: figmaBorderRadius, 
                            product: productBorderRadius
                        };
                    }

                    // Comparaison box shadow
                    const figmaBoxShadow = figmaObjCurrent.style.boxShadow ? figmaObjCurrent.style.boxShadow : null;
                    const productBoxShadow = productObjCurrent.style.boxShadow ? productObjCurrent.style.boxShadow : null;

                    if(JSON.stringify(figmaBoxShadow) !== JSON.stringify(productBoxShadow)) {
                        // ATTENTION ICI IL Y AURA TOUJOURS UNE ERREUR, SI IL Y A PLUSIEURS SHADOW, ET PUIS LES COULEURS,...
                        finalCompareDataJson.BoxShadow = {
                            figma: figmaBoxShadow, 
                            product: productBoxShadow
                        };
                    }

                    // Comparaison fill // A FAIRE

                    // Comparaison font // VERIFIER QUE TOUT FONCTIONNE BIEN
                    if(figmaObjCurrent.style.font !== null) {
                        // Font case
                        const figmaFontCase = figmaObjCurrent.style.font.case;
                        const productFontCase = productObjCurrent.style.font.case;

                        if(stringifyToLowoerCase(figmaFontCase) !== JSON.stringify(productFontCase)) {
                            finalCompareDataJson.fontCase = {
                                figma: figmaFontCase, 
                                product: productFontCase
                            };
                        }

                        // Font color
                        const figmaFontColor = figmaObjCurrent.style.font.color[0];
                        const productFontColor = productObjCurrent.style.font.color;

                        if(stringifyToLowoerCase(figmaFontColor) !== JSON.stringify(productFontColor)) { // VERIFIER QUE LA CONDITION FONCTIONNE
                            finalCompareDataJson.fontColor = {
                                figma: figmaFontColor, 
                                product: productFontColor
                            };
                        }

                        // Font decoration
                        const figmaFontDecoration = figmaObjCurrent.style.font.decoration;
                        const productFontDecoration = productObjCurrent.style.font.decoration;

                        if(stringifyToLowoerCase(figmaFontDecoration) !== JSON.stringify(productFontDecoration)) {
                            finalCompareDataJson.fontDecoration = {
                                figma: figmaFontDecoration, 
                                product: productFontDecoration
                            };
                        }

                        // Font ellipsis

                        // Font familly
                        const figmaFontFamilly = figmaObjCurrent.style.font.familly;
                        const productFontFamilly = productObjCurrent.style.font.familly;

                        if(stringifyToLowoerCase(figmaFontFamilly) !== JSON.stringify(productFontFamilly)) {
                            finalCompareDataJson.fontFamilly = {
                                figma: figmaFontFamilly, 
                                product: productFontFamilly
                            };
                        }

                        // font letterspacing
                        const figmaFontLetterSpacing = figmaObjCurrent.style.font.letterSpacing;
                        const productFontLetterSpacing = productObjCurrent.style.font.letterSpacing;

                        if(JSON.stringify(figmaFontLetterSpacing) !== JSON.stringify(productFontLetterSpacing)) {
                            finalCompareDataJson.fontLetterSpacing = {
                                figma: figmaFontLetterSpacing, 
                                product: productFontLetterSpacing
                            };
                        }

                        // font lineHeightPx
                        const figmaFontLineHeight = figmaObjCurrent.style.font.lineHeightPx;
                        const productFontLineHeight = productObjCurrent.style.font.lineHeightPx;

                        if(JSON.stringify(figmaFontLineHeight) !== JSON.stringify(productFontLineHeight)) {
                            finalCompareDataJson.fontLineHeight = {
                                figma: figmaFontLineHeight, 
                                product: productFontLineHeight
                            };
                        }
                        
                        // Font size
                        const figmaFontSize = figmaObjCurrent.style.font.lineHeightPx;
                        const productFontSize = productObjCurrent.style.font.lineHeightPx;

                        if(JSON.stringify(figmaFontSize) !== JSON.stringify(productFontSize)) {
                            finalCompareDataJson.fontSize = {
                                figma: figmaFontSize, 
                                product: productFontSize
                            };
                        }

                        // Font allign horizontal
                        const figmaFontAlignH = figmaObjCurrent.style.font.textAlignHorizontal;
                        const productFontAlignH =  productObjCurrent.style.font.textAlignHorizontal;

                        if(stringifyToLowoerCase(figmaFontAlignH) !== JSON.stringify(productFontAlignH)) {
                            finalCompareDataJson.fontAlignHorizontal = {
                                figma: figmaFontAlignH, 
                                product: productFontAlignH
                            };
                        }

                        // Font align vertical

                        // Font Auto resize

                        // Font weight
                        const figmaFontWeight = figmaObjCurrent.style.font.weight;
                        const productFontWeight = productObjCurrent.style.font.weight;

                        if(stringifyToLowoerCase(figmaFontWeight) !== JSON.stringify(productFontWeight)) {
                            finalCompareDataJson.fontAlignHorizontal = {
                                figma: figmaFontWeight, 
                                product: productFontWeight
                            };
                        }
                    }

                    // Comparaison gap
                    if(figmaObjCurrent.style.gapAuto !== true && figmaObjCurrent.style.gap !== productObjCurrent.style.gap) {
                        finalCompareDataJson.gap = {figma: figmaObjCurrent.style.gap, product: productObjCurrent.style.gap};
                    }

                    // Comparaison padding ou margin
                    const figmaPadding = figmaObjCurrent.style.padding;
                    const productPadding = productObjCurrent.style.padding;
                    // const productMargin = productObjCurrent.style.margin;

                    if(JSON.stringify(figmaPadding) !== JSON.stringify(productPadding)) {
                        // if(JSON.stringify(figmaPadding) !== JSON.stringify(productMargin)) {
                        //     finalCompareDataJson.paddingVSmargin = {
                        //         figma: figmaPadding, 
                        //         productMargin: productMargin
                        //     };
                        // } else {
                            finalCompareDataJson.padding = {
                                figma: figmaPadding, 
                                product: productPadding
                            };
                        // }
                    }

                    // Comparaison size
                    // Width
                    // const figmaWidth = figmaObjCurrent.style.size.width.boundingBox !== null ? figmaObjCurrent.style.size.width.boundingBox : null;
                    // const productWidth = productObjCurrent.style.size.width.boundingBox ? productObjCurrent.style.size.width.boundingBox : null;

                    // if(JSON.stringify(figmaWidth) !== JSON.stringify(productWidth)) {
                    //     finalCompareDataJson.width = {
                    //         figma: figmaWidth, 
                    //         product: productWidth
                    //     };
                    // } // ATTENTION RECUPPERATUION DE LA WIDTH DANS LE PRODUIT TJRS A 996PX dépend de la taille de l'écran du user

                    // Max width
                    const figmaMaxWidth = figmaObjCurrent.style.size.width.max !== null ? figmaObjCurrent.style.size.width.max : null;
                    const productMaxWidth = productObjCurrent.style.size.width.max ? productObjCurrent.style.size.width.max : null;

                    if(figmaMaxWidth !== null && JSON.stringify(figmaMaxWidth) !== JSON.stringify(productMaxWidth)) {
                        finalCompareDataJson.widthMax = {
                            figma: figmaMaxWidth, 
                            product: productMaxWidth
                        };
                    }

                    // Min width
                    const figmaMinWidth = figmaObjCurrent.style.size.width.min !== null ? figmaObjCurrent.style.size.width.min : null;
                    const productMinWidth = productObjCurrent.style.size.width.min ? productObjCurrent.style.size.width.min : null;

                    if(figmaMinWidth !== null && JSON.stringify(figmaMinWidth) !== JSON.stringify(productMinWidth)) {
                        finalCompareDataJson.widthMin = {
                            figma: figmaMinWidth, 
                            product: productMinWidth
                        };
                    }

                    // Height
                    // const figmaHeight = figmaObjCurrent.style.size.height.boundingBox !== null ? figmaObjCurrent.style.size.height.boundingBox : null;
                    // const productHeight = productObjCurrent.style.size.height.boundingBox ? productObjCurrent.style.size.height.boundingBox : null;

                    // if(JSON.stringify(figmaHeight) !== JSON.stringify(productHeight)) {
                    //     finalCompareDataJson.height = {
                    //         figma: figmaHeight, 
                    //         product: productHeight
                    //     };
                    // } // ATTENTION RECUPPERATUION DE LA WIDTH DANS LE PRODUIT TJRS A 996PX, dépend de la taille de l'écran du user

                    // Max width
                    const figmaMaxHeight = figmaObjCurrent.style.size.height.max !== null ? figmaObjCurrent.style.size.height.max : null;
                    const productMaxHeight = productObjCurrent.style.size.height.max ? productObjCurrent.style.size.height.max : null;

                    if(figmaMaxHeight !== null && JSON.stringify(figmaMaxHeight) !== JSON.stringify(productMaxHeight)) {
                        finalCompareDataJson.heightMax = {
                            figma: figmaMaxHeight, 
                            product: productMaxHeight
                        };
                    }

                    // Min width
                    const figmaMinHeight = figmaObjCurrent.style.size.height.min !== null ? figmaObjCurrent.style.size.height.min : null;
                    const productMinHeight = productObjCurrent.style.size.height.min ? productObjCurrent.style.size.height.min : null;

                    if(figmaMinHeight !== null && JSON.stringify(figmaMinHeight) !== JSON.stringify(productMinHeight)) {
                        finalCompareDataJson.heightMin = {
                            figma: figmaMinHeight,
                            product: productMinHeight
                        };
                    }

                    // Comparaison Opacity
                    const figmaOpacity = figmaObjCurrent.style.opacity !== null ? figmaObjCurrent.style.opacity : 1;
                    const productOpacity = parseFloat(productObjCurrent.style.opacity);

                    if(JSON.stringify(figmaOpacity) !== JSON.stringify(productOpacity)) {
                        finalCompareDataJson.Opacity = {
                            figma: figmaOpacity, 
                            product: productOpacity
                        };
                    }
                    if (Object.keys(finalCompareDataJson).length > 1) {
                        compareDataStockage.push(finalCompareDataJson)
                    }
                }
            });
        });
    }
    const figmaAllName = figmaObj.map(item => item.name);
    const productAllName = productObj.map(item => item.name);

    figmaNameNoMatch = figmaAllName.filter(name => !productAllName.includes(name));
    productNameNoMatch = productAllName.filter(name => !figmaAllName.includes(name));

    const comparePercent = parseInt( 100 - ((compareDataStockage.length/compareCounter) * 100));
    sessionStorage.setItem(`comparePercent`, comparePercent)
    const storedComparePercentage = JSON.parse((sessionStorage.getItem('comparePercent')));

    console.log(`Resultat de la comparaison`,compareDataStockage)
    sessionStorage.setItem('CompareResult', JSON.stringify(compareDataStockage));
    const storedCompareResult = JSON.parse(sessionStorage.getItem('CompareResult'));

    sessionStorage.setItem('figmaNoMatch', JSON.stringify(figmaNameNoMatch));
    const storedFigmaNoMatch = JSON.parse(sessionStorage.getItem('figmaNoMatch'));

    sessionStorage.setItem('productNoMatch', JSON.stringify(productNameNoMatch));
    const storedProductaNoMatch = JSON.parse(sessionStorage.getItem('productNoMatch'));
  }

const compareData = async (url, productUrl, setLoading, setError, setAllFigmaComponent, setFrameCount, setFigmaData, setDomJson) => {
    try {
      const figmaData = await figmaFetchFrames(url, setLoading, setError, setAllFigmaComponent, setFrameCount, setFigmaData);
      const productData = await fetchProductDom(productUrl, setLoading, setError, setDomJson);
      const productJsonData = productComponent;
      const figmaJsonData = figmaComponent;
    
    compareDataStockage = compareJSON(figmaJsonData,productJsonData); 

    } catch (error) {
      console.error('Erreur lors de la comparaison des données :', error);
    }
  };

  export {compareData};