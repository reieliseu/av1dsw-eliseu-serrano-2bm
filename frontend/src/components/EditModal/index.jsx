import React, { useState, useEffect } from "react";

export default function EditModal({ open, tarefa, onSave, onCancel, loading }) {
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(tarefa?.titulo || tarefa?.descricao || "");
  }, [tarefa]);

  if (!open) return null;

  const handleSave = () => {
    const titulo = value.trim();
    if (!titulo) {
      alert("Descrição é obrigatória");
      return;
    }
    onSave({ ...tarefa, titulo });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h3 className="text-lg font-medium mb-2">Editar tarefa</h3>

        <input
          autoFocus
          data-testid="edit-modal-input"
          placeholder="Digite a descrição"
          className="w-full border rounded px-3 py-2 mb-4"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button
            className="py-2 px-4 rounded bg-gray-200 hover:bg-gray-300"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            className="py-2 px-4 rounded bg-indigo-500 text-white hover:bg-indigo-600"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
