
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { AdminRoom } from "./pages/AdminRoom";
import { Answers } from "./pages/Answers";
import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";
import { Room } from "./pages/Room";

import { MenuMobile } from "./components/menuMobile";

const Routes = () => (
  <BrowserRouter>
  {/* switch - nao permite que duas rotas iguais sejam chamadas ao mesmo tempo. */}
    <Switch>
      <Route exact path="/" component={ Home } />
      
      <Route exact path="/rooms/new" component={ NewRoom } />

      <Route exact path="/rooms/:id" component={ Room } />
      
      <Route exact path="/admin/rooms/:id" component={ AdminRoom } />

      {/* <Route exact path="/admin/rooms/:id/answer/:questionId" component={ Answers } />  */}
      
      <Route exact path="/admin/rooms/:id/answer/:questionId" component={ MenuMobile } /> 
      
      <Route exact path="/rooms/:id/answer/:questionId" component={ Answers } />      
    </Switch>
  </BrowserRouter>
);

export default Routes;