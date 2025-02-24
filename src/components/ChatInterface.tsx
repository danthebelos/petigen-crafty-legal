
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Send } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  peticaoId: string;
  contexto: string;
}

const ChatInterface = ({ peticaoId, contexto }: ChatInterfaceProps) => {
  const [mensagem, setMensagem] = useState("");
  const [mensagens, setMensagens] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const enviarMensagem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mensagem.trim() || isLoading) return;

    try {
      setIsLoading(true);
      
      // Adiciona mensagem do usuário ao chat
      const novaMensagemUsuario: Message = { role: "user", content: mensagem };
      setMensagens([...mensagens, novaMensagemUsuario]);
      setMensagem("");

      // Chama a Edge Function
      const { data, error } = await supabase.functions.invoke("chat-deepseek", {
        body: { mensagem, contexto },
      });

      if (error) throw error;

      // Adiciona resposta do assistente ao chat
      const novaMensagemAssistente: Message = {
        role: "assistant",
        content: data.resposta,
      };
      setMensagens(mensagens => [...mensagens, novaMensagemAssistente]);

      // Salva no histórico
      await supabase
        .from("chat_historico")
        .insert({
          peticao_id: peticaoId,
          mensagem: mensagem,
          resposta: data.resposta,
        });

    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível enviar a mensagem. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-xl shadow-sm">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {mensagens.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.role === "user"
                    ? "bg-zinc-900 text-white"
                    : "bg-zinc-100 text-zinc-900"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={enviarMensagem} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            placeholder="Digite sua mensagem..."
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
