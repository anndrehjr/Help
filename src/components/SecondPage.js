import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, Plus, ArrowLeft, Save, Info, XCircle, HelpCircle } from 'lucide-react';
import '../styles/SecondPage.css';

const SecondPage = ({ darkMode, toggleDarkMode }) => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedMessages = JSON.parse(localStorage.getItem('mensagensSalvas') || '[]');
    setMessages(savedMessages);
  }, []);

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
      .then(() => alert('Mensagem copiada para a área de transferência!'))
      .catch(err => alert('Erro ao copiar a mensagem: ' + err));
  };

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
    <div className={darkMode ? 'dark-mode' : ''}>
      <div className="barra_de_menu">
        <button onClick={() => navigate('/')} className="btn">
          <ArrowLeft />
        </button>
        <button onClick={() => setShowModal(true)} className="btn">
          <Plus /> Adicionar Quadro
        </button>
        <div className="btn-container">
          <button onClick={() => setShowModal(true)} disabled={!selectedMessage}>Editar</button>
          <button onClick={deleteMessage} disabled={!selectedMessage}>Excluir</button>
        </div>
        <button 
          onClick={toggleDarkMode} 
          className="dark-mode-toggle"
        >
          {darkMode ? <Sun /> : <Moon />}
        </button>
      </div>

      <div className="Menu-Mensagens">
        <button onClick={() => copyMessage('manha')}><Sun /> Bom Dia!</button>
        <button onClick={() => copyMessage('tarde')}><Moon /> Boa Tarde!</button>
        <button onClick={() => copyMessage('noite')}><Moon /> Boa Noite!</button>
        <button onClick={() => copyMessage('duvida')}><HelpCircle /> Pergunta Dúvida</button>
        <button onClick={() => copyMessage('explica')}><Info /> Explica Melhor</button>
        <button onClick={() => copyMessage('encerrar')}><XCircle /> Encerrar</button>
      </div>

      <div id="quadrosContainer" className="quadros-container">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`quadro ${selectedMessage === msg ? 'selected' : ''}`}
            onClick={() => {
              navigator.clipboard.writeText(msg.message);
              alert('Mensagem copiada!');
              setSelectedMessage(msg);
            }}
          >
            <strong>{msg.title}</strong>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={() => setShowModal(false)}>&times;</span>
            <input
              placeholder="Digite o título aqui..."
              maxLength={30}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <textarea
              rows={4}
              cols={30}
              placeholder="Digite sua mensagem aqui (máximo 200 caracteres)..."
              maxLength={200}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button onClick={selectedMessage ? editMessage : addNewMessage}>
              <Save /> {selectedMessage ? 'Salvar Edição' : 'Salvar Mensagem'}
            </button>
          </div>
        </div>
      )}

      <footer>© Andre Junior ~ Dev</footer>
    </div>
  );
};

export default SecondPage;

