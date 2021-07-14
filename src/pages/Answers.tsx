import { useHistory, useParams } from "react-router-dom";

import { Button } from "../components/Button";

import logoImg from "../assets/logo.svg";

// import answerImg from "../assets/answer.svg";

import deleteImg from "../assets/delete.svg";

// import CheckImg from "../assets/check.svg";

import { useRoom } from "../hooks/useRoom";

import { database } from "../services/firebase";
import { FormEvent, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";

import { RoomCode } from "../components/RoomCode";

import Skeleton from "react-loading-skeleton";

import Moment from "react-moment";
import "moment/locale/pt-br";

import "../styles/room.scss";
import "../styles/answers.scss";

type RoomParams = {
  id: string;
};

type QuestionId = {
  questionId: string;
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

  const { user, signInWithGoogle } = useAuth();

  // pegando parametro de rota.
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const paramsAnswer = useParams<QuestionId>();
  const questionId = paramsAnswer.questionId;  

  // hook
  useRoom(roomId);

  const [answered, setAnswered] = useState<string>();

  const [specificQuestion, setSpecificQuestion] = useState<specificQuestionsProps>(Object);

  useEffect( () => {
    getspecificQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, questionId]);

  function getspecificQuestion() {
    database
      .ref(`rooms/${roomId}/questions/${questionId}`)
      .on("value", (room) => {
        const questionObj = room.val();

        setSpecificQuestion(questionObj);
      });

    return () => {
      database.ref(`rooms/${roomId}/questions/${questionId}`).off("value");
    };
  }

  async function handleEndRoom() {
   await database.ref(`rooms/${roomId}`).update({ endedAt: new Date() });
    history.push("/");
  }

  async function handleAnswerQuestion( e: FormEvent, questionId: string ) {   
    e.preventDefault();

    if( answered?.trim() === '' ) {
      return;
    }
      await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
        answers: answered,
        isAnswered: true
      });
      setAnswered('');
    // history.push(`/admin/rooms/${roomId}`);
  }

  async function handleDeleteQuestion(questionId: string) {
    if ( window.confirm("Excluir sua pergunta?") ) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
       history.push(`/admin/rooms/${roomId}`);
    }
  }

  function convertFirstCharacterAllWordsToUppercase( item: string ) {
    return item.replace( /\b(\w)/g, string => string.toUpperCase() );
  }

  return (
    <div id="page-room">
      <header> 
          <div className="content">
            <img src={ logoImg } alt="askm" />
              <div>
                <RoomCode code={ roomId } />
                  <Button isOutLined onClick={ handleEndRoom }>
                    Encerrar Sala
                  </Button>
              </div>
          </div>
      </header>

      <div className="answer-container">
        <div className="answer-modal"> 
            <div className="answer-list">
              <p> { specificQuestion?.content || <Skeleton count={ 7 } height={ 25 } /> } </p>
              <footer>
                <div className="user-info">
                  {specificQuestion?.author?.avatar ? (
                  <img src={ `${specificQuestion?.author?.avatar}` } alt={ `${specificQuestion?.author?.name}`  } />  
                  ) : (
                     <Skeleton count={ 1 } height={ 35 } width={ 35 } circle={ true } /> 
                  )}

                  {specificQuestion?.author?.name ? (
                  <span> { convertFirstCharacterAllWordsToUppercase( `${specificQuestion?.author?.name}` ) },</span>
                  ) : (
                    <Skeleton count={ 1 } height={ 25 } width={ 250 } />
                  )}

                  {specificQuestion?.createdAt ? (                  
                  <span><Moment to={ specificQuestion.createdAt.toString() } />.</span>
                  ) : (
                     <Skeleton count={ 1 } height={ 25 } width={ 250 } /> 
                  )} 
                </div>  

                 { specificQuestion.content ? (
                    <button 
                      id="answer-delete-question"
                      type="button"
                      onClick={ () => handleDeleteQuestion( questionId ) }
                    >
                      <img src={deleteImg} alt="Deletar Pergunta" />
                    </button>
                  ) : (
                    <div /> 
                  )}     
              </footer>                         
            </div>

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

            {/* onSubmit={handleAnswerQuestion as any} */}
            <form>
             <textarea
                placeholder="Responder pergunta: "
                onChange={ (e) => setAnswered( e.target.value ) }
                value={ answered }
              />

              { user ? (
                <Button
                onClick={ (e) => handleAnswerQuestion( e, questionId ) }
                type="submit"
                disabled={ !user }
              >
                Enviar
               </Button>               
              ) : (
                <Skeleton 
                count={1}
                width={700} 
                height={50} 
                style={{margin: 'auto', display:'block'}} />
              )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Answers;
