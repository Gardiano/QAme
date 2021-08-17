
import { ReactNode } from "react";
import { Ref } from "react";

import { useHistory, useParams } from "react-router-dom";

import fig from '../assets/empty-questions.svg';
import deleteFig from '../assets/delete.svg';

import { useRoom } from "../hooks/useRoom";
import { database } from "../services/firebase";

import { useModal } from "../hooks/useModal";

import '../styles/modal.scss';
import { useEffect } from "react";
import { useState } from "react";

type modalProps = {  
    children: ReactNode

    // adicionando node ao parametro do component
    reff: Ref<HTMLDivElement>
  };

  type RoomParams = {
    id: string;
  };

export function Modal( { reff, children } : modalProps) {

  const history = useHistory();

  // pegando parametro de rota.
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const { isTrue, handleCloseModal } = useModal();

  const [answerId, setAnswerId] = useState('');

  const { questions } = useRoom( roomId );

  async function handleDeleteQuestion( questionId: string ) {
    if ( window.confirm( " Excluir sua pergunta? " ) ) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
      history.push(`/admin/rooms/${roomId}`);
    }    
  }

  return (
    <>   
      {isTrue === true ? (
        <div id="modalContainer">
        <div className="modal" ref={ reff }>            
            <div className="separatorDiv">
                <img id="separatorFig" src={ fig } alt="" title="fig" />

                <div className="modalContent">                       
                  <p> Tem certeza que deseja deletar essa pergunta ? </p>
                </div>
                
                <div className="modalButtons">                 
                  <button className="quit"  onClick={ () => handleCloseModal() }> Voltar </button>
                  <button onClick={() => handleDeleteQuestion( answerId )}> del </button>

                    {/* { questions.map( ( question ) => {
                      return (
                        <>
                         <button className="delete" onClick={ () => handleDeleteQuestion( question.id ) }> 
                           <img src={ deleteFig } alt="" title="delete" /> 
                         </button>
                        </>
                      )
                    })} */}
                    
                </div>       
            </div>
         </div>
           <> { children } </>
       </div>  
      ) : (<div>teste!</div>)}
    </>
  );
};

export default Modal;