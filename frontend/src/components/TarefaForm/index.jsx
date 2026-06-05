import React from "react";
import api from "../../services/api";

export default function TarefaForm({
  descricao,
  setDescricao,
  cadastrarTarefa = undefined,
}) {
  const criarNoBackend = async (titulo) => {
    return api.post("/tarefas", { titulo });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!descricao || !descricao.trim()) {
      alert("Descrição é obrigatória");
      return;
    }

    try {
      const tarefaCriada = await criarNoBackend(descricao.trim());
      setDescricao("");
      if (typeof cadastrarTarefa === "function") {
        cadastrarTarefa(tarefaCriada);
      } else {
        alert("Tarefa criada com sucesso!");
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "Falha ao criar tarefa");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="lg:w-2/3 w-full mx-auto mb-8 flex gap-3"
    >
      <input
        type="text"
        value={descricao}
        onChange={(event) => setDescricao(event.target.value)}
        placeholder="Digite uma tarefa"
        className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-2 px-3 leading-8 transition-colors duration-200 ease-in-out"
      />

      <button
        type="submit"
        className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg"
      >
        Salvar
      </button>
    </form>
  );
}
