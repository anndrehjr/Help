"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Edit, Trash2 } from "lucide-react"
import { useTheme } from "../contexts/ThemeContext"
import Navbar from "../components/Navbar"
import Toast from "../components/Toast"
import "./Dashboard.css"

function Dashboard() {
  const [userData, setUserData] = useState({ nome: "", empresa: "" })
  const [company, setCompany] = useState(null)
  const [customCards, setCustomCards] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMultiCompanyModalOpen, setIsMultiCompanyModalOpen] = useState(false)
  const [currentCard, setCurrentCard] = useState({
    id: null,
    title: "",
    message: "",
    category: "geral",
    color: "#8b5cf6",
    icon: "MessageSquare",
    multiCompany: false,
    companies: [],
  })
  const [toast, setToast] = useState({ show: false, message: "" })
  const [isLoading, setIsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false, cardId: null })
  const [userCompanies, setUserCompanies] = useState([])
  const [selectedCompanies, setSelectedCompanies] = useState([])
  const navigate = useNavigate()
  const { isDarkMode } = useTheme()

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

    // Carregar todas as empresas do usuário
    const allCompanies = JSON.parse(localStorage.getItem("companies") || "{}")
    const companies = allCompanies[currentUser] || []
    setUserCompanies(companies)

    // Carregar cards da empresa atual
    const selectedCompany = companies.find((c) => c.id === companyData.id)
    if (selectedCompany) {
      // Carregar cards específicos da empresa
      const companyCards = selectedCompany.cards || []

      // Carregar cards multi-empresa
      const multiCompanyCards = []
      companies.forEach((comp) => {
        if (comp.id !== companyData.id) {
          const multiCards = (comp.cards || []).filter(
            (card) => card.multiCompany && card.companies.includes(companyData.id),
          )
          multiCompanyCards.push(...multiCards)
        }
      })

      // Combinar cards específicos e multi-empresa
      setCustomCards([...companyCards, ...multiCompanyCards])
    }

    // Simular carregamento
    setTimeout(() => {
      setIsLoading(false)
    }, 800)
  }, [navigate])

  const changeCompany = (companyId) => {
    const selectedCompany = userCompanies.find((c) => c.id === Number.parseInt(companyId))
    if (selectedCompany) {
      // Atualizar a empresa atual no localStorage
      localStorage.setItem("currentCompany", JSON.stringify(selectedCompany))
      setCompany(selectedCompany)
      setUserData((prev) => ({ ...prev, empresa: selectedCompany.name }))

      // Carregar cards da nova empresa selecionada
      const companyCards = selectedCompany.cards || []

      // Carregar cards multi-empresa
      const multiCompanyCards = []
      userCompanies.forEach((comp) => {
        if (comp.id !== selectedCompany.id) {
          const multiCards = (comp.cards || []).filter(
            (card) => card.multiCompany && card.companies.includes(selectedCompany.id),
          )
          multiCompanyCards.push(...multiCards)
        }
      })

      // Combinar cards específicos e multi-empresa
      setCustomCards([...companyCards, ...multiCompanyCards])
    }
  }

  const processMessageVariables = (message) => {
    // Substituir variáveis no texto
    return message.replace(/\{nome\}/g, userData.nome).replace(/\{empresa\}/g, userData.empresa)
  }

  const handleMessageClick = (type, customMessage = null, cardId = null) => {
    let message = ""
    if (customMessage) {
      message = processMessageVariables(customMessage)

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
        updateCardUsageCount(cardId)
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
          message = `Boa noite! Aqui �� o ${userData.nome} do suporte da ${userData.empresa}, tudo bom?`
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

  const updateCardUsageCount = (cardId) => {
    const currentUser = localStorage.getItem("currentUser")
    const allCompanies = JSON.parse(localStorage.getItem("companies") || "{}")
    const userCompanies = allCompanies[currentUser] || []

    // Encontrar o card em todas as empresas
    let cardUpdated = false

    const updatedCompanies = userCompanies.map((comp) => {
      const updatedCards = (comp.cards || []).map((card) => {
        if (card.id === cardId) {
          cardUpdated = true
          return { ...card, usageCount: (card.usageCount || 0) + 1 }
        }
        return card
      })

      return { ...comp, cards: updatedCards }
    })

    if (cardUpdated) {
      allCompanies[currentUser] = updatedCompanies
      localStorage.setItem("companies", JSON.stringify(allCompanies))

      // Atualizar a empresa atual no localStorage
      const updatedCompany = updatedCompanies.find((c) => c.id === company.id)
      if (updatedCompany) {
        localStorage.setItem("currentCompany", JSON.stringify(updatedCompany))
      }
    }
  }

  const openModal = (card = null) => {
    if (card) {
      // Editar card existente
      setCurrentCard({
        id: card.id || null,
        title: card.title || "",
        message: card.message || "",
        category: card.category || "geral",
        color: card.color || "#8b5cf6",
        icon: card.icon || "MessageSquare",
        multiCompany: card.multiCompany || false,
        companies: card.companies || [],
      })
    } else {
      // Novo card
      setCurrentCard({
        id: null,
        title: "",
        message: "",
        category: "geral",
        color: "#8b5cf6",
        icon: "MessageSquare",
        multiCompany: false,
        companies: [],
      })
    }
    setIsModalOpen(true)
  }

  const openMultiCompanyModal = () => {
    setCurrentCard({
      id: null,
      title: "",
      message: "",
      category: "geral",
      color: "#8b5cf6",
      icon: "MessageSquare",
      multiCompany: true,
      companies: [company.id],
    })
    setSelectedCompanies([company.id])
    setIsMultiCompanyModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentCard({
      id: null,
      title: "",
      message: "",
      category: "geral",
      color: "#8b5cf6",
      icon: "MessageSquare",
      multiCompany: false,
      companies: [],
    })
  }

  const closeMultiCompanyModal = () => {
    setIsMultiCompanyModalOpen(false)
    setSelectedCompanies([])
    setCurrentCard({
      id: null,
      title: "",
      message: "",
      category: "geral",
      color: "#8b5cf6",
      icon: "MessageSquare",
      multiCompany: false,
      companies: [],
    })
  }

  const saveCard = () => {
    if (!currentCard.title.trim() || !currentCard.message.trim()) return

    const currentUser = localStorage.getItem("currentUser")
    const allCompanies = JSON.parse(localStorage.getItem("companies") || "{}")
    const userCompanies = allCompanies[currentUser] || []

    // Criar o novo card com todos os campos necessários
    const cardToSave = {
      ...currentCard,
      id: currentCard.id || Date.now(),
      favorite: currentCard.favorite || false,
      usageCount: currentCard.usageCount || 0,
      multiCompany: false,
      companies: [],
    }

    // Atualizar os cards da empresa atual
    const updatedCompanies = userCompanies.map((comp) => {
      if (comp.id === company.id) {
        let updatedCards
        if (currentCard.id) {
          // Editar card existente
          updatedCards = (comp.cards || []).map((card) => (card.id === currentCard.id ? cardToSave : card))
        } else {
          // Adicionar novo card
          updatedCards = [...(comp.cards || []), cardToSave]
        }
        return { ...comp, cards: updatedCards }
      }
      return comp
    })

    // Atualizar no localStorage
    allCompanies[currentUser] = updatedCompanies
    localStorage.setItem("companies", JSON.stringify(allCompanies))

    // Atualizar a empresa atual no localStorage
    const updatedCompany = updatedCompanies.find((c) => c.id === company.id)
    localStorage.setItem("currentCompany", JSON.stringify(updatedCompany))
    setCompany(updatedCompany)

    // Atualizar os cards na interface
    const companyCards = updatedCompany.cards || []

    // Carregar cards multi-empresa
    const multiCompanyCards = []
    updatedCompanies.forEach((comp) => {
      if (comp.id !== company.id) {
        const multiCards = (comp.cards || []).filter((card) => card.multiCompany && card.companies.includes(company.id))
        multiCompanyCards.push(...multiCards)
      }
    })

    setCustomCards([...companyCards, ...multiCompanyCards])
    closeModal()

    setToast({
      show: true,
      message: currentCard.id ? "Card atualizado com sucesso!" : "Card adicionado com sucesso!",
    })
  }

  const saveMultiCompanyCard = () => {
    if (!currentCard.title.trim() || !currentCard.message.trim() || selectedCompanies.length === 0) return

    const currentUser = localStorage.getItem("currentUser")
    const allCompanies = JSON.parse(localStorage.getItem("companies") || "{}")
    const userCompanies = allCompanies[currentUser] || []

    // Criar o card multi-empresa
    const cardToSave = {
      ...currentCard,
      id: Date.now(),
      favorite: false,
      usageCount: 0,
      multiCompany: true,
      companies: selectedCompanies,
    }

    // Determinar em qual empresa salvar o card
    // Vamos salvar na primeira empresa selecionada
    const primaryCompanyId = selectedCompanies[0]

    // Atualizar as empresas
    const updatedCompanies = userCompanies.map((comp) => {
      if (comp.id === primaryCompanyId) {
        // Adicionar o card multi-empresa à primeira empresa selecionada
        const updatedCards = [...(comp.cards || []), cardToSave]
        return { ...comp, cards: updatedCards }
      }
      return comp
    })

    // Atualizar no localStorage
    allCompanies[currentUser] = updatedCompanies
    localStorage.setItem("companies", JSON.stringify(allCompanies))

    // Atualizar a empresa atual no localStorage se necessário
    if (primaryCompanyId === company.id) {
      const updatedCompany = updatedCompanies.find((c) => c.id === company.id)
      localStorage.setItem("currentCompany", JSON.stringify(updatedCompany))
      setCompany(updatedCompany)
    }

    // Recarregar os cards na interface
    const updatedCurrentCompany = updatedCompanies.find((c) => c.id === company.id)
    const companyCards = updatedCurrentCompany.cards || []

    // Carregar cards multi-empresa
    const multiCompanyCards = []
    updatedCompanies.forEach((comp) => {
      if (comp.id !== company.id) {
        const multiCards = (comp.cards || []).filter((card) => card.multiCompany && card.companies.includes(company.id))
        multiCompanyCards.push(...multiCards)
      }
    })

    setCustomCards([...companyCards, ...multiCompanyCards])
    closeMultiCompanyModal()

    setToast({
      show: true,
      message: "Card multi-empresa adicionado com sucesso!",
    })
  }

  const deleteCard = (id, e) => {
    e.stopPropagation()
    setDeleteConfirmation({ show: true, cardId: id })
  }

  const confirmDelete = () => {
    const id = deleteConfirmation.cardId

    // Encontrar o card para verificar se é multi-empresa
    const cardToDelete = customCards.find((card) => card.id === id)
    if (!cardToDelete) {
      setDeleteConfirmation({ show: false, cardId: null })
      return
    }

    const currentUser = localStorage.getItem("currentUser")
    const allCompanies = JSON.parse(localStorage.getItem("companies") || "{}")
    const userCompanies = allCompanies[currentUser] || []

    // Se for um card multi-empresa, precisamos removê-lo da empresa onde está armazenado
    if (cardToDelete.multiCompany) {
      // Encontrar a empresa que contém o card
      const ownerCompanyIndex = userCompanies.findIndex(
        (comp) => comp.cards && comp.cards.some((card) => card.id === id && card.multiCompany),
      )

      if (ownerCompanyIndex !== -1) {
        // Remover o card da empresa proprietária
        const updatedCompanies = [...userCompanies]
        updatedCompanies[ownerCompanyIndex] = {
          ...updatedCompanies[ownerCompanyIndex],
          cards: updatedCompanies[ownerCompanyIndex].cards.filter((card) => card.id !== id),
        }

        allCompanies[currentUser] = updatedCompanies
        localStorage.setItem("companies", JSON.stringify(allCompanies))
      }
    } else {
      // Card normal, remover apenas da empresa atual
      const updatedCompanies = userCompanies.map((comp) => {
        if (comp.id === company.id) {
          return {
            ...comp,
            cards: (comp.cards || []).filter((card) => card.id !== id),
          }
        }
        return comp
      })

      allCompanies[currentUser] = updatedCompanies
      localStorage.setItem("companies", JSON.stringify(allCompanies))

      // Atualizar a empresa atual no localStorage
      const updatedCompany = updatedCompanies.find((c) => c.id === company.id)
      localStorage.setItem("currentCompany", JSON.stringify(updatedCompany))
      setCompany(updatedCompany)
    }

    // Atualizar os cards na interface
    setCustomCards(customCards.filter((card) => card.id !== id))

    // Fechar o modal de confirmação
    setDeleteConfirmation({ show: false, cardId: null })

    // Mostrar toast de confirmação
    setToast({
      show: true,
      message: "Card excluído com sucesso!",
    })
  }

  const cancelDelete = () => {
    setDeleteConfirmation({ show: false, cardId: null })
  }

  const toggleFavorite = (id, e) => {
    e.stopPropagation()

    // Encontrar o card para verificar se é multi-empresa
    const cardToToggle = customCards.find((card) => card.id === id)
    if (!cardToToggle) return

    const currentUser = localStorage.getItem("currentUser")
    const allCompanies = JSON.parse(localStorage.getItem("companies") || "{}")
    const userCompanies = allCompanies[currentUser] || []

    if (cardToToggle.multiCompany) {
      // Encontrar a empresa que contém o card
      const ownerCompanyIndex = userCompanies.findIndex(
        (comp) => comp.cards && comp.cards.some((card) => card.id === id && card.multiCompany),
      )

      if (ownerCompanyIndex !== -1) {
        // Atualizar o favorito no card da empresa proprietária
        const updatedCompanies = [...userCompanies]
        updatedCompanies[ownerCompanyIndex] = {
          ...updatedCompanies[ownerCompanyIndex],
          cards: updatedCompanies[ownerCompanyIndex].cards.map((card) =>
            card.id === id ? { ...card, favorite: !card.favorite } : card,
          ),
        }

        allCompanies[currentUser] = updatedCompanies
        localStorage.setItem("companies", JSON.stringify(allCompanies))
      }
    } else {
      // Card normal, atualizar apenas na empresa atual
      const updatedCompanies = userCompanies.map((comp) => {
        if (comp.id === company.id) {
          return {
            ...comp,
            cards: (comp.cards || []).map((card) => (card.id === id ? { ...card, favorite: !card.favorite } : card)),
          }
        }
        return comp
      })

      allCompanies[currentUser] = updatedCompanies
      localStorage.setItem("companies", JSON.stringify(allCompanies))

      // Atualizar a empresa atual no localStorage
      const updatedCompany = updatedCompanies.find((c) => c.id === company.id)
      localStorage.setItem("currentCompany", JSON.stringify(updatedCompany))
      setCompany(updatedCompany)
    }

    // Atualizar os cards na interface
    setCustomCards(customCards.map((card) => (card.id === id ? { ...card, favorite: !card.favorite } : card)))
  }

  const handleCompanySelection = (companyId) => {
    const id = Number(companyId)
    if (selectedCompanies.includes(id)) {
      setSelectedCompanies(selectedCompanies.filter((cid) => cid !== id))
    } else {
      setSelectedCompanies([...selectedCompanies, id])
    }
  }

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

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Tecla ESC (código ASCII 27)
      if (e.keyCode === 27) {
        if (isModalOpen) {
          closeModal()
        }
        if (isMultiCompanyModalOpen) {
          closeMultiCompanyModal()
        }
        if (deleteConfirmation.show) {
          cancelDelete()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isModalOpen, isMultiCompanyModalOpen, deleteConfirmation.show])

  const categories = [
    { id: "all", name: "Todos" },
    { id: "geral", name: "Geral" },
    { id: "saudacao", name: "Saudações" },
    { id: "suporte", name: "Suporte" },
    { id: "encerramento", name: "Encerramento" },
  ]

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

  return (
    <div className={`dashboard-container ${isDarkMode ? "dark" : "light"}`}>
      <div className="gradient-bg">
        <div className="gradient-1"></div>
        <div className="gradient-2"></div>
        <div className="gradient-3"></div>
      </div>

      <Navbar
        title={`Cards de Mensagens - ${userData.empresa}`}
        userData={userData}
        userCompanies={userCompanies}
        currentCompany={company}
        onCompanyChange={changeCompany}
      />

      <main className="dashboard-main">
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

          <div className="card-actions-container">
            <button onClick={openMultiCompanyModal} className="multi-company-button">
              Criar Card Multi-Empresa
            </button>
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
              className={`message-card custom-card ${card.favorite ? "favorite" : ""} ${card.multiCompany ? "multi-company" : ""}`}
              style={{
                borderTop: `3px solid ${card.color || "#8b5cf6"}`,
                background: `linear-gradient(to bottom, ${card.color}10, transparent)`,
              }}
            >
              <div className="message-content" onClick={() => handleMessageClick("custom", card.message, card.id)}>
                <div className="card-header">
                  <span className="message-text">{card.title}</span>
                  {card.favorite && <span className="favorite-badge">★</span>}
                  {card.multiCompany && <span className="multi-company-badge">🔄</span>}
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
              <label>
                Título <span className="char-count">{currentCard.title.length}/20</span>
              </label>
              <input
                type="text"
                placeholder="Título"
                value={currentCard.title}
                onChange={(e) => {
                  if (e.target.value.length <= 20) {
                    setCurrentCard({ ...currentCard, title: e.target.value })
                  }
                }}
                maxLength={20}
              />
            </div>

            <div className="form-group">
              <label>
                Mensagem <span className="char-count">{currentCard.message.length}/500</span>
              </label>
              <textarea
                placeholder="Mensagem (use {nome} e {empresa} como variáveis)"
                value={currentCard.message}
                onChange={(e) => {
                  if (e.target.value.length <= 500) {
                    setCurrentCard({ ...currentCard, message: e.target.value })
                  }
                }}
                maxLength={500}
                rows={4}
              />
              <div className="variables-help">
                Variáveis disponíveis: {"{nome}"} - Nome do usuário, {"{empresa}"} - Nome da empresa
              </div>
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
                  value={currentCard.color || "#8b5cf6"}
                  onChange={(e) => setCurrentCard({ ...currentCard, color: e.target.value })}
                  className="color-picker"
                />
              </div>
            </div>

            <div className="modal-actions">
              <button onClick={closeModal}>Cancelar</button>
              <button onClick={saveCard}>Salvar</button>
            </div>
            <div className="modal-tip">Pressione ESC para cancelar</div>
          </div>
        </div>
      )}

      {isMultiCompanyModalOpen && (
        <div className="modal-overlay">
          <div className="modal card-modal">
            <h2>Criar Card Multi-Empresa</h2>

            <div className="form-group">
              <label>
                Título <span className="char-count">{currentCard.title.length}/20</span>
              </label>
              <input
                type="text"
                placeholder="Título"
                value={currentCard.title}
                onChange={(e) => {
                  if (e.target.value.length <= 20) {
                    setCurrentCard({ ...currentCard, title: e.target.value })
                  }
                }}
                maxLength={20}
              />
            </div>

            <div className="form-group">
              <label>
                Mensagem <span className="char-count">{currentCard.message.length}/500</span>
              </label>
              <textarea
                placeholder="Mensagem (use {nome} e {empresa} como variáveis)"
                value={currentCard.message}
                onChange={(e) => {
                  if (e.target.value.length <= 500) {
                    setCurrentCard({ ...currentCard, message: e.target.value })
                  }
                }}
                maxLength={500}
                rows={4}
              />
              <div className="variables-help">
                Variáveis disponíveis: {"{nome}"} - Nome do usuário, {"{empresa}"} - Nome da empresa
              </div>
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
                  value={currentCard.color || "#8b5cf6"}
                  onChange={(e) => setCurrentCard({ ...currentCard, color: e.target.value })}
                  className="color-picker"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Selecione as empresas</label>
              <div className="companies-checkbox-list">
                {userCompanies.map((comp) => (
                  <div key={comp.id} className="company-checkbox">
                    <input
                      type="checkbox"
                      id={`company-${comp.id}`}
                      checked={selectedCompanies.includes(comp.id)}
                      onChange={() => handleCompanySelection(comp.id)}
                    />
                    <label htmlFor={`company-${comp.id}`}>{comp.name}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-actions">
              <button onClick={closeMultiCompanyModal}>Cancelar</button>
              <button onClick={saveMultiCompanyCard} disabled={selectedCompanies.length === 0}>
                Salvar
              </button>
            </div>
            <div className="modal-tip">Pressione ESC para cancelar</div>
          </div>
        </div>
      )}

      {deleteConfirmation.show && (
        <div className="modal-overlay" onClick={cancelDelete}>
          <div className="modal delete-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Excluir Card</h2>
            <p>Tem certeza que deseja excluir este card?</p>
            <div className="modal-actions">
              <button onClick={cancelDelete}>Cancelar</button>
              <button onClick={confirmDelete} className="delete-confirm-button">
                Excluir
              </button>
            </div>
            <div className="modal-tip">Pressione ESC para cancelar</div>
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
