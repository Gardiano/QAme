import copyImg from "../assets/copy.svg";
import "../styles/room-code.scss";

type clipBoardProps = {
    code: string;
}

export function RoomCode(props: clipBoardProps) {

    // pegando id da sala para o clipboard.
    function copyRoomCodeToClipboard() {
        navigator.clipboard.writeText(props.code);
        console.log(props.code)
    }

  return (
    <button className="room-code" onClick={copyRoomCodeToClipboard}>
      <div>
        <img src={copyImg} alt="code" />        
      </div>
      <span>SALA: {props.code} </span>
    </button>
  );
}
