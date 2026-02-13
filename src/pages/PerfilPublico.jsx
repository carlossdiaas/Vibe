import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db, auth } from '../services/firebase';
import { 
  doc, getDoc, collection, query, where, onSnapshot, 
  setDoc, deleteDoc, serverTimestamp 
} from 'firebase/firestore';

export default function PerfilPublico() {
  const { uid } = useParams(); // Pega o ID do utilizador na URL
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [seguindo, setSeguindo] = useState(false);
  const [contadores, setContadores] = useState({ seguidores: 0, seguindo: 0 });
  const currentUser = auth.currentUser;

  useEffect(() => {
    // 1. Procura os dados do dono do perfil
    getDoc(doc(db, "users", uid)).then(d => d.exists() && setUser(d.data()));

    // 2. Procura apenas os posts deste utilizador
    const qPosts = query(collection(db, "posts"), where("uid", "==", uid));
    const unsubPosts = onSnapshot(qPosts, (snap) => {
      setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const toggleFollow = async () => {
  // TRAVA DE SEGURANÇA: Se não estiver logado, avisa e para a execução
  if (!currentUser) {
    alert("Opa! Você precisa estar logado para seguir alguém no Vibe.");
    return;
  }
  
  const meuFollowRef = doc(db, "users", currentUser.uid, "seguindo", uid);
  const seguidorRef = doc(db, "users", uid, "seguidores", currentUser.uid);

  try {
    if (seguindo) {
      await deleteDoc(meuFollowRef);
      await deleteDoc(seguidorRef);
    } else {
      await setDoc(meuFollowRef, { dataSeguida: serverTimestamp() });
      await setDoc(seguidorRef, { seguidorId: currentUser.uid });
    }
  } catch (error) {
    console.error("Erro ao seguir:", error);
  }
};

    // 3. Verifica se eu já sigo este utilizador
    if (currentUser) {
      const followRef = doc(db, "users", currentUser.uid, "seguindo", uid);
      const unsubFollow = onSnapshot(followRef, (d) => setSeguindo(d.exists()));
      
      // 4. Contadores (Opcional - mas fica profissional)
      const unsubSeguidores = onSnapshot(collection(db, "users", uid, "seguidores"), (snap) => {
        setContadores(prev => ({ ...prev, seguidores: snap.size }));
      });

      return () => { unsubPosts(); unsubFollow(); unsubSeguidores(); };
    }
    return () => unsubPosts();
  }, [uid, currentUser]);

  const toggleFollow = async () => {
    if (!currentUser) return alert("Tens de estar logado para seguir!");
    
    // Referência na minha lista de "quem eu sigo"
    const meuFollowRef = doc(db, "users", currentUser.uid, "seguindo", uid);
    // Referência na lista dele de "quem o segue"
    const seguidorRef = doc(db, "users", uid, "seguidores", currentUser.uid);

    if (seguindo) {
      await deleteDoc(meuFollowRef);
      await deleteDoc(seguidorRef);
    } else {
      await setDoc(meuFollowRef, { dataSeguida: serverTimestamp() });
      await setDoc(seguidorRef, { seguidorId: currentUser.uid });
    }
  };

  if (!user) return <div className="text-center mt-5"><div className="spinner-border"></div></div>;

  return (
    <div className="container mt-4 mb-5 pb-5">
      <div className="card border-0 shadow-sm p-4 text-center" style={{ borderRadius: '20px' }}>
        <img 
          src={user.fotoUrl || `https://ui-avatars.com/api/?name=${user.nome}`} 
          className="rounded-circle mx-auto shadow-sm" 
          style={{ width: '100px', height: '100px', objectFit: 'cover' }} 
          alt="Perfil" 
        />
        <h3 className="fw-bold mt-3 mb-0">{user.nome}</h3>
        <p className="text-muted small mb-3">Estudante de ADS</p>

        <div className="d-flex justify-content-center gap-4 mb-3">
          <div><span className="fw-bold">{contadores.seguidores}</span> <br/><small className="text-muted">Seguidores</small></div>
          <div><span className="fw-bold">{posts.length}</span> <br/><small className="text-muted">Posts</small></div>
        </div>

        {currentUser && currentUser.uid !== uid && (
          <button 
            onClick={toggleFollow} 
            className={`btn w-100 fw-bold ${seguindo ? 'btn-outline-secondary' : 'btn-primary'}`}
            style={{ borderRadius: '10px' }}
          >
            {seguindo ? 'Seguindo' : 'Seguir'}
          </button>
        )}
      </div>

      <h5 className="fw-bold mt-4 mb-3">Postagens</h5>
      {posts.length === 0 ? (
        <p className="text-muted text-center">Ainda não há postagens.</p>
      ) : (
        posts.map(p => (
          <div key={p.id} className="card shadow-sm mb-3 border-0" style={{ borderRadius: '15px' }}>
            <div className="card-body">
              <p className="mb-0">{p.texto}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}g