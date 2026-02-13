import React, { useState, useEffect } from 'react';
import { auth, db } from '../services/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; // 1. Importe o useNavigate

export default function Perfil() {
  const [nome, setNome] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // 2. Inicialize o navigate

  useEffect(() => {
    async function carregarDados() {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setNome(docSnap.data().nome || '');
          setFotoUrl(docSnap.data().fotoUrl || '');
        }
      }
      setLoading(false);
    }
    carregarDados();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      await updateDoc(doc(db, "users", user.uid), { 
        nome: nome,
        fotoUrl: fotoUrl 
      });
      alert("Perfil atualizado com sucesso!");
      navigate('/feed'); // 3. Redireciona para o Feed após salvar
    } catch (error) { 
      alert("Erro ao atualizar o perfil."); 
    }
  };

  if (loading) return <div className="text-center mt-5">Carregando...</div>;

  return (
    <div className="container mt-4">
      <div className="card shadow p-4 mx-auto border-0" style={{ maxWidth: '500px', borderRadius: '20px' }}>
        <h2 className="text-center mb-4 fw-bold">Editar Perfil</h2>
        <form onSubmit={handleUpdate}>
          <div className="text-center mb-4">
            <img 
              src={fotoUrl || 'https://via.placeholder.com/100'} 
              className="rounded-circle shadow-sm border border-primary border-2" 
              style={{ width: '120px', height: '120px', objectFit: 'cover' }} 
              alt="Preview"
            />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-bold text-muted">NOME</label>
            <input type="text" className="form-control p-3" value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>
          <div className="mb-4">
            <label className="form-label small fw-bold text-muted">URL DA FOTO</label>
            <input type="text" className="form-control p-3" value={fotoUrl} placeholder="Cole o link da sua foto" onChange={(e) => setFotoUrl(e.target.value)} />
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-primary w-100 py-3 fw-bold shadow-sm" type="submit" style={{ borderRadius: '12px' }}>
              Salvar e Voltar
            </button>
            <button className="btn btn-light w-100 py-3 fw-bold" type="button" onClick={() => navigate('/feed')}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}