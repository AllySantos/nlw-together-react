
import { useNavigate, useParams } from "react-router-dom";

import logoImg from "../assets/images/logo.svg";
import deleteImg from "../assets/images/delete.svg";
import answerImg from "../assets/images/answer.svg";

import { ref, remove, update } from "firebase/database";

import { database } from "../services/firebase";
import { Button } from "../components/Button";
import { Question } from "../components/Question";
import { RoomCode } from "../components/RoomCode";
import { useRoom } from "../hooks/useRoom";

import "../styles/room.scss";




type RoomParams = {
  id: string;
};

export function AdminRoom() {
  const { id } = useParams<RoomParams>();

  const navigate = useNavigate();
 
  const {questions, title} = useRoom(id!);

  async function handleEndRoom(){
    const roomRef = await ref(database, `rooms/${id}`)

    update(roomRef, {
      endedAt: new Date(),
    })
    navigate('/')
  }

  async function handleDeleteQuestion(questionId: string){

    if(window.confirm("Você tem certeza que deseja excluir essa pergunta?")){
      const questionRef = await ref(database, `rooms/${id}/questions/${questionId}`)

      remove(questionRef)

    }  
  }

  async function handleCheckQuestionAsAnswered(questionId: string){
    const questionRef = await ref(database, `rooms/${id}/questions/${questionId}`)

    update(questionRef, { isAnswered: true })
  }

  async function handleHighlightQuestion(questionId: string, questionHilighted: boolean){

    const questionRef = await ref(database, `rooms/${id}/questions/${questionId}`)
    
    update(questionRef, { isHighlighted: !questionHilighted })

    

  }
 
  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />


          <div>
          <RoomCode code={id} />
          <Button isOutlined onClick={() => handleEndRoom()}>Encerrar sala</Button>
          </div>

        </div>
      </header>

      <main className="content">
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} perguntas</span>}
        </div>


        <div className="question-list">
          {questions.map((question) => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >



              {
                !question.isAnswered && (
                  <>

                      <button
                        type="button"
                        onClick={() => handleHighlightQuestion(question.id, question.isHighlighted)}
                        className="highlight"
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12.0003" cy="11.9998" r="9.00375" stroke="#737380" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M8.44287 12.3391L10.6108 14.507L10.5968 14.493L15.4878 9.60193" stroke="#737380" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>

                      </button>
                      <button
                        type="button"
                        onClick={() => handleCheckQuestionAsAnswered(question.id)}
                      >
                        <img src={answerImg} alt="Tag question as answered" />
                      </button>

                     
                  </>
                )

              }

                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Delete question" />
                </button>
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  );
}
