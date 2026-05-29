import { prisma } from "../config/prisma.js";

// Implementação com fallback em memória para tornar a API funcional

let inMemoryTarefas = [];
let nextId = 1;

function mapTaskFromDb(task) {
  if (!task) return null;
  return {
    id: task.id,
    titulo: task.titulo ?? task.title,
    descricao: task.descricao ?? task.description ?? null,
    concluida: task.concluida ?? task.completed ?? false,
    criadoEm: task.criadoEm ?? task.createdAt ?? null,
    categoriaId: task.categoriaId ?? task.categoryId ?? null,
  };
}

export async function listar() {
  try {
    const tasks = await prisma.task.findMany();
    return tasks.map(mapTaskFromDb);
  } catch (err) {
    // Ignora e usa fallback em memória
    return inMemoryTarefas.slice().map((t) => ({ ...t }));
  }
}

export async function buscarPorId(id) {
  try {
    const task = await prisma.task.findUnique({ where: { id } });
    return mapTaskFromDb(task);
  } catch (err) {
    const t = inMemoryTarefas.find((x) => x.id === id);
    return t ? { ...t } : null;
  }
}

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
      },
    });
    return mapTaskFromDb(task);
  } catch (err) {
    // fallback para memória
    const nova = {
      id: nextId++,
      titulo,
      descricao,
      concluida,
      criadoEm: new Date().toISOString(),
      categoriaId,
    };
    inMemoryTarefas.unshift(nova);
    return { ...nova };
  }
}

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
      },
    });
    return mapTaskFromDb(task);
  } catch (err) {
    // fallback em memória
    const idx = inMemoryTarefas.findIndex((x) => x.id === id);
    if (idx === -1) return null;
    const updated = { ...inMemoryTarefas[idx], ...campos };
    inMemoryTarefas[idx] = updated;
    return { ...updated };
  }
}

export async function excluir(id) {
  try {
    const task = await prisma.task.delete({ where: { id } });
    return mapTaskFromDb(task);
  } catch (err) {
    const idx = inMemoryTarefas.findIndex((x) => x.id === id);
    if (idx === -1) return null;
    const [removed] = inMemoryTarefas.splice(idx, 1);
    return { ...removed };
  }
}
