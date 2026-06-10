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
  const [sortAsc, setSortAsc] = useState(true);

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

  // Ordenar tarefas por título (cliente)
  const handleSortRequested = () => {
    setSortAsc((prev) => {
      const next = !prev;
      setTarefas((curr) =>
        [...curr].sort((a, b) => {
          const va = (a.titulo || a.descricao || "").toLowerCase();
          const vb = (b.titulo || b.descricao || "").toLowerCase();
          if (va < vb) return next ? -1 : 1;
          if (va > vb) return next ? 1 : -1;
          return 0;
        }),
      );
      return next;
    });
  };

  // Marcar todas as tarefas como concluídas (faz PUT em cada uma)
  const handleMarkAllRequested = async () => {
    const toMark = tarefas.filter((t) => !t.concluida);
    if (toMark.length === 0) {
      alert("Não há tarefas não concluídas para marcar");
      return;
    }
    try {
      // adicionar todos aos loadingIds
      toMark.forEach((t) => addLoading(t.id));
      const promises = toMark.map((t) =>
        api.put(`/tarefas/${t.id}`, { concluida: true }).then((updated) => {
          setTarefas((prev) =>
            prev.map((p) => (p.id === updated.id ? updated : p)),
          );
        }),
      );
      await Promise.all(promises);
      alert("Todas as tarefas marcadas como concluídas");
    } catch (err) {
      console.error(err);
      alert(err.message || "Erro ao marcar tarefas");
    } finally {
      toMark.forEach((t) => removeLoading(t.id));
    }
  };

  // Exportar CSV das tarefas
  const handleExportRequested = () => {
    if (!Array.isArray(tarefas) || tarefas.length === 0) {
      alert("Nenhuma tarefa para exportar");
      return;
    }
    const headers = ["id", "titulo", "descricao", "concluida", "criadoEm"];
    const rows = tarefas.map((t) => [
      t.id,
      t.titulo || "",
      t.descricao || "",
      t.concluida,
      t.criadoEm || "",
    ]);
    const csv = [
      headers.join(","),
      ...rows.map((r) =>
        r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","),
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tarefas.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
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
          onSortRequested={handleSortRequested}
          onMarkAllRequested={handleMarkAllRequested}
          onExportRequested={handleExportRequested}
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
