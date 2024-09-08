import React, { useState } from 'react';
import '../../i18n';
import { useTranslation } from 'react-i18next';
import Header from '../../Components/Header/Header';
import InputText from '../../Components/Inputs/Input-text/Input-text'; 
import Button from '../../Components/Buttons/Button/Button';
import { compareData } from './Compare-jsons';
import UserDropdown from '../../Components/User-dropdown/User-dropdown';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";


const VisualTestingPage = () => {
    const navigate = useNavigate();
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

    const projectsData = [
        { id: 1, title: 'Login', description: 'Une super description pour la page login' },
        { id: 2, title: 'Visual testing', description: 'Ici une autre description un peu plus longue pour la page visual testing' },
    ];

    const handleCompareClick = async () => {
        await compareData(url, productUrl, setLoading, setError, setAllFigmaComponent, setFrameCount, setFigmaData, setDomJson);
    };

    const handleProjectClick = (project) => {
        setSelectedProject(project);
    };

    const { t } = useTranslation();

  return (
    <div className='lou-grid lou-grid-rows-[auto_auto_1fr] lou-gap-md lou-overflow-auto' lou-component='right-container'>
        {/* PAGE CREATION DE PROJET */}
        <section className='lou-grid lou-grid-cols-[1fr_auto] lou-align-center lou-items-center'>
            <h1 className='lou-text-2xl lou-font-bold'>Visual testing</h1>
            <UserDropdown />
        </section>
        <section className='lou-grid lou-justify-end lou-bg-white lou-rounded lou-p-2xs'>
            <Button
                text="Créer un test"
            />
        </section>
        
        <section className='lou-overflow-auto'>
            <div className='lou-grid lou-grid-cols-[1fr_1fr_1fr_1fr] lou-gap-sm'>
                {projectsData.map((project) => (
                    <div 
                        key={project.id} 
                        className='lou-bg-white lou-rounded lou-border lou-border-dark-50 lou-p-md lou-select-none hover:lou-shadow-lg hover:lou-cursor-pointer lou-transition-all lou-duration-300'
                        onClick={() => navigate(`/visual-testing/${project.id}`)}
                        >
                        <h4 className='lou-text-lg lou-font-bold lou-line-clamp-2'>{project.title}</h4>
                        <p className='lou-text-dark-600 lou-line-clamp-3'>{project.description}</p>
                    </div>
                ))}
            </div>
        </section>
    </div>
  );
};

export default VisualTestingPage;