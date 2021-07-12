

import { createContext } from 'react';

import Routes from '../src/Routes';

import { AuthContextProvider } from './contexts/AuthContexts';

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

// criando context
export const AuthContext = createContext( {} as AuthContextTypes );

function App() {
  return (
    <div className="App">
      {/* acessando provider do context  */}
      <AuthContextProvider>
        <Routes />
      </AuthContextProvider>
          
    </div>
  );
}

export default App;
