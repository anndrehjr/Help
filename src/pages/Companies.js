"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Edit, Trash2, Building2 } from "lucide-react"
import { useTheme } from "../contexts/ThemeContext"
import Navbar from "../components/Navbar"
import Toast from "../components/Toast"
import "./Companies.css"

function Companies() {
  const [companies, setCompanies] = useState([])
  const [username, setUsername] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false)
  const [newCompanyName, setNewCompanyName] = useState("")
  const [bulkCompanies, setBulkCompanies] = useState("")
  const [editingCompany, setEditingCompany] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [toast, setToast] = useState({ show: false, message: "" })
  const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false, companyId: null })
  const navigate = useNavigate()
  const { isDarkMode } = useTheme()

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

    // Contar cards para cada empresa (incluindo multi-empresa)
    const companiesWithCardCounts = userCompanies.map((company) => {
      // Cards específicos da empresa
      const companyCards = company.cards || []

      // Procurar cards multi-empresa que incluem esta empresa
      let multiCompanyCardCount = 0
      userCompanies.forEach((otherCompany) => {
        if (otherCompany.id !== company.id) {
          const multiCards = (otherCompany.cards || []).filter(
            (card) => card.multiCompany && card.companies && card.companies.includes(company.id),
          )
          multiCompanyCardCount += multiCards.length
        }
      })

      return {
        ...company,
        totalCardCount: companyCards.length + multiCompanyCardCount,
      }
    })

    setCompanies(companiesWithCardCounts)

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

  const openBulkImportModal = () => {
    setBulkCompanies("")
    setIsBulkImportOpen(true)
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

  const closeBulkImportModal = () => {
    setIsBulkImportOpen(false)
    setBulkCompanies("")
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
      allCompanies[username] = updatedCompanies.map(({ totalCardCount, ...rest }) => rest) // Remove o campo totalCardCount
    } else {
      // Adicionar nova empresa
      const newCompany = {
        id: Date.now(),
        name: newCompanyName,
        cards: [],
        totalCardCount: 0,
      }
      const updatedCompanies = [...companies, newCompany]
      setCompanies(updatedCompanies)
      allCompanies[username] = updatedCompanies.map(({ totalCardCount, ...rest }) => rest) // Remove o campo totalCardCount
    }

    localStorage.setItem("companies", JSON.stringify(allCompanies))
    closeModal()

    setToast({
      show: true,
      message: editingCompany ? "Empresa atualizada com sucesso!" : "Empresa adicionada com sucesso!",
    })
  }

  const saveBulkCompanies = () => {
    if (!bulkCompanies.trim()) return

    const companyNames = bulkCompanies
      .split("\n")
      .map((name) => name.trim())
      .filter((name) => name.length > 0)

    if (companyNames.length === 0) return

    const allCompanies = JSON.parse(localStorage.getItem("companies") || "{}")
    const existingNames = new Set(companies.map((company) => company.name.toLowerCase()))

    const newCompanies = companyNames
      .filter((name) => !existingNames.has(name.toLowerCase()))
      .map((name) => ({
        id: Date.now() + Math.floor(Math.random() * 1000),
        name,
        cards: [],
      }))

    const updatedCompanies = [...companies, ...newCompanies.map((company) => ({ ...company, totalCardCount: 0 }))]
    setCompanies(updatedCompanies)
    allCompanies[username] = updatedCompanies.map(({ totalCardCount, ...rest }) => rest) // Remove o campo totalCardCount
    localStorage.setItem("companies", JSON.stringify(allCompanies))

    closeBulkImportModal()

    setToast({
      show: true,
      message: `${newCompanies.length} empresas importadas com sucesso!`,
    })
  }

  // Função para abrir o modal de confirmação de exclusão
  const confirmDeleteCompany = (companyId, e) => {
    e.stopPropagation()
    setDeleteConfirmation({ show: true, companyId })
  }

  // Função para cancelar a exclusão
  const cancelDelete = () => {
    setDeleteConfirmation({ show: false, companyId: null })
  }

  // Função para confirmar e executar a exclusão
  const executeDelete = () => {
    const companyId = deleteConfirmation.companyId
    if (!companyId) return

    const updatedCompanies = companies.filter((company) => company.id !== companyId)
    setCompanies(updatedCompanies)

    const allCompanies = JSON.parse(localStorage.getItem("companies") || "{}")
    allCompanies[username] = updatedCompanies.map(({ totalCardCount, ...rest }) => rest) // Remove o campo totalCardCount
    localStorage.setItem("companies", JSON.stringify(allCompanies))

    setDeleteConfirmation({ show: false, companyId: null })

    setToast({
      show: true,
      message: "Empresa excluída com sucesso!",
    })
  }

  const navigateToDashboard = (company) => {
    // Remover o campo totalCardCount antes de salvar no localStorage
    const { totalCardCount, ...companyToSave } = company

    // Salvar a empresa atual no localStorage
    localStorage.setItem("currentCompany", JSON.stringify(companyToSave))
    navigate("/dashboard")
  }

  return (
    <div className={`companies-container ${isDarkMode ? "dark" : "light"}`}>
      <div className="gradient-bg">
        <div className="gradient-1"></div>
        <div className="gradient-2"></div>
        <div className="gradient-3"></div>
      </div>

      <Navbar title="Minhas Empresas" showBackButton={false} userData={{ nome: username }} />

      <main className="companies-main">
        <div className="companies-actions">
          <button onClick={openBulkImportModal} className="bulk-import-button">
            Importar Empresas em Lote
          </button>
        </div>

        <div className={`companies-grid ${isLoading ? "loading" : "loaded"}`}>
          {companies.map((company) => (
            <div key={company.id} className="company-card" onClick={() => navigateToDashboard(company)}>
              <div className="company-icon">
                <Building2 size={24} />
              </div>
              <div className="company-content">
                <span className="company-name">{company.name}</span>
                <div className="company-info">
                  <span>{company.totalCardCount || 0} cards</span>
                </div>
              </div>
              <div className="card-actions">
                <button onClick={(e) => openEditModal(company, e)} className="edit-button">
                  <Edit size={16} />
                </button>
                <button onClick={(e) => confirmDeleteCompany(company.id, e)} className="delete-button">
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

      {isBulkImportOpen && (
        <div className="modal-overlay">
          <div className="modal bulk-modal">
            <h2>Importar Empresas em Lote</h2>
            <p className="bulk-instructions">Digite o nome de cada empresa em uma linha separada:</p>
            <textarea
              placeholder="Empresa 1&#10;Empresa 2&#10;Empresa 3"
              value={bulkCompanies}
              onChange={(e) => setBulkCompanies(e.target.value)}
              rows={10}
              className="bulk-textarea"
              autoFocus
            />
            <div className="modal-actions">
              <button onClick={closeBulkImportModal}>Cancelar</button>
              <button onClick={saveBulkCompanies}>Importar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmação de exclusão */}
      {deleteConfirmation.show && (
        <div className="modal-overlay">
          <div className="modal delete-modal">
            <h2>Confirmar Exclusão</h2>
            <p>Tem certeza que deseja excluir esta empresa?</p>
            <p className="delete-warning">Esta ação não pode ser desfeita.</p>
            <div className="modal-actions">
              <button onClick={cancelDelete}>Cancelar</button>
              <button onClick={executeDelete} className="delete-confirm-button">
                Excluir
              </button>
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

export default Companies
