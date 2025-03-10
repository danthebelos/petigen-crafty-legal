
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  FileCheck, 
  BarChart, 
  Users, 
  User, 
  LogOut, 
  ChevronDown, 
  Building2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    user, 
    signOut, 
    advogados, 
    loadingAdvogados, 
    currentProfile, 
    switchProfile 
  } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const getActiveProfileName = () => {
    if (currentProfile.type === "escritorio") {
      return "Escritório";
    }
    return currentProfile.data?.nome_completo || "Advogado";
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
                
                {/* Profile Switcher */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      {currentProfile.type === "escritorio" ? (
                        <Building2 size={16} />
                      ) : (
                        <Avatar className="h-5 w-5">
                          {currentProfile.data?.foto_url ? (
                            <AvatarImage src={currentProfile.data.foto_url} alt={currentProfile.data.nome_completo} />
                          ) : (
                            <AvatarFallback className="text-xs">
                              {getInitials(currentProfile.data?.nome_completo || "")}
                            </AvatarFallback>
                          )}
                        </Avatar>
                      )}
                      <span className="hidden sm:inline max-w-28 truncate">
                        {getActiveProfileName()}
                      </span>
                      <ChevronDown size={14} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Alternar Perfil</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem 
                      onClick={() => switchProfile("escritorio")}
                      className={`gap-2 ${currentProfile.type === "escritorio" ? "bg-zinc-100" : ""}`}
                    >
                      <Building2 size={16} />
                      <span>Escritório</span>
                    </DropdownMenuItem>
                    
                    {advogados.length > 0 && (
                      <>
                        <DropdownMenuLabel className="mt-2 text-xs">Advogados</DropdownMenuLabel>
                        <DropdownMenuGroup>
                          {advogados.map(advogado => (
                            <DropdownMenuItem 
                              key={advogado.id} 
                              onClick={() => switchProfile("advogado", advogado.id)}
                              className={`gap-2 ${
                                currentProfile.type === "advogado" && 
                                currentProfile.data?.id === advogado.id 
                                  ? "bg-zinc-100" 
                                  : ""
                              }`}
                            >
                              <Avatar className="h-5 w-5">
                                {advogado.foto_url ? (
                                  <AvatarImage src={advogado.foto_url} alt={advogado.nome_completo} />
                                ) : (
                                  <AvatarFallback className="text-xs">
                                    {getInitials(advogado.nome_completo)}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              <span className="truncate">{advogado.nome_completo}</span>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuGroup>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {/* User Account Menu */}
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
