import React, { useState, useEffect } from 'react';
import { db, auth } from '../services/firebase';
import { Link } from 'react-router-dom'; // Importante para a navegação
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';

// Componente das Respostas
function Respostas({ postId }) {
  const [comentarios, setComentarios] = useState([]);
  useEffect(() => {
    const q = query(collection(db, "posts", postId, "comentarios"), orderBy("data", "asc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setComentarios(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [postId]);

  return (
    <div className="ps-3 border-start mt-2">
      {comentarios.map(c => (
        <div key={c.id} className="mb-2 bg-light p-2 shadow-sm" style={{ borderRadius: '10px', fontSize: '0.85rem' }}>
          <div className="d-flex align-items-center mb-1">
             <img src={c.fotoUrl || `https://ui-avatars.com/api/?name=${c.nome}`} 
                  className="rounded-circle me-2" style={{ width: '20px', height: '20px', objectFit: 'cover' }} alt="P" />
             <span className="fw-bold" style={{ color: '#bdfd0d' }}>{c.nome}:</span>
          </div>
          <span className="ms-4">{c.texto}</span>
        </div>
      ))}
    </div>
  );
}

// Componente para cada Post individual
function PostCard({ post, handleResponder }) {
  const [mostrarComentarios, setMostrarComentarios] = useState(false);

  return (
    <div className="card shadow-sm mb-4 border-0" style={{ borderRadius: '15px' }}>
      <div className="card-body">
        {/* Agora o cabeçalho é um Link para o Perfil do autor */}
        <Link to={`/perfil/${post.uid}`} className="text-decoration-none text-dark d-flex align-items-center mb-2">
          <img 
            src={post.fotoUrl || `https://ui-avatars.com/api/?name=${post.nome}`} 
            className="rounded-circle me-2" 
            style={{ width: '40px', height: '40px', objectFit: 'cover' }} 
            alt="P" 
          />
          <span className="fw-bold">{post.nome}</span>
        </Link>

        <p className="card-text mb-1">{post.texto}</p>
        <small className="text-muted fw-light d-block mb-3" style={{ fontSize: '0.7rem' }}>
          {post.data && new Date(post.data.seconds * 1000).toLocaleDateString('pt-BR', {day:'2-digit', month:'2-digit'}) + ", " + 
           new Date(post.data.seconds * 1000).toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'})}
        </small>

        <div className="d-flex justify-content-between align-items-center">
            <button 
              className="btn btn-sm btn-outline-primary border-0 fw-bold" 
              onClick={() => setMostrarComentarios(!mostrarComentarios)}
            >
              {mostrarComentarios ? "Ocultar comentários" : "Ver comentários"}
            </button>
        </div>

        {mostrarComentarios && (
          <div className="mt-3">
            <hr className="my-2" />
            <Respostas postId={post.id} />
            <form onSubmit={(e) => handleResponder(e, post.id)} className="d-flex mt-3">
              <input name="resposta" type="text" className="form-control form-control-sm border-0 bg-light me-2" 
                     placeholder="Responder..." style={{ borderRadius: '10px' }} />
              <button className="btn btn-sm btn-primary px-3 fw-bold" style={{ borderRadius: '10px' }}>Enviar</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("data", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleResponder = async (e, postId) => {
    e.preventDefault();
    const input = e.target.elements.resposta;
    const texto = input.value;
    if (!texto.trim()) return;

    try {
      const user = auth.currentUser;
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const nomeReal = userDoc.exists() ? userDoc.data().nome : "Usuário Vibe";
      const fotoReal = userDoc.exists() ? userDoc.data().fotoUrl : "";

      await addDoc(collection(db, "posts", postId, "comentarios"), {
        texto, uid: user.uid, nome: nomeReal, fotoUrl: fotoReal, data: serverTimestamp()
      });
      input.value = '';
    } catch (er) { console.error(er); }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container mt-3 mb-5 pb-5">
      <h2 className="fw-bold mb-4">Vibe Feed</h2>
      {posts.map(post => (
        <PostCard key={post.id} post={post} handleResponder={handleResponder} />
      ))}
    </div>
  );
}