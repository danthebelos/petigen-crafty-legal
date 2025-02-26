
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold text-zinc-900 sm:text-5xl">
            Petigen
          </h1>
          <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
            Sua ferramenta essencial para criação e gestão de petições jurídicas
            com inteligência artificial.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild>
              <Link to="/auth">Começar Agora</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
