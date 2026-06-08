## Plan: Implementar editar/excluir tarefas no frontend

TL;DR - Adicionar botões Editar/Excluir na tabela, implementar chamadas `api.put` e `api.del`, criar UI de edição (inline ou modal), e adaptar `TarefaPage` para atualizar o estado local sem recarregar a lista.

**Steps**

1. Atualizar `frontend/src/components/TarefaTabela/index.jsx`:
   - Adicionar duas colunas de ações com botões `Editar` e `Excluir` para cada linha.
   - Receber props opcionais `onEdit(tarefa)` e `onDelete(id)` para delegar lógica ao pai.
   - Exibir estado de loading/disabled nos botões quando solicitado (via prop `loadingIds`).
2. Atualizar `frontend/src/pages/TarefaPage/index.jsx`:
   - Implementar funções `handleEdit(tarefa)` e `handleDelete(id)`.
   - `handleDelete`: chamar `await api.del(`/tarefas/${id}`)`, e em sucesso remover o item do estado `tarefas` com `setTarefas(prev => prev.filter(t => t.id !== id))`.
   - `handleEdit`: abrir um small modal/inline form preenchido com `tarefa.titulo`; ao salvar, chamar `await api.put(`/tarefas/${id}`, { titulo, /* outros campos */ })` e atualizar o item no estado com `setTarefas(prev => prev.map(t => t.id===id? updated: t))`.
   - Gerenciar `loading`/`error` e fornecer feedback (substituir `alert` por mensagens mais leves se preferir).
3. Implementar componente de edição se optar por modal:
   - Novo componente `frontend/src/components/TarefaEditModal/index.jsx` (recebe `tarefa`, `onCancel`, `onSave(updatedTarefa)`).
   - Alternativa mais simples: transformar `TarefaForm` em controlável para editar (reutilizar o mesmo formulário com prop `initialValue`).
4. Ajustar imports para usar o cliente atualizado (`api.put` e `api.del`) — já disponíveis em `frontend/src/services/api.js`.
5. Testes manuais:
   - Criar, editar e excluir tarefas via UI; verificar mudança imediata na tabela sem reload completo.
   - Simular erros (API offline / 4xx) e garantir mensagens amigáveis.
6. Commit e push:
   - `git add` arquivos modificados
   - `git commit -m "feat(frontend): adicionar editar/excluir tarefas na tabela e handlers em TarefaPage"`
   - `git push`
7. (Opcional) Melhorias posteriores:
   - Substituir `alert` por toasts; adicionar confirmação antes de excluir; adicionar estados de edição inline com debounce.

**Relevant files**

- `frontend/src/components/TarefaTabela/index.jsx` — adicionar botões e novas props `onEdit`/`onDelete`.
- `frontend/src/pages/TarefaPage/index.jsx` — implementar `handleEdit`/`handleDelete` e passar para `TarefaTabela`.
- `frontend/src/components/TarefaForm/index.jsx` — tornar reusável para edição (opcional).
- `frontend/src/components/TarefaEditModal/index.jsx` — novo, se usar modal.
- `frontend/src/services/api.js` — já contém `put` e `del`.

**Verification**

1. Rodar frontend: `npm run dev` na pasta `frontend`.
2. Criar uma tarefa, editar o título e confirmar que o backend recebe `PUT /tarefas/:id` e a tabela atualiza.
3. Excluir uma tarefa e confirmar `DELETE /tarefas/:id` e remoção da tabela.
4. Verificar tratamento de erro mostrando mensagem e mantendo consistência do estado.

**Decisions / Assumptions**

- Usaremos `api.put` e `api.del` já adicionados ao cliente HTTP.
- A edição será simples (apenas `titulo`), salvo se você pedir campos extras.
- Confirmação de exclusão será por `confirm()` inicial; posso substituir por modal de confirmação se preferir.

Quer que eu gere os patches para os arquivos mencionados agora (aplicar as mudanças automaticamente), ou prefere revisar os diffs antes de aplicar?
