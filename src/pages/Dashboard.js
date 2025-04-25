"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Plus, Edit, Trash2, Check } from "lucide-react"
import { useTheme } from "../contexts/ThemeContext"
import "./Dashboard.css"

const Toast = ({ message, onClose }) => {
  const [progress, setProgress] = useState(100)
  const duration = 3000 // 3 seconds
  const updateInterval = 10 // Update every 10ms

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress <= 0) {
          clearInterval(progressInterval)
          onClose()
          return 0
        }
        return prevProgress - (100 * updateInterval) / duration
      })
    }, updateInterval)

    return () => clearInterval(progressInterval)
  }, [onClose])

  return (
    <div className="toast-container">
      <div className="toast-content">
        <Check className="check-icon" size={20} />
        <span>{message}</span>
      </div>
      <div className="progress-bar" style={{ width: `${progress}%` }} />
    </div>
  )
}

function Dashboard() {
  const [userData, setUserData] = useState({ nome: "", empresa: "" })
  const [company, setCompany] = useState(null)
  const [customCards, setCustomCards] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  // Modificar o estado inicial para incluir categorias e cores
  const [currentCard, setCurrentCard] = useState({
    id: null,
    title: "",
    message: "",
    category: "geral",
    color: "#e53e3e",
    icon: "MessageSquare",
  })
  const [toast, setToast] = useState({ show: false, message: "" })
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const { isDarkMode, toggleDarkMode } = useTheme()

  // Adicionar este estado após os outros estados
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    // Verificar se o usuário está logado
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      navigate("/")
      return
    }

    // Verificar se há uma empresa selecionada
    const currentCompany = localStorage.getItem("currentCompany")
    if (!currentCompany) {
      navigate("/companies")
      return
    }

    const companyData = JSON.parse(currentCompany)
    setCompany(companyData)
    setUserData({ nome: currentUser, empresa: companyData.name })

    // Carregar cards da empresa
    const allCompanies = JSON.parse(localStorage.getItem("companies") || "{}")
    const userCompanies = allCompanies[currentUser] || []
    const selectedCompany = userCompanies.find((c) => c.id === companyData.id)

    if (selectedCompany) {
      setCustomCards(selectedCompany.cards || [])
    }

    // Simular carregamento
    setTimeout(() => {
      setIsLoading(false)
    }, 800)
  }, [navigate])

  // Modificar a função handleMessageClick para incrementar o contador de uso
  const handleMessageClick = (type, customMessage = null, cardId = null) => {
    let message = ""
    if (customMessage) {
      message = customMessage

      // Incrementar contador de uso se for um card personalizado
      if (cardId) {
        const updatedCards = customCards.map((card) => {
          if (card.id === cardId) {
            return { ...card, usageCount: (card.usageCount || 0) + 1 }
          }
          return card
        })

        setCustomCards(updatedCards)

        // Atualizar no localStorage
        const currentUser = localStorage.getItem("currentUser")
        const allCompanies = JSON.parse(localStorage.getItem("companies") || "{}")
        const userCompanies = allCompanies[currentUser] || []

        const updatedCompanies = userCompanies.map((c) => {
          if (c.id === company.id) {
            return { ...c, cards: updatedCards }
          }
          return c
        })

        allCompanies[currentUser] = updatedCompanies
        localStorage.setItem("companies", JSON.stringify(allCompanies))

        // Atualizar a empresa atual no localStorage
        const updatedCompany = { ...company, cards: updatedCards }
        localStorage.setItem("currentCompany", JSON.stringify(updatedCompany))
      }
    } else {
      switch (type) {
        case "manha":
          message = `Bom dia! Aqui é o ${userData.nome} do suporte da ${userData.empresa}, tudo bom?`
          break
        case "tarde":
          message = `Boa tarde! Aqui é o ${userData.nome} do suporte da ${userData.empresa}, tudo bom?`
          break
        case "noite":
          message = `Boa noite! Aqui é o ${userData.nome} do suporte da ${userData.empresa}, tudo bom?`
          break
        case "duvida":
          message = "Como posso ajudar?"
          break
        case "explica":
          message = "Não consegui entender direito, poderia me explicar melhor? Se preferir pode mandar áudio."
          break
        case "encerrar":
          message =
            "Vou estar encerrando o chat aqui então, qualquer coisa estamos à disposição, tenha um ótimo dia! 😊"
          break
        case "falta":
          message = "Notei uma falta de comunicação, vou verificar o que aconteceu."
          break
        case "tecnica":
          message = "Vou passar para nossa área técnica analisar."
          break
        default:
          message = "Olá!"
      }
    }
    navigator.clipboard.writeText(message)
    setToast({
      show: true,
      message: "Copiado com sucesso!",
    })
  }

  const openModal = (card = { id: null, title: "", message: "" }) => {
    // Garantir que o card tenha todos os campos necessários
    const completeCard = {
      id: card.id || null,
      title: card.title || "",
      message: card.message || "",
      category: card.category || "geral",
      color: card.color || "#e53e3e",
      icon: card.icon || "MessageSquare",
    }
    setCurrentCard(completeCard)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentCard({ id: null, title: "", message: "", category: "geral", color: "#e53e3e", icon: "MessageSquare" })
  }

  // Modificar a função saveCard para incluir os novos campos
  const saveCard = () => {
    if (!currentCard.title.trim() || !currentCard.message.trim()) return

    let updatedCards
    if (currentCard.id) {
      updatedCards = customCards.map((card) => (card.id === currentCard.id ? currentCard : card))
    } else {
      updatedCards = [
        ...customCards,
        {
          ...currentCard,
          id: Date.now(),
          favorite: false,
          usageCount: 0,
        },
      ]
    }
    setCustomCards(updatedCards)

    // Atualizar no localStorage
    const currentUser = localStorage.getItem("currentUser")
    const allCompanies = JSON.parse(localStorage.getItem("companies") || "{}")
    const userCompanies = allCompanies[currentUser] || []

    const updatedCompanies = userCompanies.map((c) => {
      if (c.id === company.id) {
        return { ...c, cards: updatedCards }
      }
      return c
    })

    allCompanies[currentUser] = updatedCompanies
    localStorage.setItem("companies", JSON.stringify(allCompanies))

    // Atualizar a empresa atual no localStorage
    const updatedCompany = { ...company, cards: updatedCards }
    localStorage.setItem("currentCompany", JSON.stringify(updatedCompany))

    closeModal()
  }

  const deleteCard = (id, e) => {
    e.stopPropagation()

    if (window.confirm("Tem certeza que deseja excluir este card?")) {
      const updatedCards = customCards.filter((card) => card.id !== id)
      setCustomCards(updatedCards)

      // Atualizar no localStorage
      const currentUser = localStorage.getItem("currentUser")
      const allCompanies = JSON.parse(localStorage.getItem("companies") || "{}")
      const userCompanies = allCompanies[currentUser] || []

      const updatedCompanies = userCompanies.map((c) => {
        if (c.id === company.id) {
          return { ...c, cards: updatedCards }
        }
        return c
      })

      allCompanies[currentUser] = updatedCompanies
      localStorage.setItem("companies", JSON.stringify(allCompanies))

      // Atualizar a empresa atual no localStorage
      const updatedCompany = { ...company, cards: updatedCards }
      localStorage.setItem("currentCompany", JSON.stringify(updatedCompany))
    }
  }

  // Adicionar esta função após a função deleteCard
  const toggleFavorite = (id, e) => {
    e.stopPropagation()

    const updatedCards = customCards.map((card) => {
      if (card.id === id) {
        return { ...card, favorite: !card.favorite }
      }
      return card
    })

    setCustomCards(updatedCards)

    // Atualizar no localStorage
    const currentUser = localStorage.getItem("currentUser")
    const allCompanies = JSON.parse(localStorage.getItem("companies") || "{}")
    const userCompanies = allCompanies[currentUser] || []

    const updatedCompanies = userCompanies.map((c) => {
      if (c.id === company.id) {
        return { ...c, cards: updatedCards }
      }
      return c
    })

    allCompanies[currentUser] = updatedCompanies
    localStorage.setItem("companies", JSON.stringify(allCompanies))

    // Atualizar a empresa atual no localStorage
    const updatedCompany = { ...company, cards: updatedCards }
    localStorage.setItem("currentCompany", JSON.stringify(updatedCompany))
  }

  // Adicionar esta função após toggleFavorite
  const filterCards = (category) => {
    if (category === "all") {
      return customCards
    }
    return customCards.filter((card) => card.category === category)
  }

  // Adicionar estas constantes antes do array defaultCards
  const categories = [
    { id: "all", name: "Todos" },
    { id: "geral", name: "Geral" },
    { id: "saudacao", name: "Saudações" },
    { id: "suporte", name: "Suporte" },
    { id: "encerramento", name: "Encerramento" },
  ]

  const icons = [
    "MessageSquare",
    "Mail",
    "Heart",
    "Star",
    "Bell",
    "AlertCircle",
    "CheckCircle",
    "HelpCircle",
    "Info",
    "Settings",
    "User",
    "Users",
  ]

  // Atualizar o array defaultCards para incluir categorias
  const defaultCards = [
    {
      type: "manha",
      emoji: "🌞",
      title: "Bom dia",
      category: "saudacao",
      message: `Bom dia! Aqui é o ${userData.nome} do suporte da ${userData.empresa}, tudo bom?`,
    },
    {
      type: "tarde",
      emoji: "🌤️",
      title: "Boa tarde",
      category: "saudacao",
      message: `Boa tarde! Aqui é o ${userData.nome} do suporte da ${userData.empresa}, tudo bom?`,
    },
    {
      type: "noite",
      emoji: "🌙",
      title: "Boa noite",
      category: "saudacao",
      message: `Boa noite! Aqui é o ${userData.nome} do suporte da ${userData.empresa}, tudo bom?`,
    },
    {
      type: "duvida",
      emoji: "🧐",
      title: "Pergunta dúvida",
      category: "suporte",
      message: "Como posso ajudar?",
    },
    {
      type: "explica",
      emoji: "🕵️",
      title: "Explique melhor",
      category: "suporte",
      message: "Não consegui entender direito, poderia me explicar melhor? Se preferir pode mandar áudio.",
    },
    {
      type: "encerrar",
      emoji: "👋",
      title: "Encerramento",
      category: "encerramento",
      message: "Vou estar encerrando o chat aqui então, qualquer coisa estamos à disposição, tenha um ótimo dia! 😊",
    },
    {
      type: "falta",
      emoji: "👩‍💼",
      title: "Falta de comunicação",
      category: "suporte",
      message: "Notei uma falta de comunicação, vou verificar o que aconteceu.",
    },
    {
      type: "tecnica",
      emoji: "🛠️",
      title: "Hora técnica",
      category: "suporte",
      message: "Vou passar para nossa área técnica analisar.",
    },
  ]

  // Adicionar esta função para filtrar cards por pesquisa
  const getFilteredCards = () => {
    let filtered = customCards

    // Filtrar por categoria
    if (activeCategory !== "all") {
      filtered = filtered.filter((card) => card.category === activeCategory)
    }

    // Filtrar por termo de pesquisa
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (card) => card.title.toLowerCase().includes(term) || card.message.toLowerCase().includes(term),
      )
    }

    return filtered
  }

  // Substituir a renderização do main no return para incluir categorias e pesquisa
  return (
    <div className={`dashboard-container ${isDarkMode ? "dark" : "light"}`}>
      <div className="gradient-bg">
        <div className="gradient-1"></div>
        <div className="gradient-2"></div>
        <div className="gradient-3"></div>
      </div>

      <nav className="dashboard-nav">
        <div className="nav-content">
          <button onClick={() => navigate("/companies")} className="back-button">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Voltar para Empresas
          </button>
          <div className="user-info">
            <span className="mr-4">Usuário: {userData.nome}</span>
            <span>Empresa: {userData.empresa}</span>
          </div>
          <button onClick={toggleDarkMode} className="dark-mode-toggle">
            {isDarkMode ? "Modo Claro" : "Modo Escuro"}
          </button>
        </div>
      </nav>

      <main className="dashboard-main">
        <h1 className="dashboard-title">Cards de Mensagens - {userData.empresa}</h1>

        <div className="dashboard-tools">
          <div className="search-container">
            <input
              type="text"
              placeholder="Pesquisar cards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="categories-container">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-button ${activeCategory === category.id ? "active" : ""}`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="section-title">
          <h2>Cards Padrão</h2>
        </div>
        <div className={`message-grid ${isLoading ? "loading" : "loaded"}`}>
          {defaultCards
            .filter((card) => activeCategory === "all" || card.category === activeCategory)
            .map((card) => (
              <div
                key={card.type}
                onClick={() => handleMessageClick(card.type)}
                className={`message-card default-card ${card.category}`}
              >
                <div className="message-content">
                  <span className="message-emoji">{card.emoji}</span>
                  <span className="message-text">{card.title}</span>
                  <span className="message-category">{categories.find((c) => c.id === card.category)?.name}</span>
                </div>
              </div>
            ))}
        </div>

        <div className="section-title">
          <h2>Cards Personalizados</h2>
        </div>
        <div className={`message-grid ${isLoading ? "loading" : "loaded"}`}>
          {getFilteredCards().map((card) => (
            <div
              key={card.id}
              className={`message-card custom-card ${card.favorite ? "favorite" : ""}`}
              style={{
                borderTop: `3px solid ${card.color || "#e53e3e"}`,
                background: `linear-gradient(to bottom, ${card.color}10, transparent)`,
              }}
            >
              <div className="message-content" onClick={() => handleMessageClick("custom", card.message, card.id)}>
                <div className="card-header">
                  <span className="message-text">{card.title}</span>
                  {card.favorite && <span className="favorite-badge">★</span>}
                </div>
                <div className="message-preview">{card.message.substring(0, 50)}...</div>
                <div className="card-footer">
                  <span className="message-category">
                    {categories.find((c) => c.id === card.category)?.name || "Geral"}
                  </span>
                  {card.usageCount > 0 && <span className="usage-count">Usado: {card.usageCount}x</span>}
                </div>
              </div>
              <div className="card-actions">
                <button
                  onClick={(e) => toggleFavorite(card.id, e)}
                  className={`favorite-button ${card.favorite ? "active" : ""}`}
                >
                  {card.favorite ? "★" : "☆"}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    openModal(card)
                  }}
                  className="edit-button"
                >
                  <Edit size={16} />
                </button>
                <button onClick={(e) => deleteCard(card.id, e)} className="delete-button">
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
          <div className="modal card-modal">
            <h2>{currentCard.id ? "Editar Card" : "Novo Card"}</h2>

            <div className="form-group">
              <label>Título</label>
              <input
                type="text"
                placeholder="Título"
                value={currentCard.title}
                onChange={(e) => setCurrentCard({ ...currentCard, title: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Mensagem</label>
              <textarea
                placeholder="Mensagem"
                value={currentCard.message}
                onChange={(e) => setCurrentCard({ ...currentCard, message: e.target.value })}
                rows={4}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Categoria</label>
                <select
                  value={currentCard.category}
                  onChange={(e) => setCurrentCard({ ...currentCard, category: e.target.value })}
                >
                  {categories
                    .filter((c) => c.id !== "all")
                    .map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="form-group">
                <label>Cor</label>
                <input
                  type="color"
                  value={currentCard.color || "#e53e3e"}
                  onChange={(e) => setCurrentCard({ ...currentCard, color: e.target.value })}
                  className="color-picker"
                />
              </div>
            </div>

            <div className="modal-actions">
              <button onClick={closeModal}>Cancelar</button>
              <button onClick={saveCard}>Salvar</button>
            </div>
          </div>
        </div>
      )}

      <div className="toast-list">
        {toast.show && <Toast message={toast.message} onClose={() => setToast({ ...toast, show: false })} />}
      </div>
    </div>
  )
}

export default Dashboard
