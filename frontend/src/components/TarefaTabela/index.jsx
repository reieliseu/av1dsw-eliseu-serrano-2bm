import React, { useState, useRef, useEffect } from "react";

export default function TarefaTabela({
  tarefas,
  onEdit,
  onDelete,
  loadingIds = [],
  onSortRequested,
  onMarkAllRequested,
  onExportRequested,
}) {
  if (!Array.isArray(tarefas)) return null;

  const isLoading = (id) => loadingIds.includes(id);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="lg:w-2/3 w-full mx-auto overflow-auto relative">
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
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen((s) => !s);
                }}
                className="font-semibold"
              >
                Ações ▾
              </button>

              {menuOpen && (
                <div
                  ref={menuRef}
                  className="absolute right-0 mt-2 bg-white border rounded shadow-md z-50 w-40"
                >
                  <ul>
                    <li>
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => {
                          setMenuOpen(false);
                          onSortRequested && onSortRequested();
                        }}
                      >
                        Ordenar
                      </button>
                    </li>
                    <li>
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => {
                          setMenuOpen(false);
                          onMarkAllRequested && onMarkAllRequested();
                        }}
                      >
                        Marcar tudo
                      </button>
                    </li>
                    <li>
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => {
                          setMenuOpen(false);
                          onExportRequested && onExportRequested();
                        }}
                      >
                        Exportar CSV
                      </button>
                    </li>
                  </ul>
                </div>
              )}
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
