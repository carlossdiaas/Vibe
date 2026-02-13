import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { db, auth } from '../services/firebase';
import { 
  collection, addDoc, query, orderBy, onSnapshot, 
  serverTimestamp, doc, updateDoc, getDoc 
} from 'firebase/firestore';

export default function ChatPrivado() {
  const { chatId, contatoId } = useParams();
  const [mensagens, setMensagens] = useState([]);
  const [texto, setTexto] = useState('');
  const [nomeContato, setNomeContato] = useState('Conversa');
  const currentUser = auth.currentUser;
  const scrollRef = useRef();

  // 1. Busca o nome do contato para o topo da tela
  useEffect(() => {
    getDoc(doc(db, "users", contatoId)).then(d => d.exists() && setNomeContato(d.data().nome));
  }, [contatoId]);

  // 2. Escuta mensagens e marca como lidas
  useEffect(() => {
    if (!currentUser || !chatId) return;

    const q = query(collection(db, "chats", chatId, "mensagens"), orderBy("data", "asc"));
    
    const unsub = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setMensagens(msgs);

      // Rola para o fim da conversa automaticamente
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 100);

      // LOGICA PARA LIMPAR O BADGE: Marca mensagens recebidas como lidas
      snap.docs.forEach(async (docSnap) => {
        const dados = docSnap.data();
        if (dados.para === currentUser.uid && dados.lida === false) {
          const msgRef = doc(db, "chats", chatId, "mensagens", docSnap.id);
          try {
            await updateDoc(msgRef, { lida: true });
          } catch (e) {
            console.error("Erro ao marcar como lida:", e);
          }
        }
      });
    });

    return () => unsub();
  }, [chatId, currentUser]);

  const enviarMsg = async (e) => {
    e.preventDefault();
    if (!texto.trim()) return;

    try {
      await addDoc(collection(db, "chats", chatId, "mensagens"), {
        texto,
        enviadoPor: currentUser.uid,
        para: contatoId, // Essencial para o badge da outra pessoa
        lida: false,
        data: serverTimestamp()
      });
      setTexto('');
    } catch (er) {
      console.error("Erro ao enviar:", er);
    }
  };

  return (
    <div className="container mt-2 d-flex flex-column" style={{ height: '85vh' }}>
      {/* Cabeçalho simples com nome do contato */}
      <div className="p-2 border-bottom bg-white sticky-top d-flex align-items-center">
        <h6 className="fw-bold mb-0 text-primary">{nomeContato}</h6>
      </div>

      <div className="flex-grow-1 overflow-auto p-2 d-flex flex-column" style={{ paddingBottom: '120px' }}>
        {mensagens.map(m => (
          <div key={m.id} className={`d-flex ${m.enviadoPor === currentUser.uid ? 'justify-content-end' : 'justify-content-start'} mb-2`}>
            <div className={`p-2 px-3 shadow-sm ${m.enviadoPor === currentUser.uid ? 'bg-primary text-white' : 'bg-light text-dark'}`} 
                 style={{ borderRadius: '18px', maxWidth: '75%', fontSize: '0.9rem' }}>
              {m.texto}
            </div>
          </div>
        ))}
        {/* Referência para o scroll automático */}
        <div ref={scrollRef}></div>
      </div>

      {/* Formulário Fixo */}
      <form onSubmit={enviarMsg} className="d-flex mt-2 bg-white p-3 border-top fixed-bottom shadow-lg" style={{ marginBottom: '65px', zIndex: 1001 }}>
        <input 
          type="text" 
          className="form-control border-0 bg-light rounded-pill me-2 px-3" 
          placeholder="Escreva sua mensagem..." 
          value={texto} 
          onChange={e => setTexto(e.target.value)} 
        />
        <button className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
          <i className="bi bi-send-fill"></i>
        </button>
      </form>
    </div>
  );
}