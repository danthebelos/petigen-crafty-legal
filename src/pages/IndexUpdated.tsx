import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Sua solução completa para advocacia
                </h1>
                <p className="max-w-[600px] text-zinc-500 md:text-xl">
                  Gere petições, contratos e gerencie seu escritório com eficiência e inteligência artificial.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                {user ? (
                  <Link to="/dashboard">
                    <Button size="lg">Acessar Dashboard</Button>
                  </Link>
                ) : (
                  <Link to="/auth">
                    <Button size="lg">Comece Agora</Button>
                  </Link>
                )}
                <Link to="/questionnaire">
                  <Button variant="outline" size="lg">
                    Experimentar Gerador de Petições
                  </Button>
                </Link>
              </div>
            </div>
            <img
              src="/placeholder.svg"
              alt="Petigen - Plataforma para advogados"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
            />
          </div>
          {/* Rest of the page content */}
        </div>
      </main>
    </div>
  );
};

export default Index;
