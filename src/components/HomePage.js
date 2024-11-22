import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import '../styles/HomePage.css';

function HomePage({ darkMode, toggleDarkMode }) {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Aplicar a classe 'dark' ao body quando o darkMode for ativado
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (name && company) {
      setIsLoading(true);
      localStorage.setItem('inputName', name);
      localStorage.setItem('inputEmpresa', company);
      
      const newRecord = { name, company };
      const records = JSON.parse(localStorage.getItem('records') || '[]');
      records.push(newRecord);
      localStorage.setItem('records', JSON.stringify(records));

      setTimeout(() => {
        setIsLoading(false);
        navigate('/second-page');
      }, 1000);
    } else {
      alert('Por favor, preencha todos os campos.');
    }
  };

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <div className="container">
        <button 
          onClick={toggleDarkMode} 
          className="theme-toggle"
          aria-label={darkMode ? "Ativar modo claro" : "Ativar modo escuro"}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        
        <h1>Começa Aqui !!!</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              id="inputName"
              type="text"
              placeholder="Insira seu nome..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="form-group">
            <input
              id="inputEmpresa"
              type="text"
              placeholder="Insira o nome da empresa..."
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              autoComplete="off"
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
          >
            {isLoading ? 'Salvando...' : 'Salvar'}
          </button>
        </form>
        
        <footer>
          © Andre Junior ~ Dev
        </footer>
      </div>
    </div>
  );
}

export default HomePage;

