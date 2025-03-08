
import { useEffect, useRef } from "react";
import { usePeticaoContext } from "./PeticaoContext";

interface ChatInitializerProps {
  chatRef: React.RefObject<any>;
}

const ChatInitializer = ({ chatRef }: ChatInitializerProps) => {
  const { isFormSubmitted, promptContext } = usePeticaoContext();

  // Efeito para enviar a mensagem após o estado ser atualizado
  useEffect(() => {
    if (isFormSubmitted && promptContext) {
      // Pequeno delay para garantir que o componente chat esteja pronto
      const timer = setTimeout(() => {
        console.log("Tentando enviar mensagem para o chat...");
        if (chatRef.current) {
          console.log("Enviando mensagem via chatRef");
          chatRef.current.enviarMensagem("Por favor, gere minha petição completa com base nas informações que enviei.");
        } else if (window.enviarMensagemParaChat) {
          console.log("Enviando mensagem via window.enviarMensagemParaChat");
          window.enviarMensagemParaChat("Por favor, gere minha petição completa com base nas informações que enviei.");
        } else {
          console.log("Nenhum método disponível para enviar mensagem!");
        }
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [isFormSubmitted, promptContext, chatRef]);

  return null;
};

export default ChatInitializer;
