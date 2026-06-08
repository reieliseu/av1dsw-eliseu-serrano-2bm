import React from "react";

export default function TarefaTabela({
  tarefas,
  onEdit,
  onDelete,
  loadingIds = [],
}) {
  if (!Array.isArray(tarefas)) return null;

  const isLoading = (id) => loadingIds.includes(id);

  return (
    <div className="lg:w-2/3 w-full mx-auto overflow-auto">
      <table className="table-auto w-full text-left whitespace-no-wrap">
        <thead>
          <tr>
            <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tl rounded-bl">
              ID
            </th>
            <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
              Descrição
            </th>
            <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
              Ações
            </th>
          </tr>
        </thead>

        <tbody>
          {tarefas.map((tarefa) => (
            <tr key={tarefa.id}>
              <td className="px-4 py-3">{tarefa.id}</td>
              <td className="px-4 py-3">{tarefa.descricao || tarefa.titulo}</td>
              <td className="px-4 py-3 flex gap-2">
                <button
                  className="text-sm text-white bg-yellow-500 border-0 py-1 px-3 rounded hover:bg-yellow-600"
                  onClick={() => onEdit && onEdit(tarefa)}
                  disabled={isLoading(tarefa.id)}
                >
                  {isLoading(tarefa.id) ? "..." : "Editar"}
                </button>

                <button
                  className="text-sm text-white bg-red-500 border-0 py-1 px-3 rounded hover:bg-red-600"
                  onClick={() => onDelete && onDelete(tarefa.id)}
                  disabled={isLoading(tarefa.id)}
                >
                  {isLoading(tarefa.id) ? "..." : "Excluir"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
