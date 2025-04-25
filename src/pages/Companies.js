"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Plus, Edit, Trash2 } from "lucide-react"
import { useTheme } from "../contexts/ThemeContext"
import "./Companies.css"

function Companies() {
  const [companies, setCompanies] = useState([])
  const [username, setUsername] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newCompanyName, setNewCompanyName] = useState("")
  const [editingCompany, setEditingCompany] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const { isDarkMode, toggleDarkMode } = useTheme()

  useEffect(() => {
    // Verificar se o usuário está logado
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      navigate("/")
      return
    }

    setUsername(currentUser)

    // Carregar empresas do usuário
    const allCompanies = JSON.parse(localStorage.getItem("companies") || "{}")
    const userCompanies = allCompanies[currentUser] || []
    setCompanies(userCompanies)

    // Simular carregamento
    setTimeout(() => {
      setIsLoading(false)
    }, 800)
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    navigate("/")
  }

  const openAddModal = () => {
    setEditingCompany(null)
    setNewCompanyName("")
    setIsModalOpen(true)
  }

  const openEditModal = (company, e) => {
    e.stopPropagation()
    setEditingCompany(company)
    setNewCompanyName(company.name)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setNewCompanyName("")
    setEditingCompany(null)
  }

  const saveCompany = () => {
    if (!newCompanyName.trim()) return

    const allCompanies = JSON.parse(localStorage.getItem("companies") || "{}")

    if (editingCompany) {
      // Editar empresa existente
      const updatedCompanies = companies.map((company) =>
        company.id === editingCompany.id ? { ...company, name: newCompanyName } : company,
      )
      setCompanies(updatedCompanies)
      allCompanies[username] = updatedCompanies
    } else {
      // Adicionar nova empresa
      const newCompany = {
        id: Date.now(),
        name: newCompanyName,
        cards: [],
      }
      const updatedCompanies = [...companies, newCompany]
      setCompanies(updatedCompanies)
      allCompanies[username] = updatedCompanies
    }

    localStorage.setItem("companies", JSON.stringify(allCompanies))
    closeModal()
  }

  const deleteCompany = (companyId, e) => {
    e.stopPropagation()

    if (window.confirm("Tem certeza que deseja excluir esta empresa?")) {
      const updatedCompanies = companies.filter((company) => company.id !== companyId)
      setCompanies(updatedCompanies)

      const allCompanies = JSON.parse(localStorage.getItem("companies") || "{}")
      allCompanies[username] = updatedCompanies
      localStorage.setItem("companies", JSON.stringify(allCompanies))
    }
  }

  const navigateToDashboard = (company) => {
    // Salvar a empresa atual no localStorage
    localStorage.setItem("currentCompany", JSON.stringify(company))
    navigate("/dashboard")
  }

  return (
    <div className={`companies-container ${isDarkMode ? "dark" : "light"}`}>
      <div className="gradient-bg">
        <div className="gradient-1"></div>
        <div className="gradient-2"></div>
        <div className="gradient-3"></div>
      </div>

      <nav className="companies-nav">
        <div className="nav-content">
          <button onClick={handleLogout} className="back-button">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Sair
          </button>
          <div className="user-info">
            <span>Usuário: {username}</span>
          </div>
          <button onClick={toggleDarkMode} className="dark-mode-toggle">
            {isDarkMode ? "Modo Claro" : "Modo Escuro"}
          </button>
        </div>
      </nav>

      <main className="companies-main">
        <h1 className="companies-title">Minhas Empresas</h1>

        <div className={`companies-grid ${isLoading ? "loading" : "loaded"}`}>
          {companies.map((company) => (
            <div key={company.id} className="company-card" onClick={() => navigateToDashboard(company)}>
              <div className="company-content">
                <span className="company-name">{company.name}</span>
                <div className="company-info">
                  <span>{company.cards?.length || 0} cards</span>
                </div>
              </div>
              <div className="card-actions">
                <button onClick={(e) => openEditModal(company, e)} className="edit-button">
                  <Edit size={16} />
                </button>
                <button onClick={(e) => deleteCompany(company.id, e)} className="delete-button">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          <div className="company-card add-card" onClick={openAddModal}>
            <div className="company-content">
              <Plus size={24} />
              <span className="company-name">Adicionar Empresa</span>
            </div>
          </div>
        </div>
      </main>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingCompany ? "Editar Empresa" : "Nova Empresa"}</h2>
            <input
              type="text"
              placeholder="Nome da empresa"
              value={newCompanyName}
              onChange={(e) => setNewCompanyName(e.target.value)}
              autoFocus
            />
            <div className="modal-actions">
              <button onClick={closeModal}>Cancelar</button>
              <button onClick={saveCompany}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Companies
