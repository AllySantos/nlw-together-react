
import { useNavigate, useParams } from "react-router-dom";

import logoImg from "../assets/images/logo.svg";
import deleteImg from "../assets/images/delete.svg";

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
              >

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
