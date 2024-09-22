const express = require('express');
const router = express.Router();
const tarefaController = require('../controllers/tarefaController');
const authMiddleware = require('../middlewares/authMiddleware'); // Importa o middleware

// Aplicando o middleware nas rotas que precisam de autenticação
router.post('/', authMiddleware, tarefaController.createTarefa);
router.get('/', authMiddleware, tarefaController.getTarefas);
router.get('/:id', authMiddleware, tarefaController.getTarefaById);
router.put('/:id', authMiddleware, tarefaController.updateTarefa);
router.delete('/:id', authMiddleware, tarefaController.deleteTarefa);

module.exports = router;