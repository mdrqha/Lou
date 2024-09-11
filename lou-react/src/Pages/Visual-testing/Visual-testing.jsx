import React, { useState, useEffect } from 'react';
import '../../i18n';
import { useTranslation } from 'react-i18next';
import Header from '../../Components/Header/Header';
import InputText from '../../Components/Inputs/Input-text/Input-text'; 
import Button from '../../Components/Buttons/Button/Button';
import { compareData } from './Compare-jsons';
import UserDropdown from '../../Components/User-dropdown/User-dropdown';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useAuth } from '../../Context/AuthContext';


const VisualTestingPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
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
    const { currentUser } = useAuth(); // Récupérer l'utilisateur actuel via un contexte d'authentification
    const [visualTestsData, setVisualTestsData] = useState([]);
    const [title, setTitle] = useState(''); // Pour le nom du test
    const [description, setDescription] = useState(''); // Pour la description
    const [figmaUrl, setFigmaUrl] = useState(''); // Pour l'URL Figma
    const [stringArray1, setStringArray1] = useState([]); // Premier tableau de chaînes de caractères
    const [stringArray2, setStringArray2] = useState([]); // Deuxième tableau de chaînes de caractères
    const [jsonArray, setJsonArray] = useState([]); // Tableau de JSON


    const handleCreateTest = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token'); 
    
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const response = await axios.post("http://localhost:50005/api/auth/visual-tests", {
                title: "Nouveau test visuel",
                description,
                figmaUrl,
                productUrl,
                stringArray1,
                stringArray2,
                jsonArray
            }, config);

            const createdTestId = response.data.id    
            navigate(`/visual-testing/${createdTestId}`);
        } catch (error) {
            console.error("Erreur d'inscription", error);
        }
    };

    useEffect(() => {
        const fetchVisualTests = async () => {
            try {
                const token = localStorage.getItem('token');
                
                if (!token) {
                    console.error("Token JWT manquant.");
                    return;
                }

                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };

                const response = await axios.get('http://localhost:50005/api/auth/visual-tests', config);

                setVisualTestsData(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des visual tests:', error);
            }
        };

        fetchVisualTests();
    }, []);
    
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
                onClick={handleCreateTest}
            />
        </section>
        
        <section className='lou-overflow-auto'>
            <div className='lou-grid lou-grid-cols-[1fr_1fr_1fr_1fr] lou-gap-sm'>
                {visualTestsData.map((visualTest) => (
                    <div 
                        key={visualTest.id} 
                        className='lou-bg-white lou-rounded lou-border lou-border-dark-50 lou-p-md lou-select-none hover:lou-shadow-lg hover:lou-cursor-pointer lou-transition-all lou-duration-300'
                        onClick={() => navigate(`/visual-testing/${visualTest.id}`)}
                        >
                        <h4 className='lou-text-lg lou-font-bold lou-line-clamp-2'>{visualTest.title}</h4>
                        <p className='lou-text-dark-600 lou-line-clamp-3'>{visualTest.description}</p>
                    </div>
                ))}
            </div>
        </section>
    </div>
  );
};

export default VisualTestingPage;