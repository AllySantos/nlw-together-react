import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, get, onValue } from "firebase/database";


import illustrationSvg from "../assets/images/illustration.svg";
import logoSvg from "../assets/images/logo.svg";
import googleIconSvg from "../assets/images/google-icon.svg";

import {  database } from '../services/firebase';
import { Button } from "../components/Button";
import { useAuth } from '../hooks/useAuth';

import '../styles/auth.scss'

export function Home() {

  const navigate = useNavigate();
  const { user, signInWithGoogle } = useAuth()
  const [roomCode, setRoomCode] = useState('')

  async function handleCreateRoom(){

    if(!user){
      await signInWithGoogle();
    }

    navigate('/rooms/new')
  }

  async function handleJoinRoom(event: FormEvent){
    event.preventDefault();

    if(roomCode.trim() === ''){
      return;
    }


   const roomRef = await ref(database, `rooms/${roomCode}`);


  await get(roomRef).then((snapshot) =>  {

    console.log(snapshot.val());
     if(snapshot.exists()){

      if(snapshot.val().endedAt){
        alert('Room has already ended.');
        return;
      }
      navigate(`/rooms/${roomCode}`)

     }else{
      alert('Room does not exists.');
      return;
     }
   })


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

          <Button onClick={handleCreateRoom} className="create-room">
            <img src={googleIconSvg} alt="Logo do Google" />
            Crie sua sala com o Google
          </Button>

          <div className="separator" >ou entre em uma sala</div>

          <form onSubmit={handleJoinRoom}>
            <input 
              type="text" 
              placeholder="Digite o código da sala"
              onChange = {e => setRoomCode(e.target.value)}
              value= {roomCode}
            />

            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
}
