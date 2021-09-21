
import { ButtonHTMLAttributes } from 'react';

import { useHistory, useParams } from "react-router-dom";

import { auth, database } from '../services/firebase';

import { useRoom } from '../hooks/useRoom';

import { RoomCode } from '../components/RoomCode';

import { Button } from './Button';

import logoImg from "../assets/logo.svg";
import endRoomImg from '../assets/endRoom.png';
import signOutImg from '../assets/end.png';

import '../styles/button.scss';

import '../styles/menuMobile.scss';



type menuMobileProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isOutLined?: boolean
  code: string
};

type RoomParams = {
    id: string;
};

export function MenuMobile ( { isOutLined = false, ...props } : menuMobileProps ) {

    const history = useHistory();

    const params = useParams<RoomParams>();
    const roomId = params.id;

    useRoom( roomId );

    async function signOutUser() {
        try {
         await auth.signOut();
          history.push('/');
        } catch ( err: any ) {
          console.log( err );
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

  return (
      <div className="menuMobileContainer">
        <nav className="menuMobileBox">
            <div className="logoDiv" > 
                <img src={ logoImg } alt="logo" /> 
            </div>  

            <div className="roomCodeDiv">
                <div>
                <strong> Chave De Acesso </strong>
                    <RoomCode code={ roomId } />
                </div>               
            </div>

            <div className="endRoomDiv">
                <strong> Encerrar sala </strong>
                <Button className="endRoomButton" isOutLined onClick={ handleEndRoom }>                 
                    <img src={ endRoomImg } alt="endRoomFig" title="Encerrar Sala" />
                </Button> 
            </div>

            <div className="signOutDiv">
                <strong> Sair </strong>
                <Button className="signOutButton" isOutLined onClick={ signOutUser }>                 
                    <img  src={ signOutImg } alt="Deslogar" title="Encerrar sessão" />
                </Button> 
            </div>
        </nav>
      </div>
  );
};

export default MenuMobile;