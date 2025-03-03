
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { gerarDocumentoWord, downloadDocument } from "@/utils/documentUtils";

interface DocumentControlsProps {
  peticao: string | null;
}

const DocumentControls = ({ peticao }: DocumentControlsProps) => {
  const [cabeçalhoImagem, setCabeçalhoImagem] = useState<File | null>(null);
  const [rodapeImagem, setRodapeImagem] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, tipo: 'cabeçalho' | 'rodape') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Verificar se é um tipo de imagem válido
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'];
      if (!validImageTypes.includes(file.type)) {
        toast({
          variant: "destructive",
          title: "Formato inválido",
          description: "Por favor, selecione uma imagem nos formatos: JPG, PNG, GIF ou BMP.",
        });
        return;
      }
      
      if (tipo === 'cabeçalho') {
        setCabeçalhoImagem(file);
        toast({
          title: "Imagem do cabeçalho selecionada",
          description: `Arquivo: ${file.name}`,
        });
      } else {
        setRodapeImagem(file);
        toast({
          title: "Imagem do rodapé selecionada",
          description: `Arquivo: ${file.name}`,
        });
      }
    }
  };

  const handleFinalizarPeticao = async () => {
    try {
      if (!peticao) {
        throw new Error("Nenhuma petição encontrada");
      }

      const showError = (message: string) => {
        toast({
          variant: "destructive",
          title: "Erro",
          description: message,
        });
      };

      const doc = await gerarDocumentoWord(peticao, cabeçalhoImagem, rodapeImagem, showError);
      await downloadDocument(doc, "peticao.docx");

      toast({
        title: "Sucesso!",
        description: "Petição gerada com sucesso!",
      });

    } catch (error) {
      console.error("Erro ao gerar documento:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível gerar o documento. Tente novamente.",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm mb-2 text-zinc-600">Cabeçalho (Recomendado: 2000x350px)</p>
          <Input
            type="file"
            accept="image/jpeg,image/png,image/gif,image/bmp"
            onChange={(e) => handleFileChange(e, 'cabeçalho')}
            className="text-sm"
          />
          {cabeçalhoImagem && (
            <p className="mt-1 text-xs text-green-600">
              Cabeçalho: {cabeçalhoImagem.name}
            </p>
          )}
        </div>
        <div>
          <p className="text-sm mb-2 text-zinc-600">Rodapé (Recomendado: 2000x250px)</p>
          <Input
            type="file"
            accept="image/jpeg,image/png,image/gif,image/bmp"
            onChange={(e) => handleFileChange(e, 'rodape')}
            className="text-sm"
          />
          {rodapeImagem && (
            <p className="mt-1 text-xs text-green-600">
              Rodapé: {rodapeImagem.name}
            </p>
          )}
        </div>
      </div>
      <Button
        onClick={handleFinalizarPeticao}
        className="w-full flex items-center justify-center gap-2"
        variant="default"
        disabled={!peticao}
      >
        <FileDown className="h-4 w-4" />
        Finalizar e Gerar Petição
      </Button>
    </div>
  );
};

export default DocumentControls;
