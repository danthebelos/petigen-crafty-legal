
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CEPInputProps {
  onAddressFound: (address: AddressData) => void;
}

export interface AddressData {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
}

const CEPInput: React.FC<CEPInputProps> = ({ onAddressFound }) => {
  const [cep, setCep] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Formata o CEP enquanto o usuário digita
  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 8) {
      value = value.substring(0, 8);
    }
    
    if (value.length > 5) {
      value = value.replace(/(\d{5})(\d{1,3})/, "$1-$2");
    }
    
    setCep(value);
  };

  const buscarCEP = async () => {
    // Remove caracteres não numéricos
    const cepNumerico = cep.replace(/\D/g, '');
    
    if (cepNumerico.length !== 8) {
      toast({
        variant: "destructive",
        title: "CEP inválido",
        description: "Por favor, digite um CEP válido com 8 dígitos.",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepNumerico}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        throw new Error('CEP não encontrado');
      }
      
      onAddressFound(data);
      
      toast({
        title: "Endereço encontrado",
        description: `${data.logradouro}, ${data.bairro}, ${data.localidade}/${data.uf}`,
      });
      
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      toast({
        variant: "destructive",
        title: "Erro ao buscar CEP",
        description: "Não foi possível encontrar o endereço para este CEP. Verifique se o CEP está correto.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Input
        placeholder="Digite o CEP"
        value={cep}
        onChange={handleCepChange}
        maxLength={9}
        className="w-36"
      />
      <Button 
        type="button" 
        onClick={buscarCEP}
        variant="outline"
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Buscar"}
      </Button>
    </div>
  );
};

export default CEPInput;
