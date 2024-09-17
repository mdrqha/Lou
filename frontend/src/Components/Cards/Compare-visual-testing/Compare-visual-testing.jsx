import React from 'react';
import { FiFigma, FiHelpCircle, FiMonitor } from 'react-icons/fi';

const CardCompareVisuaTesting = ({ title, figmaStyle, productStyle, figmaData, productData }) => {


  return (
    <div className='lou-bg-white lou-border lou-border-dark-50 lou-p-md lou-rounded lou-grid lou-grid-cols-[auto_1fr] lou-gap-md'>
        <div className='lou-bg-primary-100 lou-rounded lou-w-[80px] lou-h-[80px] lou-grid lou-grid-cols-[1fr_1fr]'>
            <div className={`lou-flex lou-items-center  ${figmaStyle === undefined ? 'lou-justify-center' : 'lou-justify-end'}`}>
            {figmaStyle === undefined ? (
                <FiHelpCircle className='lou-text-danger lou-text-lg'/>
            ) : (
                <div 
                    className='lou-w-[15px] lou-h-[30px] lou-bg-dark lou-rounded-l-xs'
                    style={figmaStyle}
                ></div>
            )}
                
            </div>
            <div className={`lou-flex lou-items-center lou-rounded-r-lg ${productStyle === undefined ? 'lou-justify-center' : ''}`}>
                {productStyle === undefined ? (
                    <FiHelpCircle className='lou-text-danger lou-text-lg'/>
                ) : (
                    <div 
                        className='lou-w-[15px] lou-h-[30px] lou-bg-dark-500 lou-rounded-r-xs'
                        style={productStyle}
                    ></div>
                )}
                
            </div>
        </div>
        <div>
            <h4 className='lou-font-bold lou-text-lg lou-capitalize lou-mb-2xs'>{title}</h4>
            <div className='lou-flex lou-gap-xs lou-items-center'>
                <FiFigma className='lou-text-dark-300'/>
                <p className='lou-text-dark-500'>{figmaData}</p>
            </div>
            <div className='lou-flex lou-gap-xs lou-items-center'>
                <FiMonitor className='lou-text-dark-300'/>
                <p className='lou-text-dark-500'>{productData}</p>
            </div>
        </div>
    </div>
  );
};

export default CardCompareVisuaTesting;
