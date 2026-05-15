// ========================================
// ROUTES - CAMADA DE ROTAS
// ========================================
// Esta camada é responsável por:
// - Definir as rotas da aplicação
// - Mapear URLs para os controllers correspondentes
// - Organizar as rotas por recurso/entidade

import express from "express";
import * as TarefaController from "../controllers/tarefaController.js";

// Cria um roteador do Express
const router = express.Router();

// ========================================
// DEFINIÇÃO DAS ROTAS DE TAREFAS
// ========================================

// GET /tarefas - Listar todas
router.get("/tarefas", TarefaController.listar);

// GET /tarefas/:id - Buscar por ID
router.get("/tarefas/:id", TarefaController.buscarPorId);

// POST /tarefas - Criar nova
router.post("/tarefas", TarefaController.criar);

// PUT /tarefas/:id - Atualizar (total ou parcial)
router.put("/tarefas/:id", TarefaController.atualizar);

// DELETE /tarefas/:id - Excluir
router.delete("/tarefas/:id", TarefaController.excluir);

// Exporta o roteador para ser usado no app principal
export default router;
