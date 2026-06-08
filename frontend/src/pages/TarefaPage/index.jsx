import { useEffect, useState } from "react";
import TarefaForm from "../../components/TarefaForm/";
import TarefaTabela from "../../components/TarefaTabela/";
import ConfirmModal from "../../components/ConfirmModal/";
import EditModal from "../../components/EditModal/";
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
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [editingTarefa, setEditingTarefa] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const handleDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = async () => {
    const id = confirmDeleteId;
    if (!id) return;
    try {
      setModalLoading(true);
      addLoading(id);
      await api.del(`/tarefas/${id}`);
      setTarefas((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
      alert(err.message || "Erro ao excluir tarefa");
    } finally {
      removeLoading(id);
      setModalLoading(false);
      setConfirmDeleteId(null);
    }
  };

  const cancelDelete = () => setConfirmDeleteId(null);

  const handleEdit = (tarefa) => {
    setEditingTarefa(tarefa);
  };

  const saveEdit = async (updatedTarefa) => {
    const id = updatedTarefa.id;
    const titulo = (updatedTarefa.titulo || "").trim();
    if (!titulo) {
      alert("Título não pode ser vazio");
      return;
    }

    try {
      setModalLoading(true);
      addLoading(id);
      const updated = await api.put(`/tarefas/${id}`, { titulo });
      setTarefas((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t)),
      );
      setEditingTarefa(null);
    } catch (err) {
      console.error(err);
      alert(err.message || "Erro ao editar tarefa");
    } finally {
      removeLoading(id);
      setModalLoading(false);
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

      <ConfirmModal
        open={!!confirmDeleteId}
        title="Excluir tarefa"
        message="Tem certeza que deseja excluir esta tarefa?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        loading={modalLoading}
      />

      <EditModal
        open={!!editingTarefa}
        tarefa={editingTarefa}
        onSave={saveEdit}
        onCancel={() => setEditingTarefa(null)}
        loading={modalLoading}
      />
    </section>
  );
}
