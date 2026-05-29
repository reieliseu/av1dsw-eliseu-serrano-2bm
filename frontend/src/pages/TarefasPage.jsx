import { useEffect, useState } from "react";
import TarefaForm from "../components/TarefaForm.jsx";
import TarefaTabela from "../components/TarefaTabela";

export default function TarefasPage() {
  const [descricao, setDescricao] = useState("");
  const [tarefas, setTarefas] = useState([]);

  const buscarTarefas = async () => {
    try {
      const res = await fetch("http://localhost:3000/tarefas");
      if (!res.ok) throw new Error("Falha ao buscar tarefas");
      const data = await res.json();
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
    // Se o formulário já criou no backend e retornou a tarefa, insere-a.
    if (tarefaCriada && tarefaCriada.id) {
      setTarefas((prev) => [tarefaCriada, ...prev]);
      return;
    }
    // Caso contrário, recarrega a lista (fallback)
    buscarTarefas();
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

        <TarefaTabela tarefas={tarefas} />
      </div>
    </section>
  );
}
