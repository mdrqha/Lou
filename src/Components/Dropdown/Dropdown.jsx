// ATTENTION COMPOSANT NON OK

import React, { useState, useRef, useEffect } from 'react';

const Dropdown = ({ options, text, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false); // Gère l'état ouvert/fermé du dropdown
  const [selectedOption, setSelectedOption] = useState(null); // Option sélectionnée
  const dropdownRef = useRef(null); // Référence pour gérer les clics à l'extérieur

  // Fonction pour basculer l'ouverture/fermeture du dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Fonction pour fermer le dropdown si on clique à l'extérieur
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false); // Ferme le dropdown si on clique à l'extérieur
    }
  };

  // Ajouter un écouteur d'événements pour gérer le clic à l'extérieur
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside); // Nettoyage de l'écouteur
    };
  }, []);

  // Gestion de la sélection d'une option
  const handleSelect = (option) => {
    setSelectedOption(option); // Mettre à jour l'option sélectionnée
    onSelect(option); // Appeler la fonction onSelect fournie
    setIsOpen(false); // Fermer le dropdown
  };

  return (
    <div className="lou-relative" ref={dropdownRef}>
      <button 
        onClick={toggleDropdown} 
        className="lou-p-xs lou-bg-dark-50 lou-rounded-sm hover:lou-bg-dark-100 lou-transition-all lou-duration-300 lou-w-full lou-text-left"
      >
        {/* Afficher le texte ou l'option sélectionnée */}
        {selectedOption ? selectedOption.label || selectedOption : text}
      </button>
      
      <div 
        className={`lou-bg-white lou-p-xs lou-border lou-border-dark-50 lou-absolute lou-top-[2.8rem] lou-rounded-lg lou-w-[12rem] lou-transition-all lou-duration-300 lou-shadow-lg lou-w-full ${isOpen ? 'lou-translate-y-0 lou-opacity-100' : 'lou--translate-y-2.5 lou-opacity-0 lou-pointer-events-none'}`}
      >
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSelect(option)} 
            value={option.value || option}  // Utiliser la `value` ou l'option entière si pas de `value`
            className="lou-grid lou-gap-xs lou-grid-cols-[auto_1fr] lou-items-center lou-p-xs lou-w-full hover:lou-bg-dark-30 lou-rounded lou-transition-all lou-duration-300"
          > 
            <span className="lou-text-left">{option.label || option}</span>  {/* Utiliser le `label` ou l'option elle-même */}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dropdown;
