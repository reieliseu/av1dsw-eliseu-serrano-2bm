import { useEffect, useState } from "react";
import TarefaForm from "../../components/TarefaForm/";
import TarefaTabela from "../../components/TarefaTabela/";
import api from "../../services/api.js";

export default function TarefasPage() {
  const [descricao, setDescricao] = useState("");
  const [tarefas, setTarefas] = useState([]);

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
