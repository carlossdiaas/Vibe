import React, { useState } from 'react';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Faz o login no Firebase Auth
      await signInWithEmailAndPassword(auth, email, senha);
      // Se der certo, manda para o feed
      navigate('/feed');
    } catch (error) {
      alert("Erro ao entrar: Verifique seu e-mail e senha.");
    }
  };

  return (
    // Centraliza tudo no meio da tela
    <div className="container d-flex justify-content-center align-items-center vh-100">
      
      {/* Card com sombra e bordas arredondadas */}
      <div className="card shadow p-5 border-0" style={{ width: '100%', maxWidth: '450px', borderRadius: '15px' }}>
        
        <div className="text-center mb-4">
          <h1 className="fw-bold text-primary mb-0">Vibe.</h1>
          <p className="text-muted small">Bom te ver de novo!</p>
        </div>
        
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label small fw-bold">E-MAIL</label>
            <input 
              type="email" 
              className="form-control p-3" 
              placeholder="seu@email.com" 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="mb-4">
            <label className="form-label small fw-bold">SENHA</label>
            <input 
              type="password" 
              className="form-control p-3" 
              placeholder="Sua senha" 
              onChange={(e) => setSenha(e.target.value)} 
              required 
            />
          </div>

          <button className="btn btn-primary btn-lg w-100 fw-bold" type="submit">
            Entrar no Vibe
          </button>
        </form>
        
        <div className="text-center mt-4">
          <span className="text-muted small">Ainda não tem conta? </span>
          <Link to="/" className="text-decoration-none fw-bold">Criar conta</Link>
        </div>
      </div>
    </div>
  );
}