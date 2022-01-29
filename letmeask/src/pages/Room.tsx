import { onValue, push, ref, set } from 'firebase/database';
import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'

import logoImg from '../assets/images/logo.svg'

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';

import '../styles/room.scss'

type FirebaseQuestions = Record<string, {
  author: {
    name:string,
    avatar: string
  },
  content: string,
  isHighlighted:boolean,
  isAnswered: boolean,
}>

type Question = {
  id: string,
  author: {
    name:string,
    avatar: string
  },
  content: string,
  isHighlighted:boolean,
  isAnswered: boolean,
}

type RoomParams = {
  id: string;
}

export function Room() {

  const {user} = useAuth();
  const { id } = useParams<RoomParams>();

  const [newQuestion, setNewQuestion] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [title, setTitle] = useState('')


  useEffect(() => {
    const roomRef = ref(database, `rooms/${id}`);

    onValue(roomRef, (room) => {
      const databaseRoom = room.val()
      const firebaseQuestions : FirebaseQuestions = databaseRoom.questions

      const parsedQueston = Object.entries(firebaseQuestions ?? {} ).map(([key, value]) => {

        return { 
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered,
        }
      })

      setTitle(databaseRoom.title)
      setQuestions(parsedQueston)
    })

  }, [id])


  async function handleSendQuestion(event: FormEvent) {

    event.preventDefault();

    if(newQuestion.trim() === ''){
      return;
    }

    if(!user){
      //TODO: erro e afins

      throw new Error('You must be logged in')
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar
      },
      isHighlighted: false,
      isAnswered: false
    }

    const questionRef = ref(database, `rooms/${id}/questions`)

    const firebaseQuestion = await push(questionRef)
    
    set(firebaseQuestion, question)


    setNewQuestion('')
  }

  return (
  
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />

         <RoomCode code={id}/>
        </div>
      </header>


      <main className="content">
        <div className="room-title">
          <h1>Sala {title}</h1>
          { questions.length > 0 && <span>{questions.length} perguntas</span>}
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea 
            placeholder="O que você quer perguntar?"
            onChange={event => setNewQuestion(event.target.value)}
            value={newQuestion}
            
            />

          <div className="form-footer">

            { user ? (
              <div className="user-info">
                <img src={user.avatar} alt="Avatar" />
                <span>{user.name}</span>
              </div>

            ) : (
              <span>Para enviar uma pergunta <button>Faça seu login</button></span>
            ) }
            <Button type="submit" disabled={!user}>Enviar Pergunta</Button>
          </div>
        </form>

        {JSON.stringify(questions)}
      </main>
    </div>
   )
};