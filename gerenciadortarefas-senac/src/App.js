import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import './App.css';
import { ProtectedRoute } from './ProtectedRoute';
import { Login } from './components/Login';
import Home from './Home';



function App() {
  const [isAutenticated, setIsAutenticated] = useState(false);
  const [verificando, setVerificando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    setIsAutenticated(!!token);
    setVerificando(false);
  }, [])
  if (verificando) {
    return <p>Caarregando...</p>
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario')
    setIsAutenticated(false);
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* ROTAS PUBLICAS */}
        <Route
          path='/login'
          element=
          {isAutenticated ? (
            // Passamos a função onLoginSuccess para o componente Login atualizar o estado pai
            <Navigate to="/" replace />
          )
            : <Login onLoginSuccess={() => setIsAutenticated(true)} />
          }
        />

        {/* ROTAS PROTEGIDAS/PRIVADAS*/}
        <Route
          element={<ProtectedRoute isAutenticated={isAutenticated} />}
        >
          <Route
            path='/*'
            element={<Home onLogout={handleLogout} />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;