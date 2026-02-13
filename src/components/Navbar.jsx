import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function Navbar() {
  const [nome, setNome] = useState('Usuário');
  const [fotoUrl, setFotoUrl] = useState('https://via.placeholder.com/40'); // Foto padrão
  const navigate = useNavigate();

  useEffect(() => {
    async function carregarDadosNav() {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setNome(docSnap.data().nome);
          // Se tiver foto no banco, usa ela, senão mantém a padrão
          if(docSnap.data().fotoUrl) setFotoUrl(docSnap.data().fotoUrl);
        }
      }
    }
    carregarDadosNav();
  }, []);

  const handleSair = () => {
    auth.signOut();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm mb-4">
      <div className="container d-flex justify-content-between">
        <div className="d-flex align-items-center">
          {/* Foto de Perfil na Navbar */}
          <img 
            src={fotoUrl} 
            alt="Perfil" 
            className="rounded-circle me-2" 
            style={{ width: '40px', height: '40px', objectFit: 'cover', border: '2px solid #0d6efd' }} 
          />
          <span className="text-white fw-bold">{nome}</span>
        </div>

        <div className="d-flex align-items-center">
          <Link className="nav-link text-white me-3" to="/perfil">Configurações</Link>
          <button className="btn btn-outline-light btn-sm fw-bold" onClick={handleSair}>Sair</button>
        </div>
      </div>
    </nav>
  );
}