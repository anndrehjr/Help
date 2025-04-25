"use client"

import { useNavigate } from "react-router-dom"
import { useTheme } from "../contexts/ThemeContext"
import { Moon, Sun } from "lucide-react"
import "./Navbar.css"

function Navbar({
  title,
  showBackButton = true,
  userData = {},
  userCompanies = [],
  currentCompany = null,
  onCompanyChange = null,
}) {
  const navigate = useNavigate()
  const { isDarkMode, toggleDarkMode } = useTheme()

  const handleLogout = () => {
    // Remove o usuário atual e redireciona para a tela de login
    localStorage.removeItem("currentUser")
    navigate("/")
  }

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <nav className={`dashboard-nav ${isDarkMode ? "dark" : "light"}`}>
      <div className="nav-content">
        <div className="nav-title-container">
          {showBackButton && (
            <button className="back-button" onClick={handleBack}>
              Voltar
            </button>
          )}
          <h1 className="nav-title">{title}</h1>
        </div>

        <div className="nav-actions">
          {userCompanies.length > 0 && currentCompany && onCompanyChange && (
            <div className="company-dropdown">
              <label htmlFor="company-select">Empresa:</label>
              <select
                id="company-select"
                className="company-select"
                value={currentCompany.id}
                onChange={(e) => onCompanyChange(e.target.value)}
              >
                {userCompanies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <span className="user-info">{userData.nome}</span>
          <button className="dark-mode-toggle" onClick={toggleDarkMode}>
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={handleLogout} className="login-button">
            Sair
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
