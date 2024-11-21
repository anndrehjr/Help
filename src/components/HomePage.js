import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import '../styles/HomePage.css';

const HomePage = ({ darkMode, toggleDarkMode }) => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (name && company) {
      localStorage.setItem('inputName', name);
      localStorage.setItem('inputEmpresa', company);
      
      const newRecord = { name, company };
      const records = JSON.parse(localStorage.getItem('records') || '[]');
      records.push(newRecord);
      localStorage.setItem('records', JSON.stringify(records));

      alert('Dados adicionados com sucesso! Você será redirecionado.');
      navigate('/second-page');
    } else {
      alert('Por favor, preencha todos os campos.');
    }
  };

  return (
    <div id="Inicio" className={darkMode ? 'dark-mode' : ''}>
      <main className="Inicio-001">
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
          <button type="submit" id="submitButton">Salvar</button>
        </form>
      </main>
      <button 
        onClick={toggleDarkMode} 
        className="dark-mode-toggle"
      >
        {darkMode ? <Sun /> : <Moon />}
      </button>
      <footer>© Andre Junior ~ Dev</footer>
    </div>
  );
};

export default HomePage;

