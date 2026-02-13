import React, { useState, useEffect } from 'react';
import { db, auth } from '../services/firebase';
// Adicionei os imports de doc e getDoc aqui embaixo:
import { collection, onSnapshot, doc, getDoc } from 'firebase/firestore'; 
import { useNavigate } from 'react-router-dom';

export default function Mensagens() {
  const [contatos, setContatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) return;

    // 1. Escuta em tempo real quem você está seguindo
    const followRef = collection(db, "users", currentUser.uid, "seguindo");
    
    const unsub = onSnapshot(followRef, async (snap) => {
      const listaContatos = [];
      
      // 2. Para cada ID que você segue, buscamos o Nome e a Foto real
      const promises = snap.docs.map(async (d) => {
        const userSnap = await getDoc(doc(db, "users", d.id));
        if (userSnap.exists()) {
          return { id: d.id, ...userSnap.data() };
        }
        return null;
      });

      const resultados = await Promise.all(promises);
      setContatos(resultados.filter(c => c !== null));
      setLoading(false);
    });

    return () => unsub();
  }, [currentUser]);

  const abrirChat = (contatoId) => {
    // Cria um ID de chat único (Sempre o menor ID primeiro para não duplicar a conversa)
    const chatId = currentUser.uid < contatoId 
      ? `${currentUser.uid}_${contatoId}` 
      : `${contatoId}_${currentUser.uid}`;
    navigate(`/chat/${chatId}/${contatoId}`);
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container mt-4 mb-5 pb-5">
      <h2 className="fw-bold mb-4">Suas Conversas</h2>
      
      {contatos.length === 0 ? (
        <div className="text-center mt-5 bg-white p-4 shadow-sm" style={{ borderRadius: '20px' }}>
          <p className="text-muted mb-0">Você ainda não segue ninguém.</p>
          <p className="small text-primary">Siga o Pedro ou outros amigos para liberar o chat!</p>
        </div>
      ) : (
        contatos.map(c => (
          <div 
            key={c.id} 
            className="card mb-2 border-0 shadow-sm item-contato" 
            style={{ cursor: 'pointer', borderRadius: '15px', transition: '0.3s' }} 
            onClick={() => abrirChat(c.id)}
          >
            <div className="card-body d-flex align-items-center">
              <img 
                src={c.fotoUrl || `https://ui-avatars.com/api/?name=${c.nome}`} 
                className="rounded-circle me-3" 
                style={{ width: '55px', height: '55px', objectFit: 'cover', border: '2px solid #0d6efd' }} 
                alt="P" 
              />
              <div>
                <h6 className="fw-bold mb-0">{c.nome}</h6>
                <small className="text-muted text-truncate">Clique para enviar uma mensagem</small>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}