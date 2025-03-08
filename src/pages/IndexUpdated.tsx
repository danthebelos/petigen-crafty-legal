
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  FileText,
  Users,
  BarChart,
  FileCheck,
  Shield,
  Clock,
} from "lucide-react";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-24 lg:py-32 bg-gradient-to-b from-zinc-50 to-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Sua solução completa para advocacia
                  </h1>
                  <p className="max-w-[600px] text-zinc-500 md:text-xl">
                    Gere petições, contratos e gerencie seu escritório com
                    eficiência e inteligência artificial.
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  {user ? (
                    <Link to="/dashboard">
                      <Button size="lg">Acessar Dashboard</Button>
                    </Link>
                  ) : (
                    <div className="flex gap-2 flex-wrap">
                      <Link to="/auth">
                        <Button size="lg">Entrar</Button>
                      </Link>
                      <Link to="/auth">
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => localStorage.setItem("authMode", "signup")}
                        >
                          Cadastrar-se
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
              <img
                src="/placeholder.svg"
                alt="Advocacia Digital - Plataforma para advogados"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 md:py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Funcionalidades completas para seu escritório
              </h2>
              <p className="mx-auto mt-4 max-w-[700px] text-zinc-500 md:text-xl">
                Tudo o que você precisa para automatizar e otimizar seu trabalho
                jurídico em uma única plataforma.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center p-6 bg-zinc-50 rounded-lg">
                <FileText className="h-10 w-10 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Geração de Petições</h3>
                <p className="text-zinc-500 text-center">
                  Crie petições automaticamente com nossa tecnologia de IA, economizando tempo e recursos.
                </p>
              </div>

              <div className="flex flex-col items-center p-6 bg-zinc-50 rounded-lg">
                <FileCheck className="h-10 w-10 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Contratos Inteligentes</h3>
                <p className="text-zinc-500 text-center">
                  Gere e personalize contratos com rapidez e precisão para seus clientes.
                </p>
              </div>

              <div className="flex flex-col items-center p-6 bg-zinc-50 rounded-lg">
                <BarChart className="h-10 w-10 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Dashboard Completo</h3>
                <p className="text-zinc-500 text-center">
                  Gerencie casos, acompanhe prazos e visualize dados importantes em um único lugar.
                </p>
              </div>

              <div className="flex flex-col items-center p-6 bg-zinc-50 rounded-lg">
                <Users className="h-10 w-10 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Gerenciamento de Equipe</h3>
                <p className="text-zinc-500 text-center">
                  Adicione perfis para todos os advogados do seu escritório e configure permissões.
                </p>
              </div>

              <div className="flex flex-col items-center p-6 bg-zinc-50 rounded-lg">
                <Shield className="h-10 w-10 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Segurança de Dados</h3>
                <p className="text-zinc-500 text-center">
                  Seus dados e documentos são armazenados com segurança e criptografia.
                </p>
              </div>

              <div className="flex flex-col items-center p-6 bg-zinc-50 rounded-lg">
                <Clock className="h-10 w-10 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Automação de Prazos</h3>
                <p className="text-zinc-500 text-center">
                  Acompanhe todos os prazos importantes e receba notificações automáticas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-24 bg-zinc-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Comece hoje mesmo
                </h2>
                <p className="mx-auto max-w-[700px] text-zinc-500 md:text-xl">
                  Junte-se a centenas de escritórios que já estão otimizando seu trabalho com nossa plataforma.
                </p>
              </div>
              {!user && (
                <div className="flex flex-col sm:flex-row gap-2">
                  <Link to="/auth">
                    <Button size="lg">Entrar</Button>
                  </Link>
                  <Link to="/auth">
                    <Button 
                      variant="outline" 
                      size="lg"
                      onClick={() => localStorage.setItem("authMode", "signup")}
                    >
                      Cadastrar-se
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
