
import { ReactNode, RefAttributes, useRef, useState } from "react";
import { Ref } from "react";

import { useHistory, useParams } from "react-router-dom";

import fig from '../assets/empty-questions.svg';
import deleteFig from '../assets/delete.svg';

import { useRoom } from "../hooks/useRoom";
import { database } from "../services/firebase";

import '../styles/modal.scss';

import useOnClickOutside from "../hooks/useOuterClick";

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

  // hook
  const { questions } = useRoom(roomId);

  async function handleDeleteQuestion( questionId: string ) {
    if ( window.confirm( " Excluir sua pergunta? " ) ) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
      history.push(`/admin/rooms/${roomId}`);
    }    
  }

  return (
       <div id="modalContainer">
        <div className="modal" ref={reff}>            
            <div className="separatorDiv">
                <img id="separatorFig" src={ fig } alt="" title="fig" />   

                <div className="modalContent">                       
                  <p> Tem certeza que deseja deletar essa pergunta ? </p>
                </div>
                
                <div className="modalButtons">                 
                  <div className="quit"> Voltar </div>
                    { questions.map( ( question ) => {
                      return (
                        <>
                        <button className="delete" onClick={ () => handleDeleteQuestion( question.id ) }> 
                          <img src={ deleteFig } alt="" title="delete" /> 
                        </button>
                        </>
                      )
                    })}
                </div>       
            </div>
        </div>
         <> { children } </>
     </div>
  );
};

export default Modal;