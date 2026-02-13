import React, { useState } from 'react';
import { auth, db } from '../services/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

export default function Cadastro() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');

  const handleCadastro = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      await setDoc(doc(db, "users", userCredential.user.uid), {
        nome, email, uid: userCredential.user.uid
      });
      alert("Bem-vindo ao Vibe!");
    } catch (error) { alert("Erro: " + error.message); }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-5 border-0" style={{ width: '100%', maxWidth: '450px', borderRadius: '15px' }}>
        <h1 className="text-center fw-bold text-primary mb-4">Vibe.</h1>
        
        <form onSubmit={handleCadastro}>
          <div className="mb-3">
            <label className="form-label small fw-bold">NOME</label>
            <input type="text" className="form-control p-3" placeholder="Seu nome completo" onChange={(e) => setNome(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-bold">E-MAIL</label>
            <input type="email" className="form-control p-3" placeholder="email@vibe.com" onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-4">
            <label className="form-label small fw-bold">SENHA</label>
            <input type="password" className="form-control p-3" placeholder="Mínimo 6 caracteres" onChange={(e) => setSenha(e.target.value)} required />
          </div>
          <button className="btn btn-primary btn-lg w-100 fw-bold" type="submit">Cadastrar</button>
        </form>
        
        <p className="text-center mt-4 mb-0">
          Já tem conta? <Link to="/login" className="text-decoration-none fw-bold">Entrar</Link>
        </p>
      </div>
    </div>
  );
}