
import { FormEvent } from 'react';
import {Link, useHistory} from 'react-router-dom';


import illustrationImg from '../assets/illustration.svg';
import logoImg from '../assets/logo.svg';

import {Button} from '../components/Button';

import { database } from '../services/firebase';

import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

import { ToastContainer, toast } from 'react-toast';

import '../styles/auth.scss';

export function NewRoom() {

const { user } = useAuth();

const [newRoom, setNewRoom] = useState('');

const history = useHistory();

const emptyInput = () => toast.warn('DÊ UM NOME A SALA', { 
  backgroundColor: '#693db1', color: 'white',
});

// Criar sala no db;
async function handleCreateNewRoom(e: FormEvent) {
  e.preventDefault();  
  if(newRoom.trim() === '') {
    emptyInput();
    return;
  }

  // referenciando tabela do banco de dados.
  const roomRef = database.ref('rooms');

  // criando propriedades da tabela.
  const firebaseRoom = await roomRef.push({
    title: newRoom,
    authorId: user?.id,
  })
  
  // enviando parametro de rota.
  history.push(`/admin/rooms/${firebaseRoom.key}`);
}

  return (
    <div id="page-auth-container">
      <aside>
          <img src={ illustrationImg } alt="Q &amp; A" />
          <strong> Crie salas de Q&amp;A </strong>
          <p> Tire as dúvidas de sua audiência em tempo real </p>
      </aside>
    
      <main>
          <div className="main-content">
              <img src={ logoImg } alt=""/>
              <h2> Criar uma nova sala </h2>
                <form onSubmit={ handleCreateNewRoom }> 
                    <input 
                        type="text"
                        onChange={ e => setNewRoom(e.target.value) }
                        value={ newRoom }
                    />
                    <Button type="submit">
                        Criar sala
                    </Button>   

                    <ToastContainer 
                    position={ 'top-center' } 
                    delay={ 5000 } />             
                </form>
                <p> Quer entrar em uma sala existente ? <Link to={"/"}> Clique aqui </Link> </p>
          </div>
      </main>
    </div>
  );
}