/**
 * ============================================================================
 * PROJETO: Portfólio Interativo com Mural de Projetos
 * ARQUIVO: app.ts
 * DESCRIÇÃO: Controla a alternância de tema (Dark Mode), a expansão dos cards
 *            e a adição, contagem e remoção dinâmica de itens no Mural.
 * ============================================================================
 */

// ----------------------------------------------------------------------------
//SELEÇÃO TIPADA DOS ELEMENTOS DO DOM
// Usamos Generic Types (<HTMLElement>) para informar ao TypeScript o tipo exato
// de cada elemento capturado do HTML, garantindo segurança na tipagem.
// ----------------------------------------------------------------------------

const btnTema = document.querySelector<HTMLButtonElement>('#btn-tema');
const formProducao = document.querySelector<HTMLFormElement>('#form-producao');
const inputProducao = document.querySelector<HTMLInputElement>('#input-producao');
const listaProducao = document.querySelector<HTMLUListElement>('#lista-producao');
const totalProducaoSpan = document.querySelector<HTMLSpanElement>('#em-producao');

//dark mode

//primeiro ele verifica se o btn é nullo ou indefinido. Se n existir, nada faz. Caso exista, ele ouve um evento de click e executa o bloco abaixo
//ele acessa body e a classe q contem o dark-mode.
//a variavel estaEscuro recebe uma verificação se o dark-mode esta on ou off. contais retorna booleano
//muda o botão. Se estaEscuro for verdadeiro (?), troca pra claro, caso ao, deixa escuro

if (btnTema) {
  btnTema.addEventListener('click', (): void => {
    document.body.classList.toggle('dark-mode');
    const estaEscuro: boolean = document.body.classList.contains('dark-mode');
    btnTema.textContent = estaEscuro ? '☀️ Modo Claro' : '🌙 Modo Escuro';
  });
}


//Colocando a musica 
//o HTMLAudioElement informa q é um arquivo de audio
function toggleMusica(): void {
  const musica = document.getElementById('musica-fundo') as HTMLAudioElement | null; //procura no htm o id msuca fundo
  const botao = document.getElementById('btn-audio') as HTMLButtonElement | null; //procura no htm o id do btn


  //aqui ele verifica se a musica esta pausada. dá play na musica e usa o catch para capturar algum error
  if (musica && botao) {
    if (musica.paused) {
      musica.play().catch((error: unknown) => console.log("Música não encontrada", error)); 
      botao.textContent = "🔊 Som: ON";
     
    } else {
      musica.pause();
      botao.textContent = "🎵 Som: OFF";
      
    }
  }
}

// Expõe a função no escopo global para que o onclick="toggleMusica()" do HTML funcione
(window as any).toggleMusica = toggleMusica;

// ----------------------------------------------------------------------------
// MANIPULAÇÃO DO DOM PARA EXPANSÃO DOS CARDS
// Recebe o ID da seção clicada e alterna a classe 'ativo' para exibir/ocultar.
// ----------------------------------------------------------------------------

function toggleCard(id: string): void {
  const cardSelecionado = document.getElementById(id) as HTMLElement | null;
  
  if (cardSelecionado) {
    // Alterna a classe 'ativo' que controla o display: block no CSS
    cardSelecionado.classList.toggle('ativo');
  }
}

// Expõe a função no escopo global (window) para que o atributo onclick="" do HTML consiga acessá-la
(window as any).toggleCard = toggleCard;

// ============================================================================
// MANIPULAÇÃO DO MURAL DE PROJETOS (CRIAÇÃO, CONTAGEM E REMOÇÃO)
// escuta o 'submit' do formulário, cria os elementos <li>, <span> e <button>
// via JavaScript, atualiza o contador e permite a exclusão individual.
// ============================================================================

// Função tipada responsável por contar os itens <li> e atualizar o contador na tela
const atualizarTotalProducao = (): void => {
  if (listaProducao && totalProducaoSpan) {
    const quantidade: number = listaProducao.children.length;
    totalProducaoSpan.textContent = String(quantidade);
  }
};

// Evento de envio (submit) do formulário tipado com SubmitEvent
if (formProducao && inputProducao && listaProducao) {
  formProducao.addEventListener('submit', (evento: SubmitEvent): void => {
    // Impede o comportamento padrão de recarregar a página
    evento.preventDefault();

    // Captura e limpa espaços vazios nas extremidades do texto digitado
    const textoDigitado: string = inputProducao.value.trim();

    // Validação para não permitir envio de texto vazio
    if (textoDigitado === '') {
      inputProducao.focus();
      return;
    }

    // Criação dinâmica do elemento de lista (<li>)
    const novoItem: HTMLLIElement = document.createElement('li');
    novoItem.classList.add('item-producao');

    // Criação dinâmica do <span> que armazenará o nome do projeto
    const spanTexto: HTMLSpanElement = document.createElement('span');
    spanTexto.textContent = textoDigitado;

    // Criação dinâmica do botão de exclusão (<button>)
    const btnRemover: HTMLButtonElement = document.createElement('button');
    btnRemover.textContent = 'Excluir';
    btnRemover.classList.add('btn-remover');
    btnRemover.type = 'button';

    // Evento de clique para remover o item específico e recalcular o total
    btnRemover.addEventListener('click', (): void => {
      novoItem.remove();
      atualizarTotalProducao();
    });

    // Anexa o texto e o botão dentro do <li>, e insere o <li> na lista <ul>
    novoItem.appendChild(spanTexto);
    novoItem.appendChild(btnRemover);
    listaProducao.appendChild(novoItem);

    // Atualiza o contador, limpa o campo de entrada e devolve o foco para digitação
    atualizarTotalProducao();
    inputProducao.value = '';
    inputProducao.focus();
  });
}