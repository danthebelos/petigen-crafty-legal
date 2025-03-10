
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export function ProtectedRoute({ 
  children, 
  requireAdvogadoProfile 
}: { 
  children: React.ReactNode;
  requireAdvogadoProfile?: boolean;
}) {
  const { user, loading, currentProfile } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    // Redirecionar para login se não estiver autenticado
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Se a rota exige perfil de advogado e o perfil atual não é de advogado
  if (requireAdvogadoProfile && currentProfile.type !== "advogado") {
    // Mostrar mensagem ou redirecionar para seleção de perfil
    return <Navigate to="/profile" state={{ message: "Esta funcionalidade requer um perfil de advogado ativo" }} />;
  }

  return <>{children}</>;
}
