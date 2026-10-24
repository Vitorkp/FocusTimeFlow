# ⏱️ FocusFlow

Timer Pomodoro com lista de tarefas para estudar com foco. Feito com **HTML, CSS e JavaScript puro**, sem bibliotecas.


## ✨ Funcionalidades

- Três modos: Foco (25 min), Pausa (5 min) e Pausa longa (15 min)
- Anel de progresso animado em SVG
- Contador de sessões de foco concluídas no dia
- Lista de tarefas com marcar, remover e contador de pendentes
- Dados salvos no navegador (`localStorage`)
- Atalho de teclado: `Espaço` inicia e pausa
- Tempo no título da aba e aviso sonoro ao terminar
- Layout responsivo

## 🧠 O que pratiquei

- Manipulação do DOM e eventos
- Persistência de dados com `localStorage`
- Contagem de tempo precisa com `Date.now()` (em vez de somar segundos)
- Animação com SVG (`stroke-dashoffset`)
- Prevenção de injeção de HTML usando `textContent`
- CSS com variáveis, gradientes e media queries

## ▶️ Como rodar

Abra o `index.html` no navegador. Não precisa instalar nada.

## 🚧 Próximos passos

- [ ] Configurar a duração de cada modo
- [ ] Ciclo automático (foco → pausa → foco)
- [ ] Notificações do navegador
- [ ] Histórico semanal de sessões
