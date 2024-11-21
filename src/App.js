import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import SecondPage from './components/SecondPage';
import './App.css';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    document.body.classList.toggle('dark-mode', newDarkMode);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={<HomePage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} 
          />
          <Route 
            path="/second-page" 
            element={<SecondPage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

