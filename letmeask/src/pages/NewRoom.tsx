import { push, ref, set } from 'firebase/database';
import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'

import illustrationSvg from "../assets/images/illustration.svg";
import logoSvg from "../assets/images/logo.svg";

import { Button } from "../components/Button";
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';

import "../styles/auth.scss";

export function NewRoom() {

  const { user } = useAuth()

  const [newRoom, setNewRoom] = useState('')

  const navigate = useNavigate();

  async function handleCreateRoom(event : FormEvent) {

    event.preventDefault();

    if(newRoom.trim() === ''){
      return;
    }

    const roomRef = ref(database, 'rooms')

    const firebaseRoom = await push(roomRef)
    
    set(firebaseRoom, {
      title: newRoom,
      authorId: user?.id
    })

    navigate(`/rooms/${firebaseRoom.key}`)

  }

  return (
    <div id="page-auth">
      <aside>
        <img
          src={illustrationSvg}
          alt="Ilustração  simbolizando perguntas e respostas"
        />

        <strong>Crie salas de Q&amp;A ao vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo real</p>
      </aside>

      <main>
        <div className="main-content">
          <img src={logoSvg} alt="Logo do letmeask" />

          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input 
              type="text" 
              placeholder="Nome da sala" 
              onChange={e => setNewRoom(e.target.value)} 
              value={newRoom}
            />

            <Button type="submit">Criar sala</Button>

            
          </form>
          <p>Quer entrar em uma sala existente <Link to="/">Cique aqui</Link></p>
        </div>
      </main>
    </div>
  );
}
