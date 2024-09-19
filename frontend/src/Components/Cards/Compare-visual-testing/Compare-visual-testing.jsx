import React from 'react';
import { FiFigma, FiHelpCircle, FiMonitor } from 'react-icons/fi';

const CardCompareVisuaTesting = ({ title, figmaStyle, productStyle, figmaData, productData , figmaStyleClassName = '', productStyleClassName = '', figmaIcon, productIcon}) => {

    const handleCopyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
          .then(() => {
            console.log('Texte copié dans le presse-papier:', text);
          })
          .catch(err => {
            console.error('Échec de la copie dans le presse-papier:', err);
          });
      };

  return (
    <div className='lou-bg-white lou-border lou-border-dark-50 lou-p-md lou-rounded lou-grid lou-grid-cols-[auto_1fr] lou-gap-md'>
        <div className='lou-bg-primary-100 lou-rounded lou-w-[80px] lou-h-[80px] lou-grid lou-grid-cols-[1fr_1fr]'>
            <div className={`lou-flex lou-items-center lou-overflow-hidden  ${figmaStyle === undefined ? 'lou-justify-center' : 'lou-justify-end'}`}>
            {figmaStyle === undefined ? (
                <FiHelpCircle className='lou-text-danger lou-text-lg'/>
            ) : (
                <div 
                    className={`lou-w-[15px] lou-h-[30px] lou-rounded-l-xs ${figmaStyleClassName}`}
                    style={figmaStyle}
                >
                    {figmaIcon}
                </div>
            )}
                
            </div>
            <div className={`lou-flex lou-items-center lou-rounded-r-lg lou-overflow-hidden ${productStyle === undefined ? 'lou-justify-center' : ''}`}>
                {productStyle === undefined ? (
                    <FiHelpCircle className='lou-text-danger lou-text-lg'/>
                ) : (
                    <div 
                        className={`lou-w-[15px] lou-h-[30px] lou-rounded-r-xs ${productStyleClassName}`}
                        style={productStyle}
                    >
                        {productIcon}
                    </div>
                )}
                
            </div>
        </div>
        <div>
            <h4 className='lou-font-bold lou-text-lg lou-capitalize lou-mb-2xs'>{title}</h4>
            <div 
                className='lou-flex lou-gap-xs lou-items-center lou-cursor-pointer'
                onClick={() => handleCopyToClipboard(figmaData)}
                title='Copy value'>
                <FiFigma className='lou-text-dark-300'/>
                <p className='lou-text-dark-500'>{figmaData}</p>
            </div>
            <div 
                className='lou-flex lou-gap-xs lou-items-center lou-cursor-pointer'
                onClick={() => handleCopyToClipboard(productData)}
                title='Copy value'>
                <FiMonitor className='lou-text-dark-300'/>
                <p className='lou-text-dark-500'>{productData}</p>
            </div>
        </div>
    </div>
  );
};

export default CardCompareVisuaTesting;
