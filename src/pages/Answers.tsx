import { Link, useHistory, useParams } from "react-router-dom";

import { Button } from "../components/Button";

import logoImg from "../assets/logo.svg";

import answerImg from "../assets/answer.svg";

import deleteImg from "../assets/delete.svg";

import CheckImg from "../assets/check.svg";

import { useRoom } from "../hooks/useRoom";


import { database } from "../services/firebase";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";

import { RoomCode } from "../components/RoomCode";

import "../styles/room.scss";

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

  const { user } = useAuth();

  // pegando parametro de rota.
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const paramsAnswer = useParams<QuestionId>();
  const questionId = paramsAnswer.questionId;

  // hook
  useRoom(roomId);

  const [answered, setAnswered] = useState<string>();

  const [specificQuestion, setSpecificQuestion] =
    useState<specificQuestionsProps>(Object);

  useEffect(() => {
    getspecificQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, questionId]);

  async function getspecificQuestion() {
    // console.log("Q-ID", questionId);
    await database
      .ref(`rooms/${roomId}/questions/${questionId}`)
      .on("value", (room) => {
        const questionObj = room.val();

        setSpecificQuestion(questionObj);
      });

    return () => {
      database.ref(`rooms/${roomId}/questions/${questionId}`).off("value");
    };
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm("Excluir sua pergunta?")) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });
  }

  async function handleEndRoom() {
    database.ref(`rooms/${roomId}`).update({ endedAt: new Date() });
    history.push("/");
  }

  async function handleAnswerQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      answers: answered,
    });
  }

  // async function handleHighLightedQuestion(questionId: string) {
  //   await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
  //     isHighLighted: true,
  //   });
  // }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={ logoImg } alt="askm" />
          <div>
            <RoomCode code={ roomId } />
            <Button isOutLined onClick={handleEndRoom}>
              Encerrar Sala
            </Button>
          </div>
        </div>
      </header>

      <main className="content">
       
          { !specificQuestion.isAnswered && (
            <>
              <button
                type="button"
                onClick={ () => handleCheckQuestionAsAnswered(questionId) }
              >
                <img src={ CheckImg } alt="Marcar Pergunta" />
              </button>

              {/* <button
                        name="DarDestaque"
                        type="button"
                        onClick={ () => handleHighLightedQuestion(question.id) }
                      >
                        <img src={answerImg} alt="Dar Destaque" />
                      </button> */}

              <Link to={`/admin/rooms/${roomId}/answer/${questionId}`}>
                <img src={ answerImg } alt="Responder Pergunta" />
              </Link>
            </>
          )}

                {/* <button
                    type="button"
                    onClick={() => handleAnswerQuestion(question.id)}
                  >
                    <img src={answerImg} alt="Deletar Pergunta" />
                  </button> */}
          <button
            type="button"
            onClick={ () => handleDeleteQuestion(questionId) }
          >
            <img src={ deleteImg } alt="Deletar Pergunta" />
          </button>          
       
      </main>

      <div className="answer-container">
        <div className="answer-modal">
          <div className="question-list"></div>
          {/* onSubmit={handleAnswerQuestion as any} */}
          <form>
            <textarea
              placeholder="Responder pergunta: "
              onChange={ (e) => setAnswered(e.target.value) }
              value={ answered }
            />

            <h1> val: { specificQuestion?.content } </h1>

            <Button
              onClick={ () => handleAnswerQuestion( questionId ) }
              type="submit"
              disabled={ !user }
            >
              Enviar
            </Button>

            {/* <div className="form-footer">
              { user ? (
                <div className="user-info">
                  <img src={user?.avatar} alt="avatar" />
                  <span> {  } </span>
                </div>
              ) : (
                <span>
                  Para enviar uma pergunta,
                  <button onClick={ signInWithGoogle }> faça seu login </button>.
                </span>
              )}                
            </div> */}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Answers;
