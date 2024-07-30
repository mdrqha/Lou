import logo from './logo.svg';
import './App.css';
import './App.css';
import React, { useState } from 'react';

const App = () => {
  const [url, setUrl] = useState('');

  const handleInputChange = (e) => {
    setUrl(e.target.value);
  };

  const handleInspectClick = () => {
    // Remplacez cette ligne par votre logique d'exécution
    console.log('Inspecting URL:', url);
    alert(`Inspecting URL: ${url}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={url}
          onChange={handleInputChange}
          placeholder="Enter URL here"
          className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleInspectClick}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Inspect
        </button>
      </div>
    </div>
  );
};

export default App;


// function App() {
//   return (
//     <div className="bg-blue-500 text-white p-6">
//       <h1 className="text-3xl font-bold">Hello Tailwind!</h1>
//     </div>
//   );
// }

// export default App;
