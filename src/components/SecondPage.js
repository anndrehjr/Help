import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, ArrowLeft, Plus, Edit2, Trash2, Save } from 'lucide-react';
import { Toast } from './Toast';
import '../styles/SecondPage.css';

const SecondPage = ({ darkMode, toggleDarkMode }) => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedMessages = JSON.parse(localStorage.getItem('mensagensSalvas') || '[]');
    setMessages(savedMessages);
  }, []);

  const getGreeting = (period) => {
    switch (period) {
      case 'manha': return 'Bom dia';
      case 'tarde': return 'Boa tarde';
      case 'noite': return 'Boa noite';
      case 'duvida': return 'Como posso ajudar?';
      case 'explica': return 'Não consegui entender direito, poderia me explicar melhor? Se preferir pode mandar áudio.';
      case 'encerrar': return 'Vou estar encerrando o chat aqui então, qualquer coisa estamos à disposição, tenha um ótimo dia! 😊';
      default: return 'Olá';
    }
  };

  const copyMessage = (period) => {
    const name = localStorage.getItem('inputName');
    const company = localStorage.getItem('inputEmpresa');

    if (!name || !company) {
      alert('Por favor, preencha o nome e o nome da empresa antes de copiar a mensagem!');
      return;
    }

    const greeting = getGreeting(period);
    const message = greeting
      ? `${greeting} Aqui é o ${name} do suporte da ${company}, tudo bem?`
      : '';

    navigator.clipboard.writeText(message)
      .then(() => setShowToast(true))
      .catch(err => alert('Erro ao copiar a mensagem: ' + err));
  };

  const addNewMessage = () => {
    if (newTitle && newMessage) {
      const newMsg = { title: newTitle, message: newMessage };
      const updatedMessages = [...messages, newMsg];
      setMessages(updatedMessages);
      localStorage.setItem('mensagensSalvas', JSON.stringify(updatedMessages));
      setNewTitle('');
      setNewMessage('');
      setShowModal(false);
    } else {
      alert('Por favor, preencha o título e a mensagem!');
    }
  };

  const editMessage = () => {
    if (selectedMessage && newTitle && newMessage) {
      const updatedMessages = messages.map(msg =>
        msg === selectedMessage ? { title: newTitle, message: newMessage } : msg
      );
      setMessages(updatedMessages);
      localStorage.setItem('mensagensSalvas', JSON.stringify(updatedMessages));
      setSelectedMessage(null);
      setNewTitle('');
      setNewMessage('');
      setShowModal(false);
    }
  };

  const deleteMessage = () => {
    if (selectedMessage) {
      const updatedMessages = messages.filter(msg => msg !== selectedMessage);
      setMessages(updatedMessages);
      localStorage.setItem('mensagensSalvas', JSON.stringify(updatedMessages));
      setSelectedMessage(null);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark-mode' : ''}`}>
      <nav className="top-nav">
        <div className="nav-left">
          <button 
            onClick={() => navigate('/')} 
            className="nav-btn back-btn"
            title="Voltar para página inicial"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>Voltar</span>
          </button>
        </div>
        <div className="nav-center">
          <button 
            onClick={() => setShowModal(true)} 
            className="nav-btn action-btn add-btn"
            title="Adicionar novo quadro"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button 
            onClick={() => selectedMessage && setShowModal(true)} 
            disabled={!selectedMessage}
            className={`nav-btn action-btn edit-btn ${!selectedMessage ? 'disabled' : ''}`}
            title="Editar quadro selecionado"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={deleteMessage} 
            disabled={!selectedMessage}
            className={`nav-btn action-btn delete-btn ${!selectedMessage ? 'disabled' : ''}`}
            title="Excluir quadro selecionado"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        <div className="nav-right">
          <button 
            onClick={toggleDarkMode} 
            className="nav-btn theme-btn"
            title={darkMode ? "Modo claro" : "Modo escuro"}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      <div className="greeting-buttons">
        <button 
          onClick={() => copyMessage('manha')}
          className="greeting-btn morning"
        >
          <Sun className="greeting-icon" />
          <span>Bom dia</span>
        </button>
        <button 
          onClick={() => copyMessage('tarde')}
          className="greeting-btn afternoon"
        >
          <Moon className="greeting-icon" />
          <span>Boa tarde</span>
        </button>
        <button 
          onClick={() => copyMessage('noite')}
          className="greeting-btn night"
        >
          <Moon className="greeting-icon" />
          <span>Boa noite</span>
        </button>
      </div>

      <div id="quadrosContainer" className="quadros-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`quadro p-4 rounded shadow-lg transition-all duration-300 cursor-pointer ${
              selectedMessage === msg ? 'ring-2 ring-primary' : ''
            } ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
            onClick={() => {
              navigator.clipboard.writeText(msg.message);
              setShowToast(true);
              setSelectedMessage(msg);
            }}
          >
            <strong className="text-lg">{msg.title}</strong>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="modal-content bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <span className="close-button absolute top-2 right-2 text-2xl cursor-pointer" onClick={() => setShowModal(false)}>&times;</span>
            <input
              placeholder="Digite o título aqui..."
              maxLength={30}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full p-2 mb-4 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <textarea
              rows={4}
              placeholder="Digite sua mensagem aqui (máximo 200 caracteres)..."
              maxLength={200}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="w-full p-2 mb-4 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <button 
              onClick={selectedMessage ? editMessage : addNewMessage}
              className="w-full p-2 bg-primary text-white rounded hover:bg-primary-dark transition-all duration-300 flex items-center justify-center"
            >
              <Save className="mr-2" /> {selectedMessage ? 'Salvar Edição' : 'Salvar Mensagem'}
            </button>
          </div>
        </div>
      )}

      <Toast 
        message="Mensagem copiada com sucesso!" 
        visible={showToast} 
        onClose={() => setShowToast(false)} 
      />
    </div>
  );
};

export default SecondPage;

