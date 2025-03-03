
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
