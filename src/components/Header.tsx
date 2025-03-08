
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, FileCheck, BarChart, Users, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="bg-white border-b border-zinc-200 py-3 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="font-bold text-xl text-zinc-900">
              Advocacia Digital
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Button 
                  asChild 
                  variant={isActive("/questionnaire") ? "default" : "ghost"}
                  size="sm"
                >
                  <Link to="/questionnaire" className="flex items-center gap-1">
                    <FileText size={16} />
                    <span className="hidden sm:inline">Gerar Petições</span>
                  </Link>
                </Button>
                
                <Button 
                  asChild 
                  variant={isActive("/contracts") ? "default" : "ghost"}
                  size="sm"
                >
                  <Link to="/contracts" className="flex items-center gap-1">
                    <FileCheck size={16} />
                    <span className="hidden sm:inline">Gerar Contratos</span>
                  </Link>
                </Button>
                
                <Button 
                  asChild 
                  variant={isActive("/dashboard") ? "default" : "ghost"}
                  size="sm"
                >
                  <Link to="/dashboard" className="flex items-center gap-1">
                    <BarChart size={16} />
                    <span className="hidden sm:inline">Dashboard</span>
                  </Link>
                </Button>

                <Button 
                  asChild 
                  variant={isActive("/advogados") ? "default" : "ghost"}
                  size="sm"
                >
                  <Link to="/advogados" className="flex items-center gap-1">
                    <Users size={16} />
                    <span className="hidden sm:inline">Advogados</span>
                  </Link>
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User size={20} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/profile">Meu Perfil</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sair</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex gap-2">
                <Link to="/auth">
                  <Button size="sm" variant="outline">Entrar</Button>
                </Link>
                <Link to="/auth">
                  <Button 
                    size="sm"
                    onClick={() => localStorage.setItem("authMode", "signup")}
                  >
                    Cadastrar
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
