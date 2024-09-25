import React, { useState, useEffect, useRef } from 'react';
import '../../../i18n';
import { useTranslation } from 'react-i18next';
import InputText from '../../../Components/Inputs/Input-text/Input-text'; 
import Button from '../../../Components/Buttons/Button/Button';
import { compareData } from '../Compare-jsons';
import { useParams } from 'react-router-dom';
import UserDropdown from '../../../Components/User-dropdown/User-dropdown';
import { FiArrowLeft, FiBookmark, FiFigma, FiFilter, FiLink, FiMaximize, FiMaximize2, FiMonitor, FiMoreVertical, FiSearch, FiTrash, FiTrash2 } from 'react-icons/fi';
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import { useDebouncedCallback } from 'use-debounce';
import { format, formatDistanceToNowStrict, differenceInMinutes, differenceInHours, differenceInDays, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import MoreButton from '../../../Components/Buttons/More-button/More-button';
import CardCompareVisuaTesting from '../../../Components/Cards/Compare-visual-testing/Compare-visual-testing';

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
    const [getComparePercentSessionStorage, setComparePercentSessionStorage] = useState(null);
    const [getFigmaNoMatchSessionStorage, setFigmaNoMatchSessionStorage] = useState([]);
    const [getProductNoMatchSessionStorage, setProductNoMatchSessionStorage] = useState([]);
    const [figmaUrlDb, setFigmaUrlDb] = useState([]);
    const [count, setCount] = useState(0);
    const [test, setTest] = useState([]);
    const [title, setTitle] = useState('');
    const inputRef = useRef(null);
    const location = useLocation();
    const [inputWidth, setInputWidth] = useState(1); 
    const spanRef = useRef(null);
    const navigate = useNavigate();

    const adjustInputWidth = () => {
        if (spanRef.current) {
            const newWidth = spanRef.current.offsetWidth + 24;
            setInputWidth(newWidth);
        }
    };

    useEffect(() => {
        if (location.state && location.state.focusInput && inputRef.current) {
            inputRef.current.focus();
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
                if (foundTest.percent !== null && foundTest.percent !== undefined) {
                    setComparePercentSessionStorage(foundTest.percent);
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

            const getFigmaNoMatchSessionStorage = JSON.parse(sessionStorage.getItem('figmaNoMatch'));
            setFigmaNoMatchSessionStorage(getFigmaNoMatchSessionStorage);

            const getProductNoMatchSessionStorage = JSON.parse(sessionStorage.getItem('productNoMatch'));
            setProductNoMatchSessionStorage(getProductNoMatchSessionStorage);

            const getComparePercent = sessionStorage.getItem('comparePercent');
            setComparePercentSessionStorage(getComparePercent)

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
                jsonArray: [getCompareSessionStorage],
                percent: getComparePercent
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
    };
    
    const updateTitleInDatabase = async (newTitle) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
    
            const response = await axios.put(`http://localhost:50005/api/auth/visual-tests/${test.id}`, 
                { title: newTitle },
                config
            );
            console.log('Mise à jour réussie', response.data);
        } catch (error) {
            console.error('Erreur lors de la mise à jour du titre', error);
        }
    };

    useEffect(() => {
        adjustInputWidth();
    }, [title, test]);

    const formatRelativeDate = (dateString) => {
        if (!dateString) {
            return 'Date non disponible';
        }
    
        try {
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
        } catch (error) {
            console.error('Erreur de parsing de la date:', error);
            return 'Date incorrecte';
        }
    };

    const handleDeleteTest = async () => {
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

            await axios.delete(`http://localhost:50005/api/auth/visual-tests/${projectId}`, config);

            navigate('/visual-testing');
        } catch (error) {
            console.error('Erreur lors de la suppression du test:', error);
        }
    };

    const getBoxShadowValue = (shadowList) => {
        return shadowList
            .map(currentShadow => 
                `${currentShadow.x}px ${currentShadow.y}px ${currentShadow.blur}px rgba(${currentShadow.color.r}, ${currentShadow.color.g}, ${currentShadow.color.b}, ${currentShadow.color.a})`
            )
            .join(', ');
    };
    

    const { t } = useTranslation();

    if (!test) {
        return <div>Projet non trouvé</div>;
    }

  return (
    <div className='lou-grid lou-grid-rows-[auto_1fr] lou-gap-md lou-overflow-auto' lou-component='right-container'>
        <section className='lou-grid lou-gap-xl lou-grid-cols-[1fr_auto] lou-align-center lou-items-center'>
            <div className='lou-flex lou-items-center'>
                {/* <div> */}
                <div className='lou-flex'>
                    <div className='lou-flex lou-items-center'>
                        <button 
                            onClick={() => navigate('/visual-testing')}
                            className='lou-text-dark-500 lou-flex lou-justify-center lou-items-center lou-rounded-sm lou-w-8 lou-h-8 lou-transition lou-duration-300 hover:lou-text-dark hover:lou-bg-dark-100'
                            >
                            <FiArrowLeft />
                        </button>
                        <div>
                            <span className='lou-text-2xl lou-font-bold' ref={spanRef} style={{ visibility: 'hidden', whiteSpace: 'pre', position: 'absolute', zIndex: '-20'}}>
                                {title || ' '}
                            </span>
                            <input
                                ref={inputRef}
                                type='text'
                                value={title}
                                maxLength='50'
                                placeholder='Titre de votre projet'
                                onChange={handleTitleChange}
                                onBlur={() => updateTitleInDatabase(title)} 
                                style={{ width: `${inputWidth}px`, minWidth: '4rem' }}
                                className='lou-text-2xl lou-font-bold lou-rounded-sm lou-px-xs lou-py-2xs lou-bg-transparent lou-border-2 lou-border-dark-30 lou-transition lou-duration-300 hover:lou-bg-white focus:lou-bg-white focus:lou-border-primary focus:lou-outline-none'
                            />
                            <p className='lou-px-xs lou-text-dark-500 lou-text-sm'>{formatRelativeDate(test.updatedAt)}</p>
                        </div>
                    </div>
                    <div className='lou-pt-xs'>
                        <p className={`lou-px-xs lou-py-2xs lou-rounded-sm lou-text-sm lou-border-2 lou-border-white ${getComparePercentSessionStorage === 100 ? 'lou-text-success lou-bg-success-100' : ''} ${getComparePercentSessionStorage < 100 && getComparePercentSessionStorage > 50 ? 'lou-text-warning lou-bg-warning-100' : ''} ${getComparePercentSessionStorage < 51 && getComparePercentSessionStorage !== null ? 'lou-text-danger lou-bg-danger-100' : ''} ${getComparePercentSessionStorage === null ? 'lou-text-dark-500 lou-bg-dark-50' : ''}`}>
                        {getComparePercentSessionStorage !== null ? getComparePercentSessionStorage + '%' : 'Vide'}                        </p>
                    </div>
                </div>
            </div>
            <UserDropdown />
        </section>

        <main className='lou-grid lou-grid-rows-[auto_1fr] lou-gap-md lou-overflow-auto'>
            <section className='lou-bg-white lou-rounded lou-border lou-border-dark-50 lou-grid lou-grid-cols-[auto_1fr_1fr_auto] lou-gap-sm lou-border-b lou-border-dark-50 lou-p-sm'>
                <Button
                    text='Compare'
                    onClick={() => {handleCompareClick();}}
                />
                <InputText
                    placeholder='URL Figma'
                    type="text"
                    value={figmaUrl}
                    icon={<FiFigma/>}
                    onChange={(e) => {setFigmaUrl(e.target.value);}}
                />
                <InputText
                    placeholder='URL produit'
                    type="text"
                    value={productUrl ? productUrl : ''}
                    icon={<FiMonitor/>}
                    onChange={(e) => setProductUrl(e.target.value)}
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
                            text: 'Supprimer',
                            click: handleDeleteTest,
                            icon: <FiTrash2/>,
                            variant:'danger'
                            }
                        ]}
                    />
                </div>
            </section>
            <section className='lou-overflow-auto'>

            {loading ? (
                <div className="spinner">Loading...</div>
            ) : (
                <>
                {!getCompareSessionStorage && !loading ? (
                    <div className="lou-grid lou-items-center lou-text-center lou-p-sm">
                        <div>
                            <h3 className='lou-text-xl lou-font-bold'>Vous n'avez pas encore fait de comparaison.</h3>
                            <p className='lou-text-dark-500 lou-mb-lg'>Cliquez sur le bouton "Comparer" pour démarrer votre premier test.</p>
                            <Button
                                text='Compare'
                                onClick={() => {handleCompareClick();}}
                            />
                        </div>
                    </div>
                ) : (
                    <div className='lou-grid lou-gap-xl lou-h-full'>
                    {Array.isArray(getCompareSessionStorage) && getCompareSessionStorage.length > 0 ? (
                            getCompareSessionStorage.map((item, index) => (
                            <div key={index} className="lou-overflow-hidden">
                                <div className='lou-flex lou-gap-2xs lou-mb-sm lou-items-center'>
                                    <FiBookmark className='lou-text-dark-300'/>
                                    <h3 className='lou-text-xl lou-font-bold lou-capitalize'>{item.name}</h3>
                                </div>
                                <div className="lou-grid lou-gap-md lou-grid-cols-card-list">
                                {Object.keys(item).map((key, subIndex) => (
                                    typeof key === 'string' && key !== 'name' && (
                                        (() => {
                                        switch (key) {
                                            case 'background':
                                                return (
                                                    <CardCompareVisuaTesting
                                                        key={subIndex}
                                                        title={'Background color'}
                                                        figmaData={`rgba(${JSON.stringify(item[key].figma.r)}, ${JSON.stringify(item[key].figma.g)}, ${JSON.stringify(item[key].figma.b)}, ${JSON.stringify(item[key].figma.a)})`}
                                                        figmaStyle={{backgroundColor: `rgba(${JSON.stringify(item[key].figma.r)}, ${JSON.stringify(item[key].figma.g)}, ${JSON.stringify(item[key].figma.b)}, ${JSON.stringify(item[key].figma.a)})`}}
                                                        figmaStyleClassName='lou-border-y-2 lou-border-l-2 lou-border-white'
                                                        productData={`rgba(${JSON.stringify(item[key].product.r)}, ${JSON.stringify(item[key].product.g)}, ${JSON.stringify(item[key].product.b)}, ${JSON.stringify(item[key].product.a)})`}
                                                        productStyle={{backgroundColor: `rgba(${JSON.stringify(item[key].product.r)}, ${JSON.stringify(item[key].product.g)}, ${JSON.stringify(item[key].product.b)}, ${JSON.stringify(item[key].product.a)})`}}
                                                        productStyleClassName='lou-border-y-2 lou-border-r-2 lou-border-white'
                                                    />
                                                );
                                            case 'borderColor':
                                                return (
                                                    <CardCompareVisuaTesting
                                                        key={subIndex}
                                                        title={'Border color'}
                                                        figmaData={item[key].figma !== null ? `rgba(${JSON.stringify(item[key].figma.r)}, ${JSON.stringify(item[key].figma.g)}, ${JSON.stringify(item[key].figma.b)}, ${JSON.stringify(item[key].figma.a)})` : 'Undefined'}
                                                        figmaStyle={item[key].figma !== null ? {borderColor: `rgba(${JSON.stringify(item[key].figma.r)}, ${JSON.stringify(item[key].figma.g)}, ${JSON.stringify(item[key].figma.b)}, ${JSON.stringify(item[key].figma.a)})`} : undefined}
                                                        figmaStyleClassName='lou-bg-white lou-border-y-2 lou-border-l-2'
                                                        productData={item[key].product !== null ? `rgba(${JSON.stringify(item[key].product.r)}, ${JSON.stringify(item[key].product.g)}, ${JSON.stringify(item[key].product.b)}, ${JSON.stringify(item[key].product.a)})` : 'Undefined'}
                                                        productStyle={item[key].product !== null ? {borderColor: `rgba(${JSON.stringify(item[key].product.r)}, ${JSON.stringify(item[key].product.g)}, ${JSON.stringify(item[key].product.b)}, ${JSON.stringify(item[key].product.a)})`} : undefined}
                                                        productStyleClassName='lou-bg-white lou-border-y-2 lou-border-r-2'
                                                    />
                                                );

                                                case 'borderSize':
                                                    return (
                                                        <CardCompareVisuaTesting
                                                            key={subIndex}
                                                            title={'Border size'}
                                                            figmaData={item[key]?.figma?.top !== undefined && item[key]?.figma?.bottom !== undefined &&
                                                                    item[key]?.figma?.right !== undefined && item[key]?.figma?.left !== undefined 
                                                                ? (item[key].figma.top === item[key].figma.bottom && 
                                                                item[key].figma.top === item[key].figma.right && 
                                                                item[key].figma.top === item[key].figma.left 
                                                                    ? `${item[key].figma.top}px` 
                                                                    : `${item[key].figma.top}px ${item[key].figma.right}px ${item[key].figma.bottom}px ${item[key].figma.left}px`
                                                                )
                                                                : 'Undefined'
                                                            }
                                                            figmaStyle={item[key]?.figma?.top !== undefined && item[key]?.figma?.bottom !== undefined &&
                                                                        item[key]?.figma?.right !== undefined && item[key]?.figma?.left !== undefined 
                                                                ? { borderWidth: `${item[key].figma.top}px ${item[key].figma.right}px ${item[key].figma.bottom}px ${item[key].figma.left}px` }
                                                                : undefined
                                                            }
                                                            figmaStyleClassName='lou-bg-white lou-border-blue-dark'
                                                            productData={item[key]?.product?.top !== undefined && item[key]?.product?.bottom !== undefined &&
                                                                        item[key]?.product?.right !== undefined && item[key]?.product?.left !== undefined 
                                                                ? (item[key].product.top === item[key].product.bottom && 
                                                                item[key].product.top === item[key].product.right && 
                                                                item[key].product.top === item[key].product.left 
                                                                    ? `${item[key].product.top}px` 
                                                                    : `${item[key].product.top}px ${item[key].product.right}px ${item[key].product.bottom}px ${item[key].product.left}px`
                                                                )
                                                                : 'Undefined'
                                                            }
                                                            productStyle={item[key]?.product?.top !== undefined && item[key]?.product?.bottom !== undefined &&
                                                                        item[key]?.product?.right !== undefined && item[key]?.product?.left !== undefined 
                                                                ? { borderWidth: `${item[key].product.top}px ${item[key].product.right}px ${item[key].product.bottom}px ${item[key].product.left}px` }
                                                                : undefined
                                                            }
                                                            productStyleClassName='lou-bg-white lou-border-blue-dark'
                                                        />
                                                    );
                                                
                                            
                                            case 'borderStyle':
                                                return (
                                                    <CardCompareVisuaTesting
                                                        key={subIndex}
                                                        title={'Border style'}
                                                        figmaData={item[key].figma !== null ? item[key].figma : 'Undefined'}
                                                        figmaStyle={item[key].figma !== null ? {borderStyle : `${item[key].figma}`} : undefined}
                                                        figmaStyleClassName='lou-bg-white lou-border-y-2 lou-border-l-2 lou-border-blue-dark'
                                                        productData={item[key].product !== null ? item[key].product : 'Undefined'}
                                                        productStyle={item[key].product !== null ? { borderStyle : `${item[key].product}`} : undefined}
                                                        productStyleClassName='lou-bg-white lou-border-blue-dark lou-border-y-2 lou-border-r-2'
                                                    />
                                                );
                                            
                                            case 'blur':
                                                return (
                                                    <CardCompareVisuaTesting
                                                        key={subIndex}
                                                        title={'Blur'}
                                                        figmaData={item[key].figma !== null ? `${item[key].figma}px` : 'Undefined'}
                                                        figmaStyle={item[key].figma !== null ? { filter: `blur(${item[key].figma}px)` } : undefined}
                                                        figmaStyleClassName='lou-bg-white lou-border-y-2 lou-border-l-2 lou-border-blue-dark'
                                                        productData={item[key].product !== null ? `${item[key].product}px` : 'Undefined'}
                                                        productStyle={item[key].product !== null ? { filter: `blur(${item[key].product}px)`} : undefined}
                                                        productStyleClassName='lou-bg-white lou-border-blue-dark lou-border-y-2 lou-border-r-2'
                                                    />
                                                );
                                            
                                            case 'BoxShadow':
                                                return (
                                                    <CardCompareVisuaTesting
                                                        key={subIndex}
                                                        title={'Box shadow'}
                                                        figmaData={item[key].figma !== null ? getBoxShadowValue(item[key].figma) : 'Undefined'}
                                                        figmaStyle={item[key].figma !== null ? { boxShadow: `${getBoxShadowValue(item[key].figma)}` } : undefined}
                                                        figmaStyleClassName='lou-bg-white'
                                                        productData={item[key].product !== null ? getBoxShadowValue(item[key].product) : 'Undefined'}
                                                        productStyle={item[key].product !== null ? { boxShadow: `${getBoxShadowValue(item[key].product)}`} : undefined}
                                                        productStyleClassName='lou-bg-white'
                                                    />
                                                );
                                            
                                            case 'borderRadius':
                                                return (
                                                    <CardCompareVisuaTesting
                                                        key={subIndex}
                                                        title={'Border radius'}
                                                        figmaData={item[key].figma !== null ? (item[key].figma.topRight === item[key].figma.bottomRight && item[key].figma.topRight === item[key].figma.bottomLeft && item[key].figma.topRight == item[key].figma.topLeft ? `${item[key].figma.topRight}px` : `${item[key].figma.topLeft}px ${item[key].figma.topRight}px ${item[key].figma.bottomRight}px ${item[key].figma.bottomLeft}px`) : 'Undefined'}
                                                        figmaStyle={item[key].figma !== null ? {width: '30px',transform: 'translateX(-3px)',borderRadius:`${(item[key].figma.topLeft)/2}px ${(item[key].figma.topRight)/2}px ${(item[key].figma.bottomRight)/2}px ${(item[key].figma.bottomLeft)/2}px`} : undefined}
                                                        figmaStyleClassName='lou-bg-blue-dark'
                                                        productData={item[key].product !== null ? (item[key].product.topRight === item[key].product.bottomRight && item[key].product.topRight === item[key].product.bottomLeft && item[key].product.topRight == item[key].product.topLeft ? `${item[key].product.topRight}px` : `${item[key].product.topLeft}px ${item[key].product.topRight}px ${item[key].product.bottomRight}px ${item[key].product.bottomLeft}px`) : 'Undefined'}
                                                        productStyle={item[key].figma !== null ? {width: '30px',transform:'translate(3px)',borderRadius:`${(item[key].product.topLeft)/2}px ${(item[key].product.topRight)/2}px ${(item[key].product.bottomRight)/2}px ${(item[key].product.bottomLeft)/2}px`} : undefined}
                                                        productStyleClassName='lou-bg-blue-dark'
                                                    />
                                                );
                                            
                                            case 'width':
                                                return (
                                                    <CardCompareVisuaTesting
                                                        key={subIndex}
                                                        title={'Width'}
                                                        figmaData={item[key].figma !== null ? `${item[key].figma}px` : 'Undefined'}
                                                        figmaStyle={item[key].figma !== null ? (item[key].figma > item[key].product ? {width: '30px'} : {transform: 'translate(-12px)'}) : undefined}
                                                        figmaStyleClassName='lou-bg-blue-dark lou-rounded-xs lou-flex lou-items-center lou-justify-center'
                                                        figmaIcon={<FiMaximize2 className='lou-text-danger lou-rotate-45 lou-translate-y-6'/>}
                                                        productData={item[key].product !== null ? `${item[key].product}px` : 'Undefined'}
                                                        productStyle={item[key].product !== null ? (item[key].figma < item[key].product ? {width: '30px'} : {transform: 'translate(12px)'}) : undefined}
                                                        productStyleClassName='lou-bg-blue-dark lou-rounded-xs lou-flex lou-items-center lou-justify-center'
                                                        productIcon={<FiMaximize2 className='lou-text-danger lou-rotate-45 lou-translate-y-6'/>}
                                                    />
                                                );
                                            
                                            case 'widthMax':
                                                return (
                                                    <CardCompareVisuaTesting
                                                        key={subIndex}
                                                        title={'Max width'}
                                                        figmaData={item[key].figma !== null ? `${item[key].figma}px` : 'Undefined'}
                                                        figmaStyle={item[key].figma !== null ? (item[key].figma > item[key].product ? {width: '30px'} : {transform: 'translate(-12px)'}) : undefined}
                                                        figmaStyleClassName='lou-bg-blue-dark lou-rounded-xs lou-flex lou-items-center lou-justify-center'
                                                        figmaIcon={<FiMaximize2 className='lou-text-danger lou-rotate-45 lou-translate-y-6'/>}
                                                        productData={item[key].product !== null ? `${item[key].product}px` : 'Undefined'}
                                                        productStyle={item[key].product !== null ? (item[key].figma < item[key].product ? {width: '30px'} : {transform: 'translate(12px)'}) : undefined}
                                                        productStyleClassName='lou-bg-blue-dark lou-rounded-xs lou-flex lou-items-center lou-justify-center'
                                                        productIcon={<FiMaximize2 className='lou-text-danger lou-rotate-45 lou-translate-y-6'/>}
                                                    />
                                                );

                                            case 'widthMin':
                                                return (
                                                    <CardCompareVisuaTesting
                                                        key={subIndex}
                                                        title={'Min width'}
                                                        figmaData={item[key].figma !== null ? `${item[key].figma}px` : 'Undefined'}
                                                        figmaStyle={item[key].figma !== null ? (item[key].figma > item[key].product ? {width: '30px'} : {transform: 'translate(-12px)'}) : undefined}
                                                        figmaStyleClassName='lou-bg-blue-dark lou-rounded-xs lou-flex lou-items-center lou-justify-center'
                                                        figmaIcon={<FiMaximize2 className='lou-text-danger lou-rotate-45 lou-translate-y-6'/>}
                                                        productData={item[key].product !== null ? `${item[key].product}px` : 'Undefined'}
                                                        productStyle={item[key].product !== null ? (item[key].figma < item[key].product ? {width: '30px'} : {transform: 'translate(12px)'}) : undefined}
                                                        productStyleClassName='lou-bg-blue-dark lou-rounded-xs lou-flex lou-items-center lou-justify-center'
                                                        productIcon={<FiMaximize2 className='lou-text-danger lou-rotate-45 lou-translate-y-6'/>}
                                                    />
                                                );

                                            case 'height':
                                                return (
                                                    <CardCompareVisuaTesting
                                                        key={subIndex}
                                                        title={'Height'}
                                                        figmaData={item[key].figma !== null ? `${item[key].figma}px` : 'Undefined'}
                                                        figmaStyle={item[key].figma !== null ? (item[key].figma > item[key].product ? {width: '30px'} : {transform: 'translate(-12px)'}) : undefined}
                                                        figmaStyleClassName='lou-bg-blue-dark lou-rounded-xs lou-flex lou-items-center lou-justify-center'
                                                        figmaIcon={<FiMaximize2 className='lou-text-danger lou-rotate-45 lou-translate-y-6'/>}
                                                        productData={item[key].product !== null ? `${item[key].product}px` : 'Undefined'}
                                                        productStyle={item[key].product !== null ? (item[key].figma < item[key].product ? {width: '30px'} : {transform: 'translate(12px)'}) : undefined}
                                                        productStyleClassName='lou-bg-blue-dark lou-rounded-xs lou-flex lou-items-center lou-justify-center'
                                                        productIcon={<FiMaximize2 className='lou-text-danger lou-rotate-45 lou-translate-y-6'/>}
                                                        iconContainerClass='lou-rotate-90'
                                                    />
                                                );
                                                
                                            case 'heightMax':
                                                return (
                                                    <CardCompareVisuaTesting
                                                        key={subIndex}
                                                        title={'Max height'}
                                                        figmaData={item[key].figma !== null ? `${item[key].figma}px` : 'Undefined'}
                                                        figmaStyle={item[key].figma !== null ? (item[key].figma > item[key].product ? {width: '30px'} : {transform: 'translate(-12px)'}) : undefined}
                                                        figmaStyleClassName='lou-bg-blue-dark lou-rounded-xs lou-flex lou-items-center lou-justify-center'
                                                        figmaIcon={<FiMaximize2 className='lou-text-danger lou-rotate-45 lou-translate-y-6'/>}
                                                        productData={item[key].product !== null ? `${item[key].product}px` : 'Undefined'}
                                                        productStyle={item[key].product !== null ? (item[key].figma < item[key].product ? {width: '30px'} : {transform: 'translate(12px)'}) : undefined}
                                                        productStyleClassName='lou-bg-blue-dark lou-rounded-xs lou-flex lou-items-center lou-justify-center'
                                                        productIcon={<FiMaximize2 className='lou-text-danger lou-rotate-45 lou-translate-y-6'/>}
                                                        iconContainerClass='lou-rotate-90'
                                                    />
                                                );

                                            case 'heightMin':
                                                return (
                                                    <CardCompareVisuaTesting
                                                        key={subIndex}
                                                        title={'Min height'}
                                                        figmaData={item[key].figma !== null ? `${item[key].figma}px` : 'Undefined'}
                                                        figmaStyle={item[key].figma !== null ? (item[key].figma > item[key].product ? {width: '30px'} : {transform: 'translate(-12px)'}) : undefined}
                                                        figmaStyleClassName='lou-bg-blue-dark lou-rounded-xs lou-flex lou-items-center lou-justify-center'
                                                        figmaIcon={<FiMaximize2 className='lou-text-danger lou-rotate-45 lou-translate-y-6'/>}
                                                        productData={item[key].product !== null ? `${item[key].product}px` : 'Undefined'}
                                                        productStyle={item[key].product !== null ? (item[key].figma < item[key].product ? {width: '30px'} : {transform: 'translate(12px)'}) : undefined}
                                                        productStyleClassName='lou-bg-blue-dark lou-rounded-xs lou-flex lou-items-center lou-justify-center'
                                                        productIcon={<FiMaximize2 className='lou-text-danger lou-rotate-45 lou-translate-y-6'/>}
                                                        iconContainerClass='lou-rotate-90'
                                                    />
                                                );

                                            case 'gap':
                                                return (
                                                    <CardCompareVisuaTesting
                                                        key={subIndex}
                                                        title={'Gap'}
                                                        figmaData={item[key].figma !== null ? `${item[key].figma}px` : 'Undefined'}
                                                        figmaStyle={item[key].figma !== null ? (item[key].figma > item[key].product ? {borderRadius: '0', width: '30px'} : {borderRadius: '0', padding:'2px', width: '16px', transform: 'translate(-12px)'}) : undefined}
                                                        figmaStyleClassName='lou-border-r-2 lou-border-l-2 lou-rounded-l-none lou-border-danger lou-flex lou-items-center lou-justify-center'
                                                        figmaIcon={<FiMaximize2 className='lou-text-danger lou-rotate-45'/>}
                                                        productData={item[key].product !== null ? `${item[key].product}px` : 'Undefined'}
                                                        productStyle={item[key].product !== null ? (item[key].figma < item[key].product ? {borderRadius: '0', width: '30px'} : {borderRadius: '0', padding:'2px', width: '16px', transform: 'translate(12px)'}) : undefined}
                                                        productStyleClassName='lou-border-r-2 lou-border-l-2 lou-border-danger lou-rounded-r-none lou-flex lou-items-center lou-justify-center'
                                                        productIcon={<FiMaximize2 className='lou-text-danger lou-rotate-45 lou-text-2xs'/>}
                                                    />
                                                );

                                            case 'Opacity':
                                                return (
                                                    <CardCompareVisuaTesting
                                                        key={subIndex}
                                                        title={'Opacity'}
                                                        figmaData={item[key].figma !== null ? `${(item[key].figma)*100}%` : 'Undefined'}
                                                        figmaStyle={item[key].figma !== null ? {opacity: `${item[key].figma}`} : undefined}
                                                        figmaStyleClassName='lou-bg-blue-dark'
                                                        productData={item[key].product !== null ? `${(item[key].product)*100}%` : 'Undefined'}
                                                        productStyle={item[key].product !== null ? {opacity: `${item[key].product}`} : undefined}
                                                        productStyleClassName='lou-bg-blue-dark'
                                                    />
                                                );
                                            case 'backgroundBlur':
                                                return (
                                                    <CardCompareVisuaTesting
                                                        key={subIndex}
                                                        title={'Background blur'}
                                                        figmaData={item[key].figma !== null ? `${item[key].figma}px` : 'Undefined'}
                                                        figmaStyle={item[key].figma !== null ? {backdropFilter: `blur(${item[key].figma}px)`} : undefined}
                                                        figmaStyleClassName='lou-bg-white lou-border-l-2 lou-border-y-2 lou-border-blue-dark'
                                                        productData={item[key].product !== null ? `${item[key].product}px` : 'Undefined'}
                                                        productStyle={item[key].product !== null ? {backdropFilter: `blur(${item[key].product})px`} : undefined}
                                                        productStyleClassName='lou-bg-white lou-border-r-2 lou-border-y-2 lou-border-blue-dark'
                                                    />
                                                );
                                            case 'padding':
                                                return (
                                                    <CardCompareVisuaTesting
                                                        key={subIndex}
                                                        title={'Padding'}
                                                        figmaData={item[key].figma !== null ? (item[key].figma.top === item[key].figma.bottom && item[key].figma.top === item[key].figma.right && item[key].figma.top == item[key].figma.left ? `${item[key].figma.top}px` : `${item[key].figma.top}px ${item[key].figma.right}px ${item[key].figma.bottom}px ${item[key].figma.left}px`) : 'Undefined'}
                                                        figmaStyle={item[key].figma !== null ? {borderWidth:`${(item[key].figma.top)/2}px 0px ${(item[key].figma.bottom)/2}px ${(item[key].figma.left)/2}px`} : undefined}
                                                        figmaStyleClassName='lou-bg-white lou-border-info-500'
                                                        productData={item[key].product !== null ? (item[key].product.top === item[key].product.bottom && item[key].product.top === item[key].product.right && item[key].product.top == item[key].product.left ? `${item[key].product.top}px` : `${item[key].product.top}px ${item[key].product.right}px ${item[key].product.bottom}px ${item[key].product.left}px`) : 'Undefined'}
                                                        productStyle={item[key].product !== null ? {borderWidth:`${(item[key].product.top)/2}px ${(item[key].product.right)/2}px ${(item[key].product.bottom)/2}px 0px`} : undefined}
                                                        productStyleClassName='lou-bg-white lou-border-info-300'
                                                    />
                                                );

                                            default:
                                            return null;
                                        }
                                        })()
                                    )
                                    ))}
                                </div>
                            </div>
                            ))
                        ) : (
                            <div className='lou-grid lou-items-center'>
                                <div>
                                    <h3 className='lou-text-xl lou-font-bold lou-text-center'>C'est nickel !</h3>
                                    <p className='lou-text-dark-500 lou-mb-lg lou-text-center'>C'est un sans faute, il n'y a aucune erreur.</p>
                                </div>
                            </div>
                        )}
                </div>
                )}
                {/* {error && <p className="text-red-500">{error}</p>} */}
                </>
            )}
            </section>
        </main>
    </div>
  );
};

export default VisualTestingDetailPage;