

import { useHistory } from "react-router-dom";

import '../styles/backButton.scss';
export function BackButton () {

  const history = useHistory();

  return (
      <button      
        className="goBack"
        title="Voltar"
        onClick={ () => history.goBack() }
       > 
          <i className="far fa-hand-point-left"> </i>
      </button>
  );
};

export default BackButton;