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
import { format, formatDistanceToNowStrict, differenceInMinutes, differenceInHours, differenceInDays, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import "../../App.scss";
import { FiFilter, FiSearch } from 'react-icons/fi';
import MoreButton from '../../Components/Buttons/More-button/More-button';
import CardProject from '../../Components/Cards/Project/Projetct';


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
                jsonArray,
            }, config);

            const createdTestId = response.data.id    
            navigate(`/visual-testing/${createdTestId}`, { state: { focusInput: true } });
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


    const formatRelativeDate = (dateString) => {
        const date = parseISO(dateString);
        const now = new Date();
    
        const diffInMinutes = differenceInMinutes(now, date);
        const diffInHours = differenceInHours(now, date);
        const diffInDays = differenceInDays(now, date);
    
        if (diffInMinutes < 5) {
            return `Now`;
        } else if (diffInMinutes < 60) {
            return `${diffInMinutes} minutes`;
        } else if (diffInHours < 24) {
            return `${diffInHours} heures`;
        } else if (diffInDays < 7) {
            return `${diffInDays} jours`;
        } else {
            return format(date, "d MMMM yyyy", { locale: fr });
        }
    };
    
    const { t } = useTranslation();

  return (
    <div className='lou-grid lou-grid-rows-[auto_auto_1fr] lou-gap-md lou-overflow-auto' lou-component='right-container'>
        {/* PAGE CREATION DE PROJET */}
        <section className='lou-grid lou-grid-cols-[1fr_auto] lou-align-center lou-items-center'>
            <h1 className='lou-text-2xl lou-font-bold'>Visual testing</h1>
            <UserDropdown />
        </section>
        <section className='lou-flex lou-justify-between lou-bg-white lou-rounded lou-p-2xs'>
            <Button
                text="Créer un test"
                onClick={handleCreateTest}
            />
            <div className='lou-flex'>
                <Button 
                    iconOnly={true}
                    icon={<FiSearch />}
                    variant='white'
                />
                <Button 
                    iconOnly={true}
                    icon={<FiFilter />}
                    variant='white'
                />
                <MoreButton
                    subItem={[
                        {
                        text: 'Bouton 1',
                        click: () => console.log('Bouton 1 cliqué'),
                        icon: <FiFilter/>
                        },
                        {
                        text: 'Bouton 2',
                        click: () => console.log('Bouton 2 cliqué'),
                        icon: <FiSearch/>,
                        }
                    ]}
                />
            </div>
        </section>
        
        <section className='lou-overflow-auto'>
            <div className='lou-grid lou-card-grid lou-gap-sm'>
                {visualTestsData
                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                .map((visualTest) => (
                    <CardProject 
                        key={visualTest.id}
                        title={visualTest.title}
                        onClick={() => navigate(`/visual-testing/${visualTest.id}`)}
                        date={formatRelativeDate(visualTest.updatedAt)}
                        percent={visualTest.percent}
                    />
                ))}
            </div>
        </section>
    </div>
  );
};

export default VisualTestingPage;