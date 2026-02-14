import React, { useState, useEffect } from 'react'; // CORRIGIDO: Import único com Hooks
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { auth } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Importação das Páginas
import Cadastro from './pages/Cadastro';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Perfil from './pages/Perfil';
import BottomNav from './components/BottomNav';
import Feed from './pages/Feed';
import PerfilPublico from './pages/PerfilPublico';
import NovoPost from './pages/NovoPost';
import Mensagens from './pages/Mensagens';
import ChatPrivado from './pages/ChatPrivado';

function App() {
  const [loading, setLoading] = useState(true);
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  useEffect(() => {
    // Escuta o estado da autenticação para evitar o "Usuário Vibe" no refresh
    const unsub = onAuthStateChanged(auth, (user) => {
      setUsuarioLogado(user);
      setLoading(false); 
    });

    return () => unsub();
  }, []);

  // Enquanto o Firebase não responde, mostramos o carregamento
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <Router>
      <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <Routes>
          {/* Telas de Entrada (Sem barras) */}
          <Route path="/" element={<Cadastro />} />
          <Route path="/login" element={<Login />} />

          {/* Telas Internas (Com barras) */}
          <Route path="/feed" element={<><Navbar /><Feed /><BottomNav /></>} />
          <Route path="/perfil" element={<><Navbar /><Perfil /><BottomNav /></>} />
          <Route path="/perfil/:uid" element={<><Navbar /><PerfilPublico /><BottomNav /></>} />
          <Route path="/novo-post" element={<><Navbar /><NovoPost /><BottomNav /></>} />
          <Route path="/mensagens" element={<><Navbar /><Mensagens /><BottomNav /></>} />
          <Route path="/chat/:chatId/:contatoId" element={<><Navbar /><ChatPrivado /><BottomNav /></>} />
          
          {/* Rota de Pesquisa */}
          <Route path="/pesquisa" element={<><Navbar /><div className="container mt-5 text-center"><h2>Busca de Usuários</h2></div><BottomNav /></>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;