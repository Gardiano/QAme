
import { useState, FormEvent } from "react";
import { Link, useParams, useHistory } from "react-router-dom";

import logoImg from "../assets/logo.svg";
import AnswerImg from '../assets/read.jpg';

import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";

import { database } from "../services/firebase";

import { Question } from "../components/Question";

import { useRoom } from "../hooks/useRoom";
import { useAuth } from "../hooks/useAuth";

import "../styles/room.scss";
import "../styles/responsiveness.scss";
import BackButton from "../components/backButton";

type RoomParams = {
  id: string;
}; 

// Entrando em sala criada.
export function Room() {
  const history = useHistory();

  const { user, signInWithGoogle } = useAuth();
  const [newQuestion, setNewQuestion] = useState("");

  // pegando parametro de rota.
  const params = useParams<RoomParams>();
  const roomId = params.id;

  // hook 
  const { title, questions } = useRoom( roomId );

  async function handleNoUserSignIn() {
    signInWithGoogle();
      history.push('/');
  }

  async function handleSendQuestion(e: FormEvent) {
    e.preventDefault();    

    if ( newQuestion.trim() === "" ) {
      return;
    }

    if ( !user ) {
      throw new Error("voce precisa estar logado para fazer uma pergunta");
    }

    const question = {
      content: newQuestion,

      author: {
        name: user.name,
        avatar: user.avatar,
      },

      isHighLighted: false,
      isAnswered: false,

      // criando data de cada pergunta.
      createdAt: Date(),

     answers: ''

    };

    await database.ref(`rooms/${roomId}/questions`).push(question);
    setNewQuestion('');
  }

  async function handleLikeQuestion( questionId: string, likeId: string | undefined ) {
    if ( likeId ) {
      await database.ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`).remove();
    } else {
      await database.ref(`rooms/${roomId}/questions/${questionId}/likes`).push({
        authorId: user?.id
      });
    }
  }

    // Array.Prototype.Capitalize - transformar todos os primeiros caracteres das palavras em letras maiusculas.
  function convertFirstCharacterAllWordsToUppercase( item: string ) {
    return item.replace( /\b(\w)/g, string => string.toUpperCase() );
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={ logoImg } alt="askm" />
          <RoomCode code={ roomId } />
        </div>
      </header>
      <main className="content">
        <div className="room-title">
          <h1> { title } </h1>
          { questions.length > 0 && <span>{ questions.length } Perguntas </span>}
        </div>
 
        <form onSubmit={ handleSendQuestion }>
          <textarea
            placeholder="O que voc?? quer perguntar?"
            onChange={ (e) => setNewQuestion( e.target.value ) }
            value={ newQuestion }
          />

          <div className="form-footer">
            { user ? (
              <div className="user-info">
                <img src={ user?.avatar } alt="avatar" />
                <span> { convertFirstCharacterAllWordsToUppercase( user?.name ) } </span>
              </div>
            ) : (
              <span>
                Para enviar uma pergunta,
                <button onClick={ handleNoUserSignIn }> fa??a seu login </button>.
              </span>
            )}

            <Button type="submit" disabled={ !user }>
              Enviar
            </Button>

          </div>
        </form>

        <div className="question-list">
          { questions.map( ( question ) => {
            return (
              <Question
                key={question.id}
                content={question.content} 
                author={question.author}
                isAnswered={question.isAnswered}
                isHighLighted={question.isHighLighted}
                createdAt={question.createdAt}
                answers={question.answers}
              >

                { question.isAnswered ? (
                  <>
                    <Link 
                      to={`/rooms/${roomId}/answer/${question.id}`}
                      type="button"
                      aria-label="Responder"
                      title="Ver Resposta"
                    >                  
                      {/* <svg name="Responder!" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" clipRule="evenodd" d="M12 17.9999H18C19.657 17.9999 21 16.6569 21 14.9999V6.99988C21 5.34288 19.657 3.99988 18 3.99988H6C4.343 3.99988 3 5.34288 3 6.99988V14.9999C3 16.6569 4.343 17.9999 6 17.9999H7.5V20.9999L12 17.9999Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg> */}

                      <img src={ AnswerImg } alt="Responder" width="25" height="25" />
                    </Link>

                    <button
                    className={`like-button ${question.likeId ? 'liked' : ''}`} 
                    type="button"
                    aria-label="Curtir"
                    title="Curtir"
                    onClick={ () => handleLikeQuestion( question.id, question.likeId ) }
                    >
                    { question.likeCount > 0 && <span> {question.likeCount} </span> }
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>

                    </button>
                  </>
                ) : (<div />)}  
               
                { !question.isAnswered && (  
                  <>    
                  <Link 
                      to={`/rooms/${roomId}/answer/${question.id}`}
                      type="button"
                      aria-label="Responder"
                      title="Responder"
                    >                  
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" clipRule="evenodd" d="M12 17.9999H18C19.657 17.9999 21 16.6569 21 14.9999V6.99988C21 5.34288 19.657 3.99988 18 3.99988H6C4.343 3.99988 3 5.34288 3 6.99988V14.9999C3 16.6569 4.343 17.9999 6 17.9999H7.5V20.9999L12 17.9999Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                  </Link>  

                  <button
                    className={`like-button ${question.likeId ? 'liked' : ''}`} 
                    type="button"
                    aria-label="Curtir"
                    title="Curtir"
                    onClick={ () => handleLikeQuestion( question.id, question.likeId ) }
                  >
                    { question.likeCount > 0 && <span> { question.likeCount } </span> }
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                  
                  </button>
                  </>
                )}
               </Question>
            );
          })}
        </div>
        <>
          <BackButton />
        </>
      </main>
    </div>
  );
}
