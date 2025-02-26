
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { user } = await req.json();

    if (!user || !user.email || !user.nome_completo) {
      throw new Error("Dados do usuário incompletos");
    }

    const dataFormatada = new Date().toLocaleDateString('pt-BR');

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2a4365;">Bem-vindo(a) ao Petigen – Confirmação de Cadastro</h2>
            
            <p>Olá ${user.nome_completo},</p>
            
            <p>Seja muito bem-vindo(a) ao Petigen – a ferramenta essencial para advogados que desejam otimizar sua produtividade e gerenciar seus processos com eficiência!</p>
            
            <div style="background-color: #f7fafc; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Detalhes do seu cadastro:</h3>
              <p><strong>Nome:</strong> ${user.nome_completo}</p>
              <p><strong>E-mail:</strong> ${user.email}</p>
              <p><strong>Data de Cadastro:</strong> ${dataFormatada}</p>
            </div>
            
            <h3>Próximos Passos:</h3>
            <ul>
              <li>Acesse sua conta: <a href="https://app.petigen.com" style="color: #4299e1;">Clique aqui</a> para acessar o Petigen</li>
              <li>Explore o software: Confira nossos tutoriais e guias rápidos</li>
            </ul>
            
            <p><strong>Dúvidas?</strong> Nosso suporte está à disposição para ajudar. Entre em contato pelo e-mail suporte@petigen.com.br ou pelo chat dentro da plataforma.</p>
            
            <h3>Por que escolher o Petigen?</h3>
            <ul>
              <li>Gestão completa de processos jurídicos</li>
              <li>Ferramentas intuitivas e seguras</li>
              <li>Atualizações constantes para atender às suas necessidades</li>
            </ul>
            
            <p>Agradecemos por confiar no Petigen para impulsionar sua prática jurídica. Estamos aqui para apoiar você em cada etapa!</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <p>Atenciosamente,<br>Equipe Petigen</p>
              
              <div style="margin-top: 20px;">
                <a href="https://petigen.com" style="color: #4299e1; margin-right: 15px;">Site do Petigen</a>
                <a href="https://petigen.com/suporte" style="color: #4299e1; margin-right: 15px;">Suporte</a>
                <a href="https://petigen.com/redes-sociais" style="color: #4299e1;">Redes Sociais</a>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const { error: emailError } = await resend.emails.send({
      from: 'Petigen <onboarding@resend.dev>',
      to: [user.email],
      subject: 'Bem-vindo(a) ao Petigen – Confirmação de Cadastro',
      html: emailHtml,
    });

    if (emailError) {
      throw emailError;
    }

    return new Response(
      JSON.stringify({ message: "Email de boas-vindas enviado com sucesso" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
