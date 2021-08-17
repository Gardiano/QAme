
import Routes from '../src/Routes';

import { AuthContextProvider } from './contexts/AuthContexts';

import { ModalContextProvider } from './contexts/ModalContext';

function App() {
  return (
    <div className="App">
      {/* acessando provider dos contexts  */}
      <AuthContextProvider>
        <ModalContextProvider>
          <Routes />
        </ModalContextProvider>        
      </AuthContextProvider>          
    </div>
  );
}

export default App;
