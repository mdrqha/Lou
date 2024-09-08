import React, { useState, useEffect } from 'react';
import '../../../i18n';
import { useTranslation } from 'react-i18next';
import InputText from '../../../Components/Inputs/Input-text/Input-text'; 
import Button from '../../../Components/Buttons/Button/Button';
import { compareData } from '../Compare-jsons';
import { useParams } from 'react-router-dom';
import UserDropdown from '../../../Components/User-dropdown/User-dropdown';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from "react-router-dom";

const VisualTestingDetailPage = () => {
    const [url, setUrl] = useState('');
    const [productUrl, setProductUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [allFigmaComponent, setAllFigmaComponent] = useState([]);
    const [frameCount, setFrameCount] = useState(null);
    const [figmaData, setFigmaData] = useState(null);
    const [domJson, setDomJson] = useState(null);
    const [viewMode, setViewMode] = useState('cards'); // cards ou table
    const [selectedProject, setSelectedProject] = useState(null);
    const { projectId } = useParams();
    const navigate = useNavigate();

    const projectsData = [
        { id: 1, title: 'Login', description: 'Une super description pour la page login' },
        { id: 2, title: 'Visual testing', description: 'Ici une autre description un peu plus longue pour la page visual testing' },
    ];

    const project = projectsData.find(p => p.id === parseInt(projectId));
    
    const handleCompareClick = async () => {
        await compareData(url, productUrl, setLoading, setError, setAllFigmaComponent, setFrameCount, setFigmaData, setDomJson);
    };

    const { t } = useTranslation();

    if (!project) {
        return <div>Projet non trouvé</div>;
    }

  return (
    <div className='lou-grid lou-grid-rows-[auto_1fr] lou-gap-md lou-overflow-auto' lou-component='right-container'>
        <section className='lou-grid lou-grid-cols-[1fr_auto] lou-align-center lou-items-center'>
            <div className='lou-flex lou-gap-xs'>
                <button 
                    onClick={() => navigate('/visual-testing')}
                    className='lou-text-dark-500 lou-flex lou-justify-center lou-items-center lou-rounded-sm lou-w-8 lou-h-8 lou-transition lou-duration-300 hover:lou-text-dark hover:lou-bg-dark-100'
                    >
                    <FiArrowLeft />
                </button>
                <h1 className='lou-text-2xl lou-font-bold'>{project.title}</h1>
            </div>
            <UserDropdown />
        </section>

        <main className='lou-bg-white lou-rounded lou-border lou-border-dark-50 lou-grid lou-grid-rows-[auto_1fr] lou-overflow-auto'>
            <section className='lou-grid lou-grid-cols-[1fr_1fr_auto] lou-gap-sm lou-border-b lou-border-dark-50 lou-p-sm'>
                <InputText
                    placeholder='URL Figma'
                    type="text"
                    value={url}
                    onChange={(e) => {setUrl(e.target.value);}}
                />
                <InputText
                    placeholder='URL produit'
                    type="text"
                    value={productUrl}
                    onChange={(e) => setProductUrl(e.target.value)}
                />
                <Button
                    text='Compare'
                    onClick={() => {handleCompareClick();}}
                />
            </section>
            <section className='lou-p-sm lou-overflow-auto'>
            <h3 className='lou-text-2xl lou-font-bold'>
                {t('visual-design.results-tilte')} <span className='lou-text-base lou-font-medium lou-pl-xs lou-text-danger'>X {t('visual-design.results-errors')}</span>
            </h3>

            {loading ? (
                <div className="spinner">Loading...</div>
            ) : (
                <>
                {error && <p className="text-red-500">{error}</p>}
                </>
            )}
            </section>
        </main>
    </div>
  );
};

export default VisualTestingDetailPage;