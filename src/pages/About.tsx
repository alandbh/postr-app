import React from "react";
import { Link } from "react-router-dom";

export default function About() {
    return (
        <div className="bg-surface text-on-surface dark:bg-primary-dark dark:text-white/90 min-h-screen px-4">
            <article className="max-w-3xl mx-auto pb-16">
                <div className="flex items-center justify-between gap-3 mb-6">
                    <Link
                        to="/"
                        className="text-sm opacity-80 hover:opacity-100 inline-flex items-center gap-2"
                    >
                        <span>←</span>
                        <span>Início</span>
                    </Link>
                </div>

                <div className="prose dark:prose-invert max-w-none prose-h1:font-bold prose-p:font-serif">
                    <h1>O que é o Postr?</h1>
                    
                    <p className="lead">
                        O Postr é um leitor de artigos que remove todas as distrações da web moderna. 
                        Nada de anúncios, pop-ups, banners de cookies ou elementos visuais que competem 
                        pela sua atenção. Apenas o conteúdo que você quer ler, da forma como deveria ser.
                    </p>

                    <h2>Como funciona</h2>
                    
                    <p>Usar o Postr é simples:</p>
                    
                    <ol>
                        <li>
                            <strong>Copie a URL</strong> de qualquer artigo, notícia ou post que você 
                            encontrar na web
                        </li>
                        <li>
                            <strong>Cole no Postr</strong> e clique em Salvar
                        </li>
                        <li>
                            <strong>Leia sem interrupções</strong> — o Postr extrai apenas o conteúdo 
                            relevante e apresenta em um formato limpo e agradável
                        </li>
                    </ol>

                    <p>
                        Você também pode compartilhar artigos diretamente de outros aplicativos. 
                        No Android, basta usar o menu "Compartilhar" e escolher o Postr como destino.
                    </p>

                    <h2>Por que usar o Postr?</h2>

                    <ul>
                        <li>
                            <strong>Sem anúncios</strong> — O conteúdo original é extraído e os 
                            elementos publicitários são removidos automaticamente
                        </li>
                        <li>
                            <strong>Sem rastreadores</strong> — Nenhum script de terceiros é executado. 
                            Sua leitura é só sua
                        </li>
                        <li>
                            <strong>Funciona offline</strong> — Os artigos salvos ficam disponíveis 
                            mesmo sem conexão com a internet
                        </li>
                        <li>
                            <strong>Leitura focada</strong> — Tipografia otimizada para leitura 
                            prolongada, sem elementos visuais competindo pela sua atenção
                        </li>
                    </ul>

                    <h2>Recursos</h2>

                    <ul>
                        <li>
                            <strong>Organize com tags</strong> — Adicione etiquetas aos seus artigos 
                            para encontrá-los facilmente depois
                        </li>
                        <li>
                            <strong>Compartilhe via Postr</strong> — Envie artigos para amigos com 
                            um link que já abre no modo leitura limpa
                        </li>
                        <li>
                            <strong>Instale como app</strong> — O Postr é um PWA (Progressive Web App) 
                            que pode ser instalado na tela inicial do seu celular
                        </li>
                    </ul>

                    <h2>Privacidade</h2>

                    <p>
                        O Postr foi construído com privacidade em mente. Todos os seus artigos e 
                        configurações ficam armazenados <strong>localmente no seu dispositivo</strong>. 
                        Não existe conta obrigatória, não existe coleta de dados.
                    </p>

                    <p>
                        No futuro, ofereceremos a opção de sincronizar seus artigos na nuvem para 
                        quem quiser acessá-los em múltiplos dispositivos — mas isso será sempre {" "}
                        <strong>opcional</strong>. Quem preferir manter tudo local, continuará podendo 
                        usar o Postr exatamente como hoje.
                    </p>

                    <p>
                        O único momento em que uma conexão externa é feita é para buscar o conteúdo 
                        do artigo que você está salvando. Depois disso, tudo fica no seu aparelho.
                    </p>

                    <h2>O que vem por aí</h2>

                    <p>
                        O Postr está em constante evolução. Aqui estão alguns recursos que estamos 
                        desenvolvendo para as próximas versões:
                    </p>

                    <ul>
                        <li>
                            <strong>Sincronização na nuvem</strong> — Acesse seus artigos salvos 
                            em qualquer dispositivo (opcional)
                        </li>
                        <li>
                            <strong>Modo escuro</strong> — Leitura confortável em ambientes com 
                            pouca luz
                        </li>
                        <li>
                            <strong>Zoom em imagens</strong> — Toque único para ampliar fotos e 
                            ilustrações dos artigos
                        </li>
                        <li>
                            <strong>Leitura em voz alta</strong> — Ouça seus artigos enquanto 
                            faz outras atividades
                        </li>
                    </ul>

                    <hr />

                    <p className="text-center">
                        <Link to="/" className="text-primary hover:underline">
                            Voltar ao início e salvar seu primeiro artigo →
                        </Link>
                    </p>
                </div>
            </article>
        </div>
    );
}
