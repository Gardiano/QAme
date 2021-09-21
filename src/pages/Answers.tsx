import { useEffect, FormEvent, useRef, useState } from "react";

import { useHistory, useParams } from "react-router-dom";

import { auth, database } from "../services/firebase";

import logoImg from "../assets/logo.svg";
// import answerImg from "../assets/answer.svg";
import deleteImg from "../assets/delete.svg";
import signOutImg from "../assets/end.png";
import fig from '../assets/empty-questions.svg';
import endRoomImg from '../assets/endRoom.png';
// import CheckImg from "../assets/check.svg";
// import answerFig from '../assets/ansFig.png';
// import interrogation from '../assets/inte.png';

import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";
import BackButton from "../components/backButton";


import { useRoom } from "../hooks/useRoom";
import { useAuth } from "../hooks/useAuth";

import useOnClickOutside from "../hooks/useOuterClick";

import Skeleton from "react-loading-skeleton";

import Moment from "react-moment";
import "moment/locale/pt-br";

import "../styles/room.scss";

import "../styles/answers.scss";

import "../styles/modal.scss";

import "../styles/responsiveness.scss";

type RoomParams = {
  id: string
  questionId: string
};

type specificQuestionsProps = {
  id: string;

  author: {
    name: string;
    avatar: string;
  };

  content: string;

  isAnswered: boolean;
  isHighLighted: boolean;

  createdAt: Date;

  likeCount: number;
  likeId: string | undefined;

  answers: string;
};

