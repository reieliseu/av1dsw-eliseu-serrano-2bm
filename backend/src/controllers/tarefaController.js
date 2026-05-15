import * as TarefaModel from "../models/tarefaModel.js";

// Listar todas as tarefas
export async function listar(req, res) {
  try {
    const tarefas = await TarefaModel.listar();
    res.json(tarefas);
  } catch (err) {
    console.error("Erro ao listar tarefas:", err);
    res.status(500).json({ erro: "Erro ao listar tarefas" });
  }
}

// Buscar tarefa por ID
export async function buscarPorId(req, res) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ erro: "ID inválido" });
  }
  try {
    const tarefa = await TarefaModel.buscarPorId(id);
    if (!tarefa) {
      return res.status(404).json({ erro: "Tarefa não encontrada" });
    }
    res.json(tarefa);
  } catch (err) {
    console.error("Erro ao buscar tarefa:", err);
    res.status(500).json({ erro: "Erro ao buscar tarefa" });
  }
}

// Criar nova tarefa
export async function criar(req, res) {
  const { titulo, descricao, concluida, categoriaId } = req.body;
  if (!titulo || typeof titulo !== "string" || titulo.trim() === "") {
    return res.status(400).json({ erro: "Título obrigatório" });
  }
  try {
    const tarefa = await TarefaModel.criar({
      titulo,
      descricao,
      concluida,
      categoriaId,
    });
    res.status(201).json(tarefa);
  } catch (err) {
    console.error("Erro ao criar tarefa:", err);
    res.status(500).json({ erro: "Erro ao criar tarefa" });
  }
}

// Atualizar tarefa
export async function atualizar(req, res) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ erro: "ID inválido" });
  }
  const campos = {};
  if (req.body.titulo !== undefined) campos.titulo = req.body.titulo;
  if (req.body.descricao !== undefined) campos.descricao = req.body.descricao;
  if (req.body.concluida !== undefined) campos.concluida = req.body.concluida;
  if (req.body.categoriaId !== undefined)
    campos.categoriaId = req.body.categoriaId;
  if (Object.keys(campos).length === 0) {
    return res.status(400).json({ erro: "Nenhum campo para atualizar" });
  }
  try {
    const tarefa = await TarefaModel.atualizar(id, campos);
    if (!tarefa) {
      return res.status(404).json({ erro: "Tarefa não encontrada" });
    }
    res.json(tarefa);
  } catch (err) {
    console.error("Erro ao atualizar tarefa:", err);
    res.status(500).json({ erro: "Erro ao atualizar tarefa" });
  }
}

// Excluir tarefa
export async function excluir(req, res) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ erro: "ID inválido" });
  }
  try {
    const tarefa = await TarefaModel.excluir(id);
    if (!tarefa) {
      return res.status(404).json({ erro: "Tarefa não encontrada" });
    }
    res.json(tarefa);
  } catch (err) {
    console.error("Erro ao excluir tarefa:", err);
    res.status(500).json({ erro: "Erro ao excluir tarefa" });
  }
}
