import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { auth, db } from '../services/firebase';
import { collectionGroup, query, where, onSnapshot } from 'firebase/firestore';

export default function BottomNav() {
  const [naoLidas, setNaoLidas] = useState(0);
  const location = useLocation();
  const currentUser = auth.currentUser;

  // Lógica para esconder o botão nas DMs ou Chat
  const esconderBotao = location.pathname === '/mensagens' || location.pathname.includes('/chat');

  useEffect(() => {
    if (!currentUser) return;

    try {
      const q = query(
        collectionGroup(db, "mensagens"),
        where("para", "==", currentUser.uid),
        where("lida", "==", false)
      );

      const unsub = onSnapshot(q, (snap) => {
        setNaoLidas(snap.size);
      }, (error) => {
        console.warn("Aguardando criação de índice no Firebase...", error.message);
      });

      return () => unsub();
    } catch (e) {
      console.error("Erro na BottomNav:", e);
    }
  }, [currentUser]);

  return (
    <nav className="fixed-bottom bg-white border-top d-flex justify-content-around align-items-center py-2 shadow-lg" style={{ zIndex: 1000, height: '70px' }}>
      
      {/* Ícone do Feed */}
      <Link to="/feed" className={`nav-link text-center ${location.pathname === '/feed' ? 'text-primary' : 'text-muted'}`}>
        <i className="bi bi-house-door-fill fs-3"></i>
        <div style={{ fontSize: '0.65rem', fontWeight: 'bold' }}>Feed</div>
      </Link>
      
      {/* Botão Central de Postar - Renderização Condicional */}
      {!esconderBotao && (
        <Link to="/novo-post" className="nav-link text-center">
           <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center shadow" 
                style={{ width: '55px', height: '55px', marginBottom: '35px', border: '5px solid white' }}>
              <i className="bi bi-plus-lg fs-2"></i>
           </div>
        </Link>
      )}

      {/* Ícone de DMs com Notificação Vermelha */}
      <Link to="/mensagens" className={`nav-link text-center position-relative ${location.pathname === '/mensagens' ? 'text-primary' : 'text-muted'}`}>
        <i className="bi bi-chat-fill fs-3"></i>
        {naoLidas > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" 
                style={{ fontSize: '0.7rem', marginTop: '8px', marginLeft: '-5px' }}>
            {naoLidas > 9 ? '9+' : naoLidas}
          </span>
        )}
        <div style={{ fontSize: '0.65rem', fontWeight: 'bold' }}>DMs</div>
      </Link>
      
    </nav>
  );
}