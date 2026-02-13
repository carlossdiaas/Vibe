import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', paddingBottom: '80px' }}>
      <Router>
        <Routes>
          {/* Telas de Entrada */}
          <Route path="/" element={<Cadastro />} />
          <Route path="/perfil/:uid" element={<><Navbar /><PerfilPublico /><BottomNav /></>} />
          <Route path="/login" element={<Login />} />

          {/* Telas Internas com as Barras de Navegação */}
          <Route path="/feed" element={<><Navbar /><Feed /><BottomNav /></>} />
          <Route path="/mensagens" element={<><Navbar /><Mensagens /><BottomNav /></>} />
          <Route path="/chat/:chatId/:contatoId" element={<><Navbar /><ChatPrivado /><BottomNav /></>} />
          <Route path="/perfil" element={<><Navbar /><Perfil /><BottomNav /></>} />
          <Route path="/novo-post" element={<><Navbar /><NovoPost /><BottomNav /></>} />
          
          {/* Rotas Auxiliares */}
          <Route path="/pesquisa" element={<><Navbar /><div className="container mt-5 text-center"><h2>Busca de Usuários</h2></div><BottomNav /></>} />
          <Route path="/mensagens" element={<><Navbar /><div className="container mt-5 text-center"><h2>Suas DMs</h2></div><BottomNav /></>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;