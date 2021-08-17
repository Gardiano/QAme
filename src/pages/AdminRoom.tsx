
import { useEffect } from "react";
import { useRef } from "react";
import { Link, useHistory, useParams } from "react-router-dom";

import CheckImg from "../assets/check.svg";
import answerImg from "../assets/answer.svg";
import logoImg from "../assets/logo.svg";
import deleteImg from "../assets/delete.svg";
import endImg from "../assets/end.png";
// import fig from '../assets/empty-questions.svg';

import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";
import { Question } from "../components/Question";
import BackButton from "../components/backButton";

// import { useAuth } from "../hooks/useAuth";
import { useRoom } from "../hooks/useRoom";

import { database } from "../services/firebase";

import useOnClickOutside from "../hooks/useOuterClick";

import "../styles/room.scss";
import "../styles/responsiveness.scss";
import "../styles/modal.scss";

import Modal from "../components/modal";
import { useModal } from "../hooks/useModal";

type RoomParams = {
  id: string;
};

// Entrando em sala criada;
export function AdminRoom() {
  const history = useHistory();

  // Hooks chamando Contexts;
  // const { user, signInWithGoogle } = useAuth();
  const { isTrue, handleOpenModal, handleCloseModal } = useModal();

  // pegando parametro de rota;
  const params = useParams<RoomParams>();
  const roomId = params.id;

  // node do DOM
  const ref = useRef<HTMLDivElement>(null);

  // hook
  const { title, questions } = useRoom( roomId );

  useEffect( () => {

  }, [ roomId ] );

  async function handleEndRoom() {
    database.ref(`rooms/${roomId}`).update({ endedAt: new Date() });
    history.push("/");
  }


  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });
  }

  // async function handleAnswerQuestion(questionId: string) {
  //   await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
  //     answers: answered,
  //   });
  // }

  async function handleHighLightedQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighLighted: true,
    });
  }

  // inserindo hook no DOM
  useOnClickOutside( ref, handleCloseModal );

  return (   
 <div id="page-room">
    { isTrue === true && <Modal children reff={ ref } /> }
      <header>
        <div className="content">
          <img src={ logoImg } alt="askm" />
            <div>
              <RoomCode code={ roomId } />
                <Button isOutLined onClick={ handleEndRoom }>
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
          { questions.map( (question) => {
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
                { question.isAnswered === true ? (
                  <>                    
                    <Link to={`/admin/rooms/${roomId}/answer/${question.id}`} >
                      <img src={ answerImg } alt="Responder Pergunta" />
                    </Link>

                    <button type="button"
                      onClick={ () => handleOpenModal(question.id) }>
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
                      <img src={answerImg} alt="Responder Pergunta" />
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
