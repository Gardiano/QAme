
import { useHistory } from 'react-router-dom';

import { FormEvent } from 'react';

import illustrationImg from '../assets/illustration.svg';
import logoImg from '../assets/logo.svg';
import googleIconImg from '../assets/google-icon.svg';

import Button from '../components/Button';

import '../styles/auth.scss';
import { useState } from 'react';
import { database } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';

export function Home() {
  // acessando rotas
  const history = useHistory();
  const { user, signInWithGoogle } = useAuth();
  const [roomCode, setRoomCode] = useState('');
 
  async function handleCreateNewRoom() {    
    // verificando se existe um usuario;
  if( !user ) {
  await signInWithGoogle();
  } 
  // enviando usuario a rota;
  history.push('/rooms/new');
}

async function handleJoinRoom(e: FormEvent) {
  e.preventDefault();
  // verificando se há 'espaços' no input;
  if( roomCode.trim() === '' ) {
    return;
  }

  // inserindo codigo de acesso para entrar na sala;
  const roomRef = await database.ref(`rooms/${roomCode}`).get();

  if( !user ) {
    // redirecionando usuario para sala existente; 
    history.push(`/rooms/${roomCode}`);    
  }

  // verificando se a sala existe;
  if( !roomRef.exists() ) {   
    alert('sala não existente!');
    return;
  }

  if( roomRef.val().endedAt ) {
    alert('Essa sala foi encerrada recentemente.');    
    return;
  }

    // criador da pergunta ? redirecionado para área de admin
  if( roomRef.val().authorId === user?.id ) {
    history.push(`/admin/rooms/${roomCode}`);
    return;
  } else {
    // redirecionado para área de usuário
    history.push(`/rooms/${roomCode}`);
    return;
  }
}
    
return (
  <div id="page-auth-container">
    <aside>
        <img src={illustrationImg} alt="Q&amp;A" />
        <strong> Crie salas de Q&amp;A </strong>
        <p> Tire as dúvidas de sua audiência em tempo real. </p>
    </aside>

    <main>
        <div className="main-content">
          <img src={logoImg} alt="headerLogo" title="logo" />
          <button className="create-room" onClick={handleCreateNewRoom}>
              <img src={googleIconImg} alt="" />
              Crie sua sala com o Google
          </button>
          
          <div className="separator"> ou entre em uma sala </div>

          <form onSubmit={handleJoinRoom}>
              <input 
                  type="text"
                  onChange={e => setRoomCode(e.target.value)}
                  value={roomCode}
              />
              <Button type="submit">
                  Entrar na sala
              </Button>
          </form>
        </div>
    </main>
  </div>
);
}

export default Home;