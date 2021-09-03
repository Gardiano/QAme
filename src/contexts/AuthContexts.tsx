
import { ReactNode, useEffect, useState } from "react";
import { createContext } from 'react';
import { auth, firebase } from "../services/firebase";

type UserProps = {
    id: string
    name: string
    avatar: string
  }
  
  type AuthContextTypes = {
    user: UserProps | undefined
    // void =  '() => função sem retorno;'
    signInWithGoogle: () => Promise<void>
  }

  type AuthContextProviderProps = {
      children: ReactNode
  }  

//   Criando Context
export const AuthContext = createContext( {} as AuthContextTypes );

// Exportando provider do context
export function AuthContextProvider( props: AuthContextProviderProps ) {

    const [ user, setUser ] = useState<UserProps>();

    // salvando dados de usuario após login;
    useEffect( () => {
      // onAuthStateChanged = listener para verificar se tem usuario logado;
     const unsubscribe = auth.onAuthStateChanged( user => {
        if( user ) {
            // info do usuário;
            const { displayName, photoURL, uid } = user;
  
            if( !displayName || !photoURL ) {
              throw new Error( 'Falta de informações da sua Google Account!' );
            } else {
              setUser({ 
                id: uid,
                name: displayName, 
                avatar: photoURL
              });
            }
        }
      });
  
      // parar o listener
      return () => {
        unsubscribe();
      }
  
    } ,[]);
  
    async function signInWithGoogle() {
      const provider = new firebase.auth.GoogleAuthProvider();
      
      const res = await auth.signInWithPopup(provider);
  
          if( res.user ) {
            // info do usuário;
            const { displayName, photoURL, uid } = res.user;
  
            if( !displayName || !photoURL ) {
              throw new Error( 'Falta de informações da sua Google Account!' );
            } else {
              setUser({ 
                id: uid,
                name: displayName, 
                avatar: photoURL
              });
            }

          };
  }
    
    return (
      <AuthContext.Provider value={ {  user, signInWithGoogle } }>            
          { props.children }
      </AuthContext.Provider>
    );
};