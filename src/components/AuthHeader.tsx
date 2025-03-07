
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function AuthHeader() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
      });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Houve um problema ao desconectar"
      });
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {user ? (
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground hidden md:inline">
            {user.email}
          </span>
          <Button variant="outline" onClick={handleSignOut}>
            Sair
          </Button>
        </div>
      ) : (
        <Link to="/auth">
          <Button variant="outline">Entrar</Button>
        </Link>
      )}
    </div>
  );
}
