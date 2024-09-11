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
import axios from 'axios';


const VisualTestingDetailPage = () => {
    const [figmaUrl, setFigmaUrl] = useState('');
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
    const [visualTestsData, setVisualTestsData] = useState([]);
    const [figmaNameNoMatch, setFigmaNameNoMatch] = useState([]);
    const [productNameNoMatch, setProductNameNoMatch] = useState([]);
    const [compareDataStockage, setCompareDataStockage] = useState([]);
    const [comparefullstorage, setCompareFullStorage] = useState([]);

    const navigate = useNavigate();

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

    const test = visualTestsData.find(p => p.id === parseInt(projectId));
    
    const handleCompareClick = async () => {
        try {
            setLoading(true);
            setError(null);
    
            await compareData(figmaUrl, productUrl, setLoading, setError, setAllFigmaComponent, setFrameCount, setFigmaData, setDomJson, setFigmaNameNoMatch, setProductNameNoMatch, setCompareDataStockage);
            const comparefullstorageData = JSON.parse(sessionStorage.getItem('CompareResult'));
            setCompareFullStorage(comparefullstorageData);
            // console.log(`storedProductaNoMatch`, comparefullstorage);

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

            

            // QUand je compare la première fois, apres le premier chargement de la page tout est vide, il faut que je le fasse 2 fois pour que les tables se remplissent

            // console.log(figmaNameNoMatch);
            // console.log(productNameNoMatch);

            // console.log(`Resultat de la comparaison`,compareDataStockage)
    
            const updateData = {
                figmaUrl: figmaUrl,
                productUrl: productUrl,
                stringArray1: figmaNameNoMatch,
                stringArray2: productNameNoMatch,
                jsonArray: [{test:'test'}]
                
            };

            await axios.put(`http://localhost:50005/api/auth/visual-tests/${projectId}`, updateData, config);
    
            console.log("Mise à jour réussie !");
            setLoading(false);
    
        } catch (error) {
            console.error("Erreur lors de la mise à jour des données:", error);
            setError("Erreur lors de la mise à jour des données");
            setLoading(false);
        }
    };
    

    const { t } = useTranslation();

    if (!test) {
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
                <h1 className='lou-text-2xl lou-font-bold'>{test.title}</h1>
            </div>
            <UserDropdown />
        </section>

        <main className='lou-bg-white lou-rounded lou-border lou-border-dark-50 lou-grid lou-grid-rows-[auto_1fr] lou-overflow-auto'>
            <section className='lou-grid lou-grid-cols-[1fr_1fr_auto] lou-gap-sm lou-border-b lou-border-dark-50 lou-p-sm'>
                <InputText
                    placeholder='URL Figma'
                    type="text"
                    value={figmaUrl}
                    onChange={(e) => {setFigmaUrl(e.target.value);}}
                />
                <InputText
                    placeholder='URL produit'
                    type="text"
                    value={productUrl ? productUrl : ''}
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

            
            <div className='lou-grid lou-grid-cols-[1fr_1fr] lou-gap-sm'>
                <div className='lou-grid lou-gap-md'>
                    {comparefullstorage.length > 0 ? (
                        comparefullstorage.map((item, index) => (
                        <div key={index} className="lou-border lou-border-dark-50 lou-rounded lou-overflow-hidden">
                            <h3 className='lou-bg-dark-50 lou-p-xs' >Calque: {item.name}</h3>
                            <div className="lou-p-sm">
                            {Object.keys(item).map((key, subIndex) => (
                                <div key={subIndex} className="property">
                                <strong>{key}:</strong> {JSON.stringify(item[key].figma)}
                                </div>
                            ))}
                            </div>
                        </div>
                        ))
                    ) : (
                        <p>Aucun résultat trouvé</p>
                    )}
                </div>
                <div className='lou-grid lou-gap-md'>
                    {comparefullstorage.length > 0 ? (
                        comparefullstorage.map((item, index) => (
                        <div key={index} className="lou-border lou-border-dark-50 lou-rounded lou-overflow-hidden">
                            <h3 className='lou-bg-dark-50 lou-p-xs' >Calque: {item.name}</h3>
                            <div className="lou-p-sm">
                            {Object.keys(item).map((key, subIndex) => (
                                <div key={subIndex} className="property">
                                <strong>{key}:</strong> {JSON.stringify(item[key].product)}
                                </div>
                            ))}
                            </div>
                        </div>
                        ))
                    ) : (
                        <p>Aucun résultat trouvé</p>
                    )}
                </div>
            </div>
            
            </section>
        </main>
    </div>
  );
};

export default VisualTestingDetailPage;