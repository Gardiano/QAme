
import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

export function useRoom(roomId: string) {

    // Record = object.entries - firebase object type.
    type FirebaseQuestions = Record<string, {      
    author: {
      name: string;
      avatar: string;
    }

      content: string;
      isAnswered: boolean;
      isHighLighted: boolean;

      createdAt: Date;

      likes: Record<string, {
        authorId:string;
      }>

      answers: string;
  }>

    type QuestionProps = {
        id: string;

        author: {
          name: string;
          avatar: string;
        }

        content: string;        

        isAnswered: boolean;
        isHighLighted: boolean;

        createdAt: Date;
        
        likeCount:  number;
        likeId:  string | undefined;

        answers: string;
    }

    const { user } = useAuth();
    const [ questions, setQuestions ] = useState<QuestionProps[]>([]);
    const [ title, setTitle ] = useState('');

    useEffect( () => {
        const roomRef = database.ref( `rooms/${roomId}` );
    
        // Object.entries = retorna um array com propriedade e valor da propriedade.
        roomRef.on("value", (room) => {
          const databaseRoom = room.val();
          const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};
    
          const parsedQuestions = Object.entries( firebaseQuestions ).map(
            ( [key, value] ) => {
              return {
                id: key,
                content: value.content,
                author: value.author,
                isHighLighted: value.isHighLighted,
                isAnswered: value.isAnswered,
                createdAt: value.createdAt,  
                answers: value.answers,
                likeCount: Object.values( value.likes ?? {} ).length,
                likeId: Object.entries( value.likes ?? {} ).find( ( [key, like] ) => like.authorId === user?.id )?.[0],
              };
            }
          );

          setTitle( databaseRoom.title );
          setQuestions( parsedQuestions );         
        });

        return () => {
          roomRef.off( 'value' );
        };
        
      }, [ roomId, user?.id ] );

      return { questions, title };
}