"use client"

import { useNavigate } from "react-router-dom"
import { ArrowLeft, Sun, Moon } from 'lucide-react'
import { useTheme } from "../contexts/ThemeContext"

function Navbar({ title, showBackButton = true, userData = {}, userCompanies = [], currentCompany, onCompanyChange }) {
  const navigate = useNavigate()
  const { isDarkMode, toggleDarkMode } = useTheme()

  return (
    <nav className="dashboard-nav">
      <div className="nav-content">
        {showBackButton && (
          <button onClick={() => navigate("/companies")} className="back-button">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Voltar para Empresas
          </button>
        )}

        <h1 className="nav-title">{title}</h1>

        <div className="nav-actions">
          {currentCompany && userCompanies.length > 0 && (
            <div className="company-dropdown">
              <label htmlFor="company-select">Empresa:</label>
              <select
                id="company-select"
                value={currentCompany?.id}
                onChange={(e) => onCompanyChange(e.target.value)}
                className="company-select"
              >
                {userCompanies.map((comp) => (
                  <option key={comp.id} value={comp.id}>
                    {comp.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {userData.nome && (
            <div className="user-info">
              <span>Usuário: {userData.nome}</span>
            </div>
          )}

          <button onClick={toggleDarkMode} className="dark-mode-toggle" aria-label={isDarkMode ? "Modo Claro" : "Modo Escuro"}>
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
