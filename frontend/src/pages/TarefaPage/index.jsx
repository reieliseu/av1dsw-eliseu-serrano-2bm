import { useEffect, useState } from "react";
import TarefaForm from "../../components/TarefaForm/";
import TarefaTabela from "../../components/TarefaTabela/";
import api from "../../services/api.js";

export default function TarefasPage() {
  const [descricao, setDescricao] = useState("");
  const [tarefas, setTarefas] = useState([]);
  const [loadingIds, setLoadingIds] = useState([]);

  const addLoading = (id) => setLoadingIds((p) => [...p, id]);
  const removeLoading = (id) => setLoadingIds((p) => p.filter((x) => x !== id));

  const buscarTarefas = async () => {
    try {
      const data = await api.get("/tarefas");
      setTarefas(data);
    } catch (err) {
      console.error(err);
      alert(err.message || "Erro ao carregar tarefas");
    }
  };

  useEffect(() => {
    buscarTarefas();
  }, []);

  const cadastrarTarefa = (tarefaCriada) => {
    if (tarefaCriada && tarefaCriada.id) {
      setTarefas((prev) => [tarefaCriada, ...prev]);
      return;
    }
    buscarTarefas();
  };

  const handleDelete = async (id) => {
    if (!confirm("Confirmar exclusão dessa tarefa?")) return;
    try {
      addLoading(id);
      await api.del(`/tarefas/${id}`);
      setTarefas((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
      alert(err.message || "Erro ao excluir tarefa");
    } finally {
      removeLoading(id);
    }
  };

  const handleEdit = async (tarefa) => {
    const novo = prompt(
      "Novo título:",
      tarefa.titulo || tarefa.descricao || "",
    );
    if (novo === null) return; // cancelou
    const titulo = novo.trim();
    if (!titulo) {
      alert("Título não pode ser vazio");
      return;
    }

    try {
      addLoading(tarefa.id);
      const updated = await api.put(`/tarefas/${tarefa.id}`, { titulo });
      setTarefas((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t)),
      );
    } catch (err) {
      console.error(err);
      alert(err.message || "Erro ao editar tarefa");
    } finally {
      removeLoading(tarefa.id);
    }
  };

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-12 mx-auto">
        <div className="flex flex-col text-center w-full mb-10">
          <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
            Lista de Tarefas
          </h1>

          <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
            Cadastre tarefas no frontend e visualize os dados salvos no backend.
          </p>
        </div>

        <TarefaForm
          descricao={descricao}
          setDescricao={setDescricao}
          cadastrarTarefa={cadastrarTarefa}
        />

        <TarefaTabela
          tarefas={tarefas}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loadingIds={loadingIds}
        />
      </div>
    </section>
  );
}
