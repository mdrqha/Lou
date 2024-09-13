import React, { useState, useEffect, useRef } from 'react';
import '../../../i18n';
import { useTranslation } from 'react-i18next';
import InputText from '../../../Components/Inputs/Input-text/Input-text'; 
import Button from '../../../Components/Buttons/Button/Button';
import { compareData } from '../Compare-jsons';
import { useParams } from 'react-router-dom';
import UserDropdown from '../../../Components/User-dropdown/User-dropdown';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import { useDebouncedCallback } from 'use-debounce';



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
    const [getCompareSessionStorage, setCompareSessionStorage] = useState([]);
    const [getFigmaNoMatchSessionStorage, setFigmaNoMatchSessionStorage] = useState([]);
    const [getProductNoMatchSessionStorage, setProductNoMatchSessionStorage] = useState([]);
    const [figmaUrlDb, setFigmaUrlDb] = useState([]);
    const [count, setCount] = useState(0);
    const [test, setTest] = useState([]);
    const [title, setTitle] = useState('');
    const inputRef = useRef(null);
    const location = useLocation();

    const navigate = useNavigate();

    // Utilisation de l'effet pour focus l'input après le rendu
    useEffect(() => {
        if (location.state && location.state.focusInput && inputRef.current) {
            inputRef.current.focus(); // Fait le focus sur l'input si on vient de la création d'un test
        }
    }, [location]);

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

    useEffect(() => {
        if (visualTestsData.length > 0) {
            const foundTest = visualTestsData.find(p => p.id === parseInt(projectId));
            if (foundTest) {
                setTest(foundTest);
                if(foundTest.figmaUrl) {
                    setFigmaUrl(foundTest.figmaUrl)
                }
                if(foundTest.productUrl) {
                    setProductUrl(foundTest.productUrl)
                }
                if(foundTest.jsonArray) {
                    setCompareSessionStorage(foundTest.jsonArray[0])
                }
                if(foundTest.title) {
                    setTitle(foundTest.title)
                }
            }
        }
    }, [visualTestsData, projectId]);

    const handleCompareClick = async () => {
        try {
            setLoading(true);
            setError(null);
    
            await compareData(figmaUrl, productUrl, setLoading, setError, setAllFigmaComponent, setFrameCount, setFigmaData, setDomJson);
            
            const getCompareSessionStorage = JSON.parse(sessionStorage.getItem('CompareResult'));
            setCompareSessionStorage(getCompareSessionStorage);

            const getFigmaNoMatchSessionStorage = JSON.parse(sessionStorage.getItem('CompareResult'));
            setFigmaNoMatchSessionStorage(getFigmaNoMatchSessionStorage);

            const getProductNoMatchSessionStorage = JSON.parse(sessionStorage.getItem('CompareResult'));
            setProductNoMatchSessionStorage(getProductNoMatchSessionStorage);

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
    
            const updateData = {
                figmaUrl: figmaUrl,
                productUrl: productUrl,
                stringArray1: getFigmaNoMatchSessionStorage,
                stringArray2: getProductNoMatchSessionStorage,
                jsonArray: [getCompareSessionStorage]
                
            };

            setCompareSessionStorage(getCompareSessionStorage)

            await axios.put(`http://localhost:50005/api/auth/visual-tests/${projectId}`, updateData, config);
    
            console.log("Mise à jour réussie !");
            setLoading(false);
        } catch (error) {
            console.error("Erreur lors de la mise à jour des données:", error);
            setError("Erreur lors de la mise à jour des données");
            setLoading(false);
        }
    };

    const debouncedUpdateTitle = useDebouncedCallback((newTitle) => {
        updateTitleInDatabase(newTitle);
    }, 1000);

    const handleTitleChange = (e) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        debouncedUpdateTitle(newTitle);
        console.log(newTitle)
    };
    
    const updateTitleInDatabase = async (newTitle) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            console.log(newTitle)
    
            const response = await axios.put(`http://localhost:50005/api/auth/visual-tests/${test.id}`, 
                { title: newTitle },
                config
            );
            console.log('Mise à jour réussie', response.data);
        } catch (error) {
            console.error('Erreur lors de la mise à jour du titre', error);
        }
    };

    const { t } = useTranslation();

    if (!test) {
        return <div>Projet non trouvé</div>;
    }

  return (
    <div className='lou-grid lou-grid-rows-[auto_1fr] lou-gap-md lou-overflow-auto' lou-component='right-container'>
        <section className='lou-grid lou-gap-xl lou-grid-cols-[1fr_auto] lou-align-center lou-items-center'>
            <div className='lou-flex lou-items-center'>
                <button 
                    onClick={() => navigate('/visual-testing')}
                    className='lou-text-dark-500 lou-flex lou-justify-center lou-items-center lou-rounded-sm lou-w-8 lou-h-8 lou-transition lou-duration-300 hover:lou-text-dark hover:lou-bg-dark-100'
                    >
                    <FiArrowLeft />
                </button>
                <input
                    ref={inputRef}
                    type='text'
                    value={title}
                    placeholder='Titre de votre projet'
                    onChange={handleTitleChange}
                    onBlur={() => updateTitleInDatabase(title)} 
                    className='lou-text-2xl lou-w-full lou-font-bold lou-rounded-sm lou-px-sm lou-py-2xs lou-bg-transparent lou-border-2 lou-border-dark-30 lou-transition lou-duration-300 hover:lou-bg-white focus:lou-bg-white focus:lou-border-primary focus:lou-outline-none'
                />
                {/* <h1 className='lou-text-2xl lou-font-bold'>{test.title}</h1> */}
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
                {t('visual-design.results-tilte')} 
                {Array.isArray(getCompareSessionStorage) && (
                    <span className='lou-text-base lou-font-medium lou-pl-xs lou-text-danger'>{getCompareSessionStorage.length} {t('visual-design.results-errors')}</span>
                )}
            </h3>

            {loading ? (
                <div className="spinner">Loading...</div>
            ) : (
                <>
                {/* {error && <p className="text-red-500">{error}</p>} */}
                <div className='lou-grid lou-gap-md'>
                {Array.isArray(getCompareSessionStorage) && getCompareSessionStorage.length > 0 ? (
                        getCompareSessionStorage.map((item, index) => (
                        <div key={index} className="lou-border lou-border-dark-50 lou-rounded lou-overflow-hidden">
                            <h3 className='lou-bg-dark-50 lou-p-xs' >Calque: {item.name}</h3>
                            <div className="lou-p-sm lou-grid lou-gap-md">
                            {Object.keys(item).map((key, subIndex) => (
                                <div key={subIndex}>
                                    <div className='lou-text-center lou-grid lou-gap-xs'>
                                        {key !== 'name' && (
                                            <strong>{key}</strong>
                                        )}
                                        {/* If key is background */}
                                        {key === 'background' &&(
                                            <div className='lou-grid lou-grid-cols-[1fr_1fr] lou-gap-md'>
                                            <div className='lou-flex lou-gap-sm lou-justify-end'>
                                            <p>rgba({JSON.stringify(item[key].figma.r)}, {JSON.stringify(item[key].figma.g)}, {JSON.stringify(item[key].figma.b)}, {JSON.stringify(item[key].figma.a)})</p>
                                            <div 
                                                className='lou-w-[1.5rem] lou-h-[1.5rem] lou-rounded-xs' 
                                                style={{backgroundColor : `rgba(${JSON.stringify(item[key].figma.r)},${JSON.stringify(item[key].figma.g)},${JSON.stringify(item[key].figma.b)},${JSON.stringify(item[key].figma.a)})`}}
                                            ></div>
                                                
                                            </div>
                                            <div className='lou-flex lou-gap-sm'>
                                                <div 
                                                    className='lou-w-[1.5rem] lou-h-[1.5rem] lou-rounded-xs'
                                                    style={{backgroundColor : `rgba(${JSON.stringify(item[key].product.r)},${JSON.stringify(item[key].product.g)},${JSON.stringify(item[key].product.b)},${JSON.stringify(item[key].product.a)})`}}
                                                ></div>
                                                <p>rgba({JSON.stringify(item[key].product.r)}, {JSON.stringify(item[key].product.g)}, {JSON.stringify(item[key].product.b)}, {JSON.stringify(item[key].product.a)})</p>
                                            </div>
                                        </div>
                                        )}
                                        {/* If key is border color */}
                                        {key === 'borderColor' &&(
                                            <div className='lou-grid lou-grid-cols-[1fr_1fr] lou-gap-md'>
                                            <div className='lou-flex lou-gap-sm lou-justify-end'>
                                                {item[key].figma !== null ? (
                                                    <div className='lou-flex lou-gap-sm'>
                                                        <p>rgba({JSON.stringify(item[key].figma.r)}, {JSON.stringify(item[key].figma.g)}, {JSON.stringify(item[key].figma.b)}, {JSON.stringify(item[key].figma.a)})</p>
                                                        <div 
                                                            className='lou-w-[1.5rem] lou-h-[1.5rem] lou-rounded-xs lou-border-2' 
                                                            style={{borderColor : `rgba(${JSON.stringify(item[key].figma.r)},${JSON.stringify(item[key].figma.g)},${JSON.stringify(item[key].figma.b)},${JSON.stringify(item[key].figma.a)})`}}
                                                        ></div>
                                                    </div>
                                                    ) : (
                                                    <p className='lou-text-dark-300 lou-italic'>Undefined</p>
                                                )} 
                                            </div>
                                            <div className='lou-flex lou-gap-sm'>
                                                {item[key].figma !== null ? (
                                                    <div className='lou-flex lou-gap-sm'>
                                                        <div 
                                                            className='lou-w-[1.5rem] lou-h-[1.5rem] lou-rounded-xs lou-border-2' 
                                                            style={{borderColor : `rgba(${JSON.stringify(item[key].product.r)},${JSON.stringify(item[key].product.g)},${JSON.stringify(item[key].product.b)},${JSON.stringify(item[key].product.a)})`}}
                                                        ></div>
                                                        <p>rgba({JSON.stringify(item[key].product.r)}, {JSON.stringify(item[key].product.g)}, {JSON.stringify(item[key].product.b)}, {JSON.stringify(item[key].product.a)})</p>
                                                    </div>
                                                    ) : (
                                                    <p className='lou-text-dark-300 lou-italic'>Undefined</p>
                                                )} 
                                            </div>
                                        </div>
                                        )}
                                        {/* If key is borderStyle */}
                                        {key === 'borderStyle' &&(
                                            <div className='lou-grid lou-grid-cols-[1fr_1fr] lou-gap-md'>
                                            <div className='lou-flex lou-gap-sm lou-justify-end'>
                                                {item[key].figma !== null ? (
                                                    <div className='lou-flex lou-gap-sm'>
                                                       <p className='lou-capitalize'>{item[key].figma}</p> 

                                                        <div 
                                                            className={`lou-w-[1.5rem] lou-h-[1.5rem] lou-rounded-xs lou-border-2 lou-border-dark ${item[key].figma === 'SOLID' ? 'lou-border-solid`': 'lou-border-dashed'}`} 
                                                        ></div>
                                                    </div>
                                                    ) : (
                                                    <p className='lou-text-dark-300 lou-italic'>Undefined</p>
                                                )} 
                                            </div>
                                            <div className='lou-flex lou-gap-sm'>
                                                {item[key].figma !== null ? (
                                                    <div className='lou-flex lou-gap-sm'>
                                                        <div 
                                                            className={`lou-w-[1.5rem] lou-h-[1.5rem] lou-rounded-xs lou-border-2 lou-border-dark ${item[key].product === 'solid' ? 'lou-border-solid`': 'lou-border-dashed'}`} 
                                                        ></div>
                                                        <p className='lou-capitalize'>{item[key].product}</p> 
                                                    </div>
                                                    ) : (
                                                    <p className='lou-text-dark-300 lou-italic'>Undefined</p>
                                                )} 
                                            </div>
                                        </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            </div>
                        </div>
                        ))
                    ) : (
                        <p>Aucun résultat trouvé</p>
                    )}
                </div>
                </>
            )}
            </section>
        </main>
    </div>
  );
};

export default VisualTestingDetailPage;