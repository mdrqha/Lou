import React from 'react';

const CardProject = ({ title, date, percent, onClick }) => {


  return (
    <div 
        className={`lou-grid lou-grid-cols-[1fr_auto] lou-bg-white lou-rounded lou-p-md lou-select-none hover:lou-shadow-lg hover:lou-cursor-pointer lou-transition-all lou-duration-300 ${percent < 51 ? 'lou-border-2 lou-border-danger' : 'lou-border lou-border-dark-50'}`}
        onClick={onClick}
        >
        <div>
            <h4 className={`lou-text-lg lou-font-bold lou-line-clamp-1 lou-leading-5 ${percent < 51 ? 'lou-text-danger' : ''}`}>{title}</h4>
            <p className='lou-text-dark-400 lou-text-sm lou-leading-5'>{date}</p>
        </div>
        <div>
            <p className={`lou-rounded-sm lou-px-xs lou-py-2xs ${percent === 100 ? 'lou-text-success lou-bg-success-100' : ''} ${percent < 100 && percent > 50 ? 'lou-text-warning lou-bg-warning-100' : ''} ${percent < 51 && percent !== null ? 'lou-text-danger lou-bg-danger-100' : ''} ${percent === null ? 'lou-text-dark-500 lou-bg-dark-30' : ''}`}>
            {percent === null ? 'Vide' : (percent === 100 ? 'Perfect!' : percent + '%')}
            </p>
        </div>
    </div>
  );
};

export default CardProject;
