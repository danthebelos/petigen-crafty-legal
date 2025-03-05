
import { useEffect, forwardRef, useImperativeHandle } from "react";
import { useChat, Message } from "@/hooks/useChat";
import MessageList from "@/components/chat/MessageList";
import MessageInput from "@/components/chat/MessageInput";
import DocumentControls from "@/components/chat/DocumentControls";

interface ChatInterfaceProps {
  peticaoId: string;
  contexto: string;
}

declare global {
  interface Window {
    enviarMensagemParaChat: (mensagem: string) => void;
  }
}

const ChatInterface = forwardRef<any, ChatInterfaceProps>(({ peticaoId, contexto }, ref) => {
  const {
    mensagem,
    mensagens,
    setMensagem,
    isLoading,
    peticaoPronta,
    enviarMensagem
  } = useChat(peticaoId, contexto);

  // Obtém a última mensagem do assistente (petição)
  const peticaoFinal = mensagens
    .filter(m => m.role === "assistant")
    .pop()?.content || null;

  // Expose the enviarMensagem method through ref
  useImperativeHandle(ref, () => ({
    enviarMensagem: (mensagemExterna: string) => {
      setMensagem(mensagemExterna);
      setTimeout(() => {
        enviarMensagem();
      }, 100);
    }
  }));

  useEffect(() => {
    window.enviarMensagemParaChat = (mensagemExterna: string) => {
      setMensagem(mensagemExterna);
      setTimeout(() => {
        enviarMensagem();
      }, 100);
    };
    
    return () => {
      // Limpar a função global ao desmontar o componente
      window.enviarMensagemParaChat = () => {};
    };
  }, [setMensagem, enviarMensagem]);

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-xl shadow-sm">
      <MessageList 
        mensagens={mensagens} 
        isLoading={isLoading} 
      />

      <div className="p-4 border-t space-y-4">
        {peticaoPronta && (
          <DocumentControls peticao={peticaoFinal} />
        )}
        
        <MessageInput
          mensagem={mensagem}
          setMensagem={setMensagem}
          enviarMensagem={enviarMensagem}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
});

ChatInterface.displayName = "ChatInterface";

export default ChatInterface;
