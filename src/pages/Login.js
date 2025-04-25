"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useTheme } from "../contexts/ThemeContext"
import { User, Lock, Sun, Moon } from 'lucide-react'
import "./Login.css"

// Senha fixa para todos os usuários
const FIXED_PASSWORD = "senha123"

function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const navigate = useNavigate()
  const { isDarkMode, toggleDarkMode } = useTheme()

  useEffect(() => {
    // Gerar um avatar aleatório baseado no nome de usuário
    if (username.trim()) {
      setAvatarUrl(`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(username)}`)
    } else {
      setAvatarUrl(`https://api.dicebear.com/7.x/shapes/svg?seed=${Math.random()}`)
    }
  }, [username])

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
          <div className="login-header">
            <div className="avatar-container">
              {avatarUrl && <img src={avatarUrl || "/placeholder.svg"} alt="Avatar" className="user-avatar" />}
            </div>
            <h1>Bem Vindo!</h1>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="input-group">
            <div className="input-icon">
              <User size={18} />
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nome de usuário"
              required
            />
          </div>

          <div className="input-group">
            <div className="input-icon">
              <Lock size={18} />
            </div>
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
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Login
