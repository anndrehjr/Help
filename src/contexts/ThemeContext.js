"use client"

import { createContext, useState, useEffect, useContext } from "react"

// Criar o contexto
const ThemeContext = createContext()

// Provedor do contexto
export function ThemeProvider({ children }) {
  // Inicializar o estado com o valor do localStorage ou o padrão
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Verificar se estamos no navegador
    if (typeof window !== "undefined") {
      // Tentar obter o valor do localStorage
      const savedMode = localStorage.getItem("darkMode")
      // Retornar o valor salvo ou false como padrão
      return savedMode ? JSON.parse(savedMode) : false
    }
    // Padrão para false se não estiver no navegador
    return false
  })

  // Efeito para atualizar o localStorage quando o modo mudar
  useEffect(() => {
    // Salvar o modo atual no localStorage
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode))

    // Atualizar a classe no elemento html para aplicar os estilos corretos
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  // Função para alternar entre os modos claro e escuro
  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode)
  }

  // Retornar o provedor com os valores e funções
  return <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>{children}</ThemeContext.Provider>
}

// Hook personalizado para usar o contexto
export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme deve ser usado dentro de um ThemeProvider")
  }
  return context
}
