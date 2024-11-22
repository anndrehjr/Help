import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import './Dashboard.css';

function Dashboard() {
  const [userData, setUserData] = useState({ nome: '', empresa: '' });
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useTheme();

  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      setUserData(JSON.parse(storedData));
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleMessageClick = (type) => {
    let message = '';
    switch (type) {
      case 'manha':
        message = `Bom dia! Aqui é o ${userData.nome} do suporte da ${userData.empresa}, tudo bom?`;
        break;
      case 'tarde':
        message = `Boa tarde! Aqui é o ${userData.nome} do suporte da ${userData.empresa}, tudo bom?`;
        break;
      case 'noite':
        message = `Boa noite! Aqui é o ${userData.nome} do suporte da ${userData.empresa}, tudo bom?`;
        break;
      case 'duvida':
        message = 'Como posso ajudar?';
        break;
      case 'explica':
        message = 'Não consegui entender direito, poderia me explicar melhor? Se preferir pode mandar áudio.';
        break;
      case 'encerrar':
        message = 'Vou estar encerrando o chat aqui então, qualquer coisa estamos à disposição, tenha um ótimo dia! 😊';
        break;
      case 'falta':
        message = 'Notei uma falta de comunicação, vou verificar o que aconteceu.';
        break;
      case 'tecnica':
        message = 'Vou passar para nossa área técnica analisar.';
        break;
      default:
        message = 'Olá!';
    }
    navigator.clipboard.writeText(message);
    alert('Mensagem copiada para a área de transferência!');
  };

  return (
    <div className={`dashboard-container ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="gradient-bg">
        <div className="gradient-1"></div>
        <div className="gradient-2"></div>
        <div className="gradient-3"></div>
      </div>
      
      <nav className="dashboard-nav">
        <div className="nav-content">
          <button 
            onClick={() => navigate('/')}
            className="back-button"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Voltar
          </button>
          <div className="user-info">
            <span className="mr-4">Nome: {userData.nome}</span>
            <span>Empresa: {userData.empresa}</span>
          </div>
          <button
            onClick={toggleDarkMode}
            className="dark-mode-toggle"
          >
            {isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
          </button>
        </div>
      </nav>

      <main className="dashboard-main">
        <div className="message-grid">
          {[
            { type: 'manha', emoji: '🌞', text: 'Bom dia' },
            { type: 'tarde', emoji: '🌤️', text: 'Boa tarde' },
            { type: 'noite', emoji: '🌙', text: 'Boa noite' },
            { type: 'duvida', emoji: '🧐', text: 'Pergunta dúvida' },
            { type: 'explica', emoji: '🕵️', text: 'Explique melhor' },
            { type: 'encerrar', emoji: '👋', text: 'Encerramento' },
            { type: 'falta', emoji: '👩‍💼', text: 'Falta de comunicação' },
            { type: 'tecnica', emoji: '🛠️', text: 'Hora técnica' },
          ].map((item) => (
            <div
              key={item.type}
              onClick={() => handleMessageClick(item.type)}
              className="message-card"
            >
              <div className="message-content">
                <span className="message-emoji">{item.emoji}</span>
                <span className="message-text">{item.text}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
