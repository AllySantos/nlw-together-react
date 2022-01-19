import { useNavigate } from 'react-router-dom';

import illustrationSvg from "../assets/images/illustration.svg";
import logoSvg from "../assets/images/logo.svg";
import googleIconSvg from "../assets/images/google-icon.svg";

import { Button } from "../components/Button";
import { useAuth } from '../hooks/useAuth';

import '../styles/auth.scss'

export function Home() {

  const navigate = useNavigate();
  const { user, signInWithGoogle } = useAuth()

  async function handleCreateRoom(){

    if(!user){
      await signInWithGoogle();
    }

    navigate('/rooms/new')
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

          <form action="">
            <input 
              type="text" 
              placeholder="Digite o código da sala"
            />

            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
}