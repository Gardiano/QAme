
import { ButtonHTMLAttributes, useRef, useState, createContext, ReactNode } from 'react';

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
import useOnClickOutside from '../hooks/useOuterClick';

type RoomParams = {
  id: string;
};

type MenuMobileContextTypes = {  
  handleOpenMenuMobile: false
  setHandleOpenMenuMobile : React.Dispatch< React.SetStateAction <boolean > > 
  closeMenuMobile: () => void;
}

type menuMobileProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isOutLined?: boolean
  code: string 
  ref: any  
  children: ReactNode
  // (value: string) => void;
  // React.Dispatch< React.SetStateAction <boolean | undefined > > 

  // signOutUser: () => void
  // handleEndRoom: () => void
  // handleCloseMenuMobile: () => void;
};

// Criando Context
export const MenuMobileContext = createContext( {} as MenuMobileContextTypes );

export function MenuMobile ( props : menuMobileProps ) {
    
    const history = useHistory();
    const params = useParams<RoomParams>();
    const roomId = params.id;

    useRoom( roomId );

    // node do DOM
    const ref = useRef<HTMLDivElement>( null );

    const [ handleOpenMenuMobile, setHandleOpenMenuMobile ] = useState< menuMobileProps | any > ( false );

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
  
    function closeMenuMobile() {
   
      if( !handleOpenMenuMobile ) {        
        setHandleOpenMenuMobile( true ); 
        console.log('FECHOUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU');
      };
    };

    useOnClickOutside( ref, closeMenuMobile );

  return (
   <>
   { !handleOpenMenuMobile ? (
    <div className="menuMobileContainer">
      <nav className="menuMobileBox" ref={ref}>     
             <div className="menuMobileContent">
                  <div className="logoDiv" > 
                      <img src={ logoImg } alt="logo" />
                  </div>  
              
                  <strong> Chave De Acesso: </strong>
                  <div className="roomCodeButton">
                      <RoomCode code={ roomId } />
                  </div>

                  <strong> Encerrar Sala: </strong>
                  <Button className="endRoomButton" isOutLined onClick={ handleEndRoom }>                 
                      <img src={ endRoomImg } alt="endRoomFig" title="Encerrar Sala" />
                  </Button> 

                  <strong> Sair: </strong>
                  <Button className="signOutButton" isOutLined onClick={ signOutUser }>                 
                      <img  src={ signOutImg } alt="Deslogar" title="Encerrar sessão" />
                  </Button> 
             </div>   
                  <Button className="closeModalButton" onClick={ closeMenuMobile }>                 
                      <i className="far fa-window-close" title="Fechar Menu"> </i>
                  </Button>
      </nav>        
    </div>   
   ) : (    
      <div />
   )}  

      <MenuMobileContext.Provider value={{ 

        handleOpenMenuMobile,
        setHandleOpenMenuMobile,
        closeMenuMobile,      
      }}>            
        { props.children }
      </MenuMobileContext.Provider>

   </>

  );
};

export default MenuMobile;