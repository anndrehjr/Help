import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import { ThemeProvider } from "./contexts/ThemeContext"
import Login from "./pages/Login"
import Companies from "./pages/Companies"
import Dashboard from "./pages/Dashboard"

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
