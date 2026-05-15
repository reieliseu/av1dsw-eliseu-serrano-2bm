import { prisma } from "../config/prisma.js";
import { Prisma } from "../../generated/prisma/index.js";

// Função para mapear campos do banco para o padrão da API
function mapTask(task) {
  if (!task) return null;
  return {
    id: task.id,
    titulo: task.title,
    descricao: task.description,
    concluida: task.completed,
    criadoEm: task.createdAt,
    categoriaId: task.categoryId,
  };
}

// Listar todas as tarefas
export async function listar() {
  const tasks = await prisma.task.findMany();
  return tasks.map(mapTask);
}

// Buscar tarefa por ID
export async function buscarPorId(id) {
  try {
    const task = await prisma.task.findUnique({ where: { id } });
    return mapTask(task);
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return null;
    }
    throw err;
  }
}

// Criar nova tarefa
export async function criar({
  titulo,
  descricao = null,
  concluida = false,
  categoriaId = null,
}) {
  try {
    const task = await prisma.task.create({
      data: {
        title: titulo,
        description: descricao,
        completed: concluida,
        categoryId: categoriaId,
      },
    });
    return mapTask(task);
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return null;
    }
    throw err;
  }
}

// Atualizar tarefa (parcial)
export async function atualizar(id, campos) {
  try {
    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(campos.titulo !== undefined && { title: campos.titulo }),
        ...(campos.descricao !== undefined && {
          description: campos.descricao,
        }),
        ...(campos.concluida !== undefined && { completed: campos.concluida }),
        ...(campos.categoriaId !== undefined && {
          categoryId: campos.categoriaId,
        }),
      },
    });
    return mapTask(task);
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return null;
    }
    throw err;
  }
}

// Excluir tarefa
export async function excluir(id) {
  try {
    const task = await prisma.task.delete({ where: { id } });
    return mapTask(task);
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return null;
    }
    throw err;
  }
}
