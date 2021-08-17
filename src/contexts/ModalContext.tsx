
import { ReactNode, useState } from "react";
import { createContext } from 'react';
  
  type ModalContextTypes = {
    isTrue: boolean    
    setIsTrue: React.Dispatch<React.SetStateAction<boolean>>   
    handleOpenModal:  ( id:string ) => void
    handleCloseModal: () => void
  }

  type ModalContextProviderTypes = {
      children: ReactNode   
  }  

// Criando Context
export const ModalContext = createContext( {} as ModalContextTypes );

// Exportando provider do context
export function ModalContextProvider( props: ModalContextProviderTypes ) {
  // Modal state;
  const [ isTrue, setIsTrue ] = useState<boolean>( false );

  // Gerenciamento de state do Modal
  function handleOpenModal(id: string) {
    if ( isTrue === false ) {  
      id = '';
      setIsTrue( true );
      return;
    }     
  };
   
  // Gerenciamento de state do Modal
  function handleCloseModal() {  
    if ( isTrue === true ) {    
      setIsTrue( false ); 
      console.log( 'false', isTrue );
      return;
    }    
  };
    
    return (
        <ModalContext.Provider value={ { isTrue, setIsTrue, handleOpenModal, handleCloseModal} }>            
            { props.children }
        </ModalContext.Provider>
    );
};