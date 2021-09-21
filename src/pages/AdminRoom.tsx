
import { useEffect, useState } from "react";
import { useRef } from "react";
import { Link, useHistory, useParams } from "react-router-dom";

import CheckImg from "../assets/check.svg";
import answerImg from "../assets/answer.svg";
import logoImg from "../assets/logo.svg";
import deleteImg from "../assets/delete.svg";
import endImg from "../assets/end.png";
import fig from '../assets/empty-questions.svg';

import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";
import { Question } from "../components/Question";
import { BackButton } from "../components/backButton";

// import { useAuth } from "../hooks/useAuth";
import { useRoom } from "../hooks/useRoom";

import { auth, database } from "../services/firebase";

import useOnClickOutside from "../hooks/useOuterClick";

import { ToastContainer, toast } from 'react-toast';

import "../styles/room.scss";

// import "../styles/adminRoom.scss";

import "../styles/responsiveness.scss";

type RoomParams = {
  id: string;
};

// Entrando em sala criada;
export function AdminRoom() {
  const history = useHistory();

  // Hooks chamando Contexts;
  // const { user, signInWithGoogle } = useAuth();

  // pegando parametro de rota;
  const params = useParams<RoomParams>();
  const roomId = params.id;

  // node do DOM
  const ref = useRef<HTMLDivElement>(null);

  // hook
  const { title, questions } = useRoom( roomId );

  const [ isTrue, setIsTrue ] = useState<boolean>( false );

  const [ isAnswered, setIsAnswered ] = useState<boolean>( false );

  const [ uniqueId, setUniqueId] = useState<string>('null');

  const nonExistentRoom = () => toast.warn(' Sala inexistente ', { 
    backgroundColor: '#693db1', color: 'white',
  });

  const toastDeleteQuestion = () => toast.error(' Pergunta deletada ', { 
    backgroundColor: '#d74242', color: 'white',
  });

  useEffect( () => {
    
  }, [ roomId, uniqueId ] );


  async function handleEndRoom() {
    try {
      await database.ref(`rooms/${roomId}`).update( { endedAt: new Date() } );
        history.push('/');
    } catch( error: any ) {
        console.log( error );
      }
  }

  async function handleCheckQuestionAsAnswered( questionId: string ) {
    try {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
        isAnswered: true,
      });
    } catch( error : any ) {
      console.log( error );
    }
  }

  async function handleHighLightedQuestion( questionId: string ) {
    try {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
        isHighLighted: true,
      });
    } catch( error: any ) {
      console.log( error );
    }
  }

  async function handleDeleteQuestion() { 
    try {         
      await database.ref(`rooms/${roomId}/questions/${uniqueId}`).remove(); 
        handleCloseModal();
          toastDeleteQuestion();
    } catch ( err: any ) {
      console.log( err );
    }
 }

  function handleOpenModal( uId: string ) {
    if ( isTrue === false ) {
      let uniqueId = uId;
      setUniqueId( uniqueId );      
      setIsTrue( true );
    }     
  };

  function handleCloseModal() {  
    if ( isTrue === true ) {    
      setIsTrue( false );
    } 
  };

  async function signOutUser() {
    try {
     await auth.signOut();
      history.push('/');
    } catch ( err: any ) {
      console.log( err );
    }
  }

   // inserindo hook no DOM
   useOnClickOutside( ref, handleCloseModal );

return (   
  <div id="page-room">
    
      <ToastContainer
        position={ 'top-center' } 
        delay={ 5000 } 
      />

      <header>
        <div className="content">
          <img src={ logoImg } alt="askm" />
            <div>
              <RoomCode code={ roomId } />
                <Button isOutLined onClick={ () => signOutUser() }>
                  <img className="endRoomImg" src={ endImg } alt="Encerrar Sala" />
                </Button>
            </div>
        </div>
      </header>

      <main className="content">
        <div className="room-title">
          <h1> { title } </h1>
          { questions.length === 0 ? (
            <span> Esperando por perguntas </span>
          ) : (
            <span> { questions.length } Perguntas </span>
          )}
        </div>

        <div className="question-list">
          { questions.map( ( question ) => {
            return (
              <>
                <Question 
                  key={question.id}                              
                  content={question.content}
                  author={question.author}
                  isAnswered={question.isAnswered}
                  isHighLighted={question.isHighLighted}
                  createdAt={question.createdAt}                  
                  answers={question.answers}
                >

                {  question.isAnswered === true ? (
                  <> 
                    <Link to={`/admin/rooms/${roomId}/answer/${question.id}`} >
                      <img src={ answerImg } alt="Responder Pergunta" />
                    </Link>

                    <button type="button"
                      onClick={ (e) => handleOpenModal( question.id ) } >
                      <img src={ deleteImg } alt="Deletar Pergunta" />
                    </button>
                  </>                    
                  ) : (
                    <>
                    <button                      
                      type="button"
                      title="Pergunta respondida"
                      onClick={ () =>
                        handleCheckQuestionAsAnswered( question.id )
                      }
                    >
                      <img src={ CheckImg } alt="Marcar Pergunta" />
                    </button>

                    <button
                      name="DarDestaque"
                      type="button"
                      title="Marcado como lida"
                      onClick={ () => handleHighLightedQuestion( question.id ) }
                    > <i className="far fa-eye"> </i>
                      {/* <img src={answerImg} alt="Dar Destaque" /> como lida */}
                    </button>

                    <Link to={`/admin/rooms/${roomId}/answer/${question.id}`} title="Resposta">
                      <img src={ answerImg } alt="Responder Pergunta" />
                    </Link>

                  <button                  
                    type="button"
                    title="Deletar pergunta"
                    onClick={ () => handleOpenModal( question.id ) }
                  >
                    <img src={ deleteImg } alt="Deletar Pergunta" />
                  </button>
                  </>                  
                  )}    

                   { /* Modal delete question */ }
                   { isTrue === true ? (
                    <div id="modalContainer" style={ {background: 'rgba(0, 0, 0, 0.22)' } }>
                      <div className="modal" ref={ ref }>            
                          <div className="separatorDiv">
                            <img id="separatorFig" src={ fig } alt="" title="fig" />

                            <div className="modalContent">                       
                              <p> Tem certeza que deseja deletar essa pergunta ? </p>
                            </div>
                            
                            <div className="modalButtons">  
                              <button 
                                className="quit"
                                title="Voltar" 
                                onClick={ () => handleCloseModal() }> 
                                  <i 
                                   className="fas fa-arrow-alt-circle-left" 
                                   style={{fontSize:'20px'}}>                                     
                                  </i>
                              </button>
                              
                              <button
                                className="delete"
                                type="button"
                                title="Deletar pergunta"                                
                                onClick={ () => handleDeleteQuestion() }>                                 
                                  <i className="far fa-trash-alt" 
                                    style={{fontSize:'20px'}}> 
                                  </i>                        
                              </button>                  
                            </div>       
                          </div>
                      </div>
                    </div>  
                    ) : ( null ) }                             
                </Question>
              </>
            );
          })}
        </div>
        <> <BackButton/> </>           
      </main>        
    </div>
  );
}
