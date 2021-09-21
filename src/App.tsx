
import Routes from '../src/Routes';

import { AuthContextProvider } from './contexts/AuthContexts';

function App() {
  return (
    <div className="App">
      {/* acessando provider dos contexts  */}
      <AuthContextProvider>
        <Routes />      
      </AuthContextProvider>          
    </div>
  );
}

export default App;
