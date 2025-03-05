
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, FileCheck, BarChart } from "lucide-react";

const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

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
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
