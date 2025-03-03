
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface MessageInputProps {
  mensagem: string;
  setMensagem: (mensagem: string) => void;
  enviarMensagem: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const MessageInput = ({
  mensagem,
  setMensagem,
  enviarMensagem,
  isLoading
}: MessageInputProps) => {
  return (
    <form onSubmit={enviarMensagem} className="flex gap-2">
      <Input
        value={mensagem}
        onChange={(e) => setMensagem(e.target.value)}
        placeholder="Digite sua mensagem..."
        disabled={isLoading}
      />
      <Button type="submit" disabled={isLoading}>
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default MessageInput;
