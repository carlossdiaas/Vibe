import React, { useState, useEffect } from 'react';
import { db, auth } from '../services/firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function NovoPost() {
  const [texto, setTexto] = useState('');
  const [userData, setUserData] = useState({ nome: '', fotoUrl: '' });
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();

  // Busca quem é o usuário para carregar o nome/foto no post
  useEffect(() => {
    async function getUser() {
      const user = auth.currentUser;
      if (user) {
        const d = await getDoc(doc(db, "users", user.uid));
        if (d.exists()) setUserData(d.data());
      }
    }
    getUser();
  }, []);

  const handlePostar = async (e) => {
    e.preventDefault();
    if (!texto.trim()) return;

    setEnviando(true);
    try {
      // Salva o post na coleção 'posts' do Firestore
      await addDoc(collection(db, "posts"), {
        texto,
        uid: auth.currentUser.uid,
        nome: userData.nome || "Usuário Vibe",
        fotoUrl: userData.fotoUrl || "",
        data: serverTimestamp() // Salva o horário exato da postagem
      });
      navigate('/feed'); // Volta para o feed após postar
    } catch (er) { 
      alert("Erro ao postar: " + er.message); 
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm p-4 border-0" style={{ borderRadius: '20px' }}>
        <div className="d-flex align-items-center mb-3">
           <img 
              src={userData.fotoUrl || 'https://via.placeholder.com/40'} 
              className="rounded-circle me-2" 
              style={{ width: '40px', height: '40px', objectFit: 'cover' }} 
              alt="Seu Perfil"
           />
           <span className="fw-bold">{userData.nome}</span>
        </div>
        
        <form onSubmit={handlePostar}>
          <textarea 
            className="form-control border-0 bg-light mb-3" 
            rows="5" 
            style={{ borderRadius: '15px', resize: 'none', fontSize: '1.1rem' }}
            placeholder="No que você está pensando?"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          ></textarea>
          
          <button 
            className="btn btn-primary w-100 py-3 fw-bold shadow" 
            style={{ borderRadius: '12px' }}
            disabled={enviando}
          >
            {enviando ? "Postando..." : "Publicar no Vibe"}
          </button>
        </form>
      </div>
    </div>
  );
}