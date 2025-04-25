"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTheme } from "../contexts/ThemeContext"
import "./Login.css"

// Senha fixa para todos os usuários
const FIXED_PASSWORD = "senha123"

function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const { isDarkMode, toggleDarkMode } = useTheme()

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!username.trim()) {
      setError("Por favor, digite seu nome de usuário")
      return
    }

    if (password !== FIXED_PASSWORD) {
      setError("Senha incorreta")
      return
    }

    // Salvar o nome do usuário no localStorage
    localStorage.setItem("currentUser", username)

    // Verificar se o usuário já tem empresas cadastradas
    const allCompanies = JSON.parse(localStorage.getItem("companies") || "{}")
    if (!allCompanies[username]) {
      allCompanies[username] = []
      localStorage.setItem("companies", JSON.stringify(allCompanies))
    }

    // Redirecionar para a página de empresas
    navigate("/companies")
  }

  return (
    <div className={`login-container ${isDarkMode ? "dark" : "light"}`}>
      <div className="gradient-bg">
        <div className="gradient-1"></div>
        <div className="gradient-2"></div>
        <div className="gradient-3"></div>
      </div>

      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-content">
          <h1>Bem Vindo!</h1>

          {error && <div className="error-message">{error}</div>}

          <div className="input-group">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nome de usuário"
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              required
            />
          </div>

          <div className="form-footer"></div>

          <button type="submit" className="login-button">
            Entrar
          </button>
          <button type="button" onClick={toggleDarkMode} className="dark-mode-toggle">
            {isDarkMode ? "Modo Claro" : "Modo Escuro"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Login
