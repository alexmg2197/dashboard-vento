import { useState, useEffect } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Login from './Components/Login'
import Inicio from './Components/Inicio'
import AddMerma from './Components/AddMerma'
import VerMerma from './Components/VerMerma'
import Catalogos from './Components/Catalogos'
import Sidebar from './Components/Sidebar'
import Header from './Components/Header'

function App() {

  const [sidebarOpen, setSidebarOpen] = useState(false); // Estado para controlar el tamaño del sidebar

  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = cargando

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setIsAuthenticated(!!storedUser); // true si hay user, false si no
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Mostrar un loader mientras verifica el auth
  if (isAuthenticated === null) {
    return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  }

  return (
    <HashRouter>
     {isAuthenticated ? (
      <div className="flex h-screen">
        <Sidebar setIsAuthenticated={setIsAuthenticated} toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} ></Sidebar>
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header setIsAuthenticated={setIsAuthenticated} toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} ></Header>
          <div className="flex-1 overflow-hidden bg-gray-200 p-4 overflow-y-auto">
            <Routes>
              <Route index element={<Navigate to="/Inicio" replace />} />
              <Route path="/Inicio" element={<Inicio />} />
              <Route path="/AgregarMerma" element={<AddMerma />} />
              <Route path="/VerMerma" element={<VerMerma />} />
              <Route path="/Catalogos" element={<Catalogos />} />
            </Routes>
          </div>
        </div>
      </div>
     ):(
      <Routes>
          <Route exact path="/Login" element={<Login setIsAuthenticated={setIsAuthenticated}/>} />
          <Route path="*" element={<Navigate to="/Login" />} />
        </Routes>
     )}
    </HashRouter>
  )
}

export default App
