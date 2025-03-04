
import React from 'react';

// Formata o texto para exibição no chat
export const formatarTexto = (texto: string) => {
  // Substitui **texto** por <strong>texto</strong> para negrito
  texto = texto.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Substitui *texto* por <em>texto</em> para itálico
  texto = texto.replace(/\*(.*?)\*/g, '<em>$1</em>');
  return texto;
};

// Renderiza a mensagem com formatação HTML
export const renderizarMensagem = (content: string) => {
  return <p className="text-sm whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: formatarTexto(content) }} />;
};

// Formata o CPF: 12345678900 -> 123.456.789-00
export const formatarCPF = (cpf: string) => {
  if (!cpf) return '';
  
  // Remove caracteres não numéricos
  cpf = cpf.replace(/\D/g, '');
  
  // Garante que o CPF tenha 11 dígitos
  if (cpf.length !== 11) return cpf;
  
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

// Formata o RG: 1234567 -> 1.234.567 (formatação genérica, pode variar por estado)
export const formatarRG = (rg: string) => {
  if (!rg) return '';
  
  // Remove caracteres não alfanuméricos
  rg = rg.replace(/[^\w]/g, '');
  
  // Caso genérico para RGs - pode precisar ajustes para formatos específicos de estados
  if (rg.length <= 5) return rg;
  
  // Tenta adicionar pontos a cada 3 caracteres a partir do fim
  const match = rg.match(/^([A-Z0-9]+)(\d{3})(\d{3})?(\d{1})?$/);
  
  if (match) {
    // Se tiver dígito verificador
    if (match[4]) {
      return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
    }
    // Se for apenas números sem dígito
    if (match[3]) {
      return `${match[1]}.${match[2]}.${match[3]}`;
    }
    // Se for mais curto
    return `${match[1]}.${match[2]}`;
  }
  
  return rg;
};
