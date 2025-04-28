"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTheme } from "../contexts/ThemeContext"
import "./Home.css"

function Home() {
  const [nome, setNome] = useState("")
  const [empresa, setEmpresa] = useState("")
  const [lembrar, setLembrar] = useState(false)
  const navigate = useNavigate()
  const { isDarkMode, toggleDarkMode } = useTheme()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (nome && empresa) {
      localStorage.setItem("userData", JSON.stringify({ nome, empresa }))
      navigate("/dashboard")
    }
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
          <h1>Bem Vindo !!!</h1>

          <div className="input-group">
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
              placeholder="Digite seu nome"
              required
            />
          </div>

          <div className="input-group">
            <input
              type="text"
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
              placeholder="Digite sua empresa"
              required
            />
          </div>

          <div className="form-footer"></div>

          <button type="submit" className="login-button">
            Salvar
          </button>
          <button type="button" onClick={toggleDarkMode} className="dark-mode-toggle">
            {isDarkMode ? "Modo Claro" : "Modo Escuro"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Home
