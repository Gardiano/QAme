
import {ReactNode} from 'react';

import cx from 'classnames';

import '../styles/question.scss';

type QuestionProps = {  
  content: string;
  
  author: {
    name: string
    avatar: string
  }
  
  children?: ReactNode;
  isAnswered?: boolean;
  isHighLighted?: boolean; 

  createdAt: Date;

  answers: string | undefined
};

export function Question({ 
   content,
   author,
   answers,
   createdAt,
   isAnswered = false, 
   isHighLighted = false,  
   children } : QuestionProps) {   
    // Array.Prototype.Capitalize - transformar todos os primeiros caracteres das palavras em letras maiusculas.
   function convertFirstCharacterAllWordsToUppercase(item: string) {
      return item?.replace( /\b(\w)/g, string => string?.toUpperCase() );
   }
   
  return (  
    <div 
    className={cx('question',
    { answered: isAnswered },
    { highlighted: isHighLighted && !isAnswered },
    )}
  >
      <p> {content} </p>
      <footer>
        <div className="user-info">
          <img src={author?.avatar} alt={author?.name} />          
          <span> { convertFirstCharacterAllWordsToUppercase(author?.name) } </span>
          <span> { createdAt } </span>
         {/* <p> { answers.answer } </p> */}
        </div>

        <div>            
          { children }
        </div>
      </footer>
    </div>
  );
}