export function Answers() {
  const history = useHistory();
  
  // pegando parametro de rota.
  const params = useParams<RoomParams>();
  const roomId = params.id;
  
  const paramsAnswer = useParams<RoomParams>();
  const questionId = paramsAnswer.questionId;

  const ref = useRef<HTMLDivElement>( null );

  const { user, signInWithGoogle } = useAuth();

  const [ isTrue, setIsTrue ] = useState<boolean>( false );

  const [ isSelectedAnswer, setSelectedAnswer ] = useState<boolean>( false );

  const [ answered, setAnswered ] = useState<string>();

  const [ specificQuestion, setSpecificQuestion ] = useState<specificQuestionsProps>(Object);

   // hook
  useRoom( roomId );

  useEffect( () => {
   getspecificQuestion(); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ roomId, questionId ] );

 function getspecificQuestion() {  
     database.ref(`rooms/${roomId}/questions/${questionId}`)
      .on( 'value', ( room ) => {
        const questionObj = room.val();

        setSpecificQuestion( questionObj );  
      });

      return () => {
        database.ref(`rooms/${roomId}/questions/${questionId}`).off('value');
      }
    
  }

  async function handleEndRoom() {
   try {
      await database.ref(`rooms/${roomId}`).update( { endedAt: new Date() } );
       history.push('/');
   } catch( error: any ) {
    console.log( error );
   }
  }

  async function handleAnswerQuestion( e: FormEvent, questionId: string ) {   
    e.preventDefault();
    try {
      if( answered?.trim() === '' ) {
        return;
      }
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
          answers: answered,
          isAnswered: true
        });
        setAnswered('');
    }
    catch( error : any ) {
      console.log( error );
    }
  }

  async function handleDeleteQuestion( questionId: string ) {    
    try {
      if ( window.confirm( " Excluir essa pergunta? " ) ) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
         history.push(`/admin/rooms/${roomId}`);
      }
    } catch( error: any ) {
      console.log( error );
    }
  }

  async function handleDeleteAnswer( questionId: string ) {
    try {
      await database.ref(`rooms/${roomId}/questions/${questionId}/answers`).remove();
      handleCloseAnswerModal();
    } catch( error: any ) {
      console.log( error );
    }
  }

  function convertFirstCharacterAllWordsToUppercase( item: string ) {
    return item.replace( /\b(\w)/g, string => string.toUpperCase() );
  }

  function handleOpenModal() {
    if ( isTrue === false ) {
      setIsTrue( true );
    }     
  }

  function handleCloseModal() {  
    if ( isTrue === true ) {    
      setIsTrue( false );
    }    
  }

  function handleOpenAnswerModal() {
    if ( isSelectedAnswer === false ) {  
      setSelectedAnswer( true );
    } 
  }

  function handleCloseAnswerModal() {
    if ( isSelectedAnswer === true ) {  
      setSelectedAnswer( false );
    }   
  }

  async function signOutUser() {
    try {
     await auth.signOut();
        history.push('/');
    } catch( err: any ) {
        console.log( 'n deslogou' );
    }
  }

  // inserindo Hook do OutClick no DOM
  // Close Question Modal
  useOnClickOutside( ref, handleCloseModal );

  // Close Answer modal
  useOnClickOutside( ref, handleCloseAnswerModal );

  return (  
  <>   
    <div id="page-room">
      {/* Modal question */}
      { isTrue === true ? (
        <div id="modalContainer">
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
                    onClick={ () => handleDeleteQuestion( questionId ) }>                                 
                      <i className="far fa-trash-alt" 
                        style={{fontSize:'20px'}}> 
                      </i>                        
                  </button>                  
                </div>       
              </div>
          </div>
        </div>  
      ) : ( null ) }

       {/* Modal Answers */}
      { isSelectedAnswer === true ? (
        <div id="modalContainer">
          <div className="modal" ref={ ref }>            
              <div className="separatorDiv">
                <img id="separatorFig" src={ fig } alt="" title="fig" />

                <div className="modalContent">                       
                  <p> Tem certeza que deseja deletar essa resposta ? </p>
                </div>
                
                <div className="modalButtons">  
                  <button 
                    className="quit"
                    title="Voltar" 
                    onClick={ () => handleCloseAnswerModal() }> 
                      <i 
                        className="fas fa-arrow-alt-circle-left" 
                        style={{fontSize:'20px'}}>                                     
                      </i>
                  </button>
                  
                  <button
                    className="delete"
                    type="button"
                    title="Deletar pergunta"                                
                    onClick={ () => handleDeleteAnswer( questionId ) }>                                 
                      <i className="far fa-trash-alt" 
                        style={{fontSize:'20px'}}> 
                      </i>                        
                  </button>                  
                </div>       
              </div>
          </div>
        </div>  
      ) : ( null ) }

      <header> 
          <div className="content">
            <img src={ logoImg } alt="askm" />
              <div>
                <RoomCode code={ roomId } />
                  <Button isOutLined onClick={ handleEndRoom }>                 
                    <img src={ endRoomImg } alt="endRoomFig" title="Encerrar Sala" />
                  </Button>

                  <Button isOutLined onClick={ signOutUser }>                 
                    <img className="endRoomImg" src={ signOutImg } alt="Deslogar" title="Encerrar sessão" />
                  </Button>                  
              </div>
          </div>
      </header>

      <div className="answer-container">
        <div className="answer-modal"> 
            <div className="question-list">
                <p> { specificQuestion?.content || <Skeleton count={ 7 } height={ 25 } /> } </p>
              <footer>
                <div className="user-info">
                  { specificQuestion?.author?.avatar ? (
                    <img src={ `${ specificQuestion?.author?.avatar }` } alt={ `${specificQuestion?.author?.name}`  } />  
                  ) : (
                     <Skeleton count={ 1 } height={ 35 } width={ 35 } circle={ true } /> 
                  )}

                  { specificQuestion?.author?.name ? (
                    <span> { convertFirstCharacterAllWordsToUppercase( `${specificQuestion?.author?.name}` ) },</span>
                  ) : (
                    <Skeleton count={ 1 } height={ 25 } width={ 250 } />
                  )}

                  { specificQuestion?.createdAt ? (                  
                    <span> <Moment to={ specificQuestion.createdAt.toString() } />.</span>
                  ) : (
                     <Skeleton count={ 1 } height={ 25 } width={ 250 } />
                  )} 
                </div>

                 { specificQuestion?.content ? (
                    <>
                      { specificQuestion.author.name === user?.name ? (
                      <button 
                         id="answer-delete-question"
                         type="button"
                         onClick={ () => handleOpenModal( ) }
                       >
                         <img src={ deleteImg } alt="Deletar Pergunta" />
                       </button>
                      ) : (
                        <div />)} 
                    </>
                  ) : (
                    <div /> 
                  )}
              </footer>       
            </div>            
           
            { specificQuestion?.answers ? (
                <div className="answer-list">
                  { specificQuestion?.answers !== '' ? (
                    <p> { specificQuestion?.answers } </p>
                  ) : (
                    <div />
                  )}
                  
                  <footer>                   
                    { specificQuestion?.answers !== '' ? (                      
                      <>
                      { specificQuestion?.author?.name === user?.name ? (
                        <button 
                          id="answer-delete-question"
                          type="button"
                          onClick={ () => handleOpenAnswerModal() }
                        >
                          <img src={ deleteImg } alt="Deletar Pergunta" /> 
                        </button>
                      ) : (<div />)}
                      </>
                      ) : (
                        <div /> 
                      )}     
                  </footer>                         
                </div>
              ) : (
                <div />
            )}

            <div className="answer-footer">
              { user ? (
                <div />
              ) : (
                <span>                      
                  <button onClick={ signInWithGoogle }>
                      <span> Para fazer uma pergunta, faça seu login. </span>
                  </button>
                </span>
              )}                
            </div>  

            { specificQuestion?.author?.name === user?.name ? (
              <form>
                <textarea
                  placeholder="Responder pergunta: "
                  onChange={ (e) => setAnswered( e.target.value ) }
                  value={ answered }
                />
  
                { user ? (
                 <>
                 { answered ? (
                  <Button
                      onClick={ (e) => handleAnswerQuestion( e, questionId ) }
                      type="submit"
                      disabled={ !user }
                    >
                    Enviar
                  </Button> 
                  ) : (
                    <Button                      
                      type="submit"
                      disabled
                    >
                    Enviar
                  </Button>)}
                 </>              
                ) : (
                  <Skeleton 
                  count={1}
                  width={700} 
                  height={50} 
                  style={{margin: 'auto', display:'block'}} />
                )}
              </form>
            ) : ( <div />)}
        </div>
      </div>
      <> <BackButton /> </>
    </div>
  </>
  );
}

export default Answers;
