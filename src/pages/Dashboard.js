import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Check } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import './Dashboard.css';

const Toast = ({ message, onClose }) => {
  const [progress, setProgress] = useState(100);
  const duration = 3000; // 3 seconds
  const updateInterval = 10; // Update every 10ms

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress <= 0) {
          clearInterval(progressInterval);
          onClose();
          return 0;
        }
        return prevProgress - (100 * updateInterval / duration);
      });
    }, updateInterval);

    return () => clearInterval(progressInterval);
  }, [onClose]);

  return (
    <div className="toast-container">
      <div className="toast-content">
        <Check className="check-icon" size={20} />
        <span>{message}</span>
      </div>
      <div className="progress-bar" style={{ width: `${progress}%` }} />
    </div>
  );
};

function Dashboard() {
  const [userData, setUserData] = useState({ nome: '', empresa: '' });
  const [customCards, setCustomCards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCard, setCurrentCard] = useState({ id: null, title: '', message: '' });
  const [toast, setToast] = useState({ show: false, message: '' });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useTheme();

  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    const storedCards = localStorage.getItem('customCards');
    if (storedData) {
      setUserData(JSON.parse(storedData));
    } else {
      navigate('/');
    }
    if (storedCards) {
      setCustomCards(JSON.parse(storedCards));
    }
    
    // Simula um tempo de carregamento
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
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
    setToast({
      show: true,
      message: 'Laudo copiado com sucesso!'
    });
  };

  const openModal = (card = { id: null, title: '', message: '' }) => {
    setCurrentCard(card);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentCard({ id: null, title: '', message: '' });
  };

  const saveCard = () => {
    let updatedCards;
    if (currentCard.id) {
      updatedCards = customCards.map(card => 
        card.id === currentCard.id ? currentCard : card
      );
    } else {
      updatedCards = [...customCards, { ...currentCard, id: Date.now() }];
    }
    setCustomCards(updatedCards);
    localStorage.setItem('customCards', JSON.stringify(updatedCards));
    closeModal();
  };

  const deleteCard = (id) => {
    const updatedCards = customCards.filter(card => card.id !== id);
    setCustomCards(updatedCards);
    localStorage.setItem('customCards', JSON.stringify(updatedCards));
  };

  const defaultCards = [
    { type: 'manha', emoji: '🌞', title: 'Bom dia', message: `Bom dia! Aqui é o ${userData.nome} do suporte da ${userData.empresa}, tudo bom?` },
    { type: 'tarde', emoji: '🌤️', title: 'Boa tarde', message: `Boa tarde! Aqui é o ${userData.nome} do suporte da ${userData.empresa}, tudo bom?` },
    { type: 'noite', emoji: '🌙', title: 'Boa noite', message: `Boa noite! Aqui é o ${userData.nome} do suporte da ${userData.empresa}, tudo bom?` },
    { type: 'duvida', emoji: '🧐', title: 'Pergunta dúvida', message: 'Como posso ajudar?' },
    { type: 'explica', emoji: '🕵️', title: 'Explique melhor', message: 'Não consegui entender direito, poderia me explicar melhor? Se preferir pode mandar áudio.' },
    { type: 'encerrar', emoji: '👋', title: 'Encerramento', message: 'Vou estar encerrando o chat aqui então, qualquer coisa estamos à disposição, tenha um ótimo dia! 😊' },
    { type: 'falta', emoji: '👩‍💼', title: 'Falta de comunicação', message: 'Notei uma falta de comunicação, vou verificar o que aconteceu.' },
    { type: 'tecnica', emoji: '🛠️', title: 'Hora técnica', message: 'Vou passar para nossa área técnica analisar.' },
  ];

  return (
    <div className={`dashboard-container ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="gradient-bg">
        <div className="gradient-1"></div>
        <div className="gradient-2"></div>
        <div className="gradient-3"></div>
      </div>
      
      <nav className="dashboard-nav">
        <div className="nav-content">
          <button onClick={() => navigate('/')} className="back-button">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Voltar
          </button>
          <div className="user-info">
            <span className="mr-4">Nome: {userData.nome}</span>
            <span>Empresa: {userData.empresa}</span>
          </div>
          <button onClick={toggleDarkMode} className="dark-mode-toggle">
            {isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
          </button>
        </div>
      </nav>

      <main className="dashboard-main">
        <div className={`message-grid ${isLoading ? 'loading' : 'loaded'}`}>
          {defaultCards.map((card) => (
            <div
              key={card.type}
              onClick={() => handleMessageClick(card.type)}
              className="message-card"
            >
              <div className="message-content">
                <span className="message-emoji">{card.emoji}</span>
                <span className="message-text">{card.title}</span>
              </div>
            </div>
          ))}
          {customCards.map((card) => (
            <div key={card.id} className="message-card custom-card">
              <div className="message-content" onClick={() => handleMessageClick(card.type)}>
                <span className="message-text">{card.title}</span>
              </div>
              <div className="card-actions">
                <button onClick={() => openModal(card)} className="edit-button">
                  <Edit size={16} />
                </button>
                <button onClick={() => deleteCard(card.id)} className="delete-button">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          <div className="message-card add-card" onClick={() => openModal()}>
            <div className="message-content">
              <Plus size={24} />
              <span className="message-text">Adicionar Novo</span>
            </div>
          </div>
        </div>
      </main>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{currentCard.id ? 'Editar Quadro' : 'Novo Quadro'}</h2>
            <input
              type="text"
              placeholder="Título"
              value={currentCard.title}
              onChange={(e) => setCurrentCard({...currentCard, title: e.target.value})}
            />
            <textarea
              placeholder="Mensagem"
              value={currentCard.message}
              onChange={(e) => setCurrentCard({...currentCard, message: e.target.value})}
            />
            <div className="modal-actions">
              <button onClick={closeModal}>Cancelar</button>
              <button onClick={saveCard}>Salvar</button>
            </div>
          </div>
        </div>
      )}

      <div className="toast-list">
        {toast.show && (
          <Toast
            message={toast.message}
            onClose={() => setToast({ ...toast, show: false })}
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;

