
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { AdminRoom } from "./pages/AdminRoom";
import {Home} from "./pages/Home";
import {NewRoom} from "./pages/NewRoom";
import { Room } from "./pages/Room";

const Routes = () => (
  <BrowserRouter>
  {/* switch - nao permite que duas rotas iguais sejam chamadas ao mesmo tempo. */}
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/rooms/new" component={NewRoom} />
      <Route path="/rooms/:id" component={Room} />
      
      <Route path="/admin/rooms/:id" component={AdminRoom} />
      {/* rota para component answers */}
      {/* <Route path="/admin/rooms/:id/:questionId" component={answers} /> */}
    </Switch>
  </BrowserRouter>
);

export default Routes;