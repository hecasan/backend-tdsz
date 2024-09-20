const db = require('../db/database');

// Cria uma nova tarefa - Acesso para qualquer usuário autenticado
exports.createTarefa = (req, res) => {
    const { tarefa } = req.body;

    // Insere a tarefa no banco de dados
    db.run("INSERT INTO tarefas (tarefa) VALUES (?)", [tarefa], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, tarefa });
    });
};

// Obtém todas as tarefas - Acesso para qualquer usuário autenticado
exports.getTarefas = (req, res) => {
    db.all("SELECT * FROM tarefas", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(rows);
    });
};

// Obtém uma tarefa específica pelo ID - Acesso para qualquer usuário autenticado
exports.getTarefaById = (req, res) => {
    const { id } = req.params;
    
    // Busca a tarefa pelo ID no banco de dados
    db.get("SELECT * FROM tarefas WHERE id = ?", [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (row) {
            res.status(200).json(row);
        } else {
            res.status(404).json({ error: 'Tarefa não encontrada!' });
        }
    });
};

// Atualiza uma tarefa - Somente usuários com o papel 'admin' podem atualizar tarefas
exports.updateTarefa = (req, res) => {
    const { id } = req.params;
    const { tarefa } = req.body;

    // Verifica se o usuário tem o papel de 'admin'
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem atualizar tarefas.' });
    }

    // Atualiza a tarefa no banco de dados
    db.run("UPDATE tarefas SET tarefa = ? WHERE id = ?", [tarefa, id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes) {
            res.status(200).json({ message: 'Tarefa atualizada com sucesso!' });
        } else {
            res.status(404).json({ error: 'Tarefa não encontrada!' });
        }
    });
};

// Deleta uma tarefa - Somente usuários com o papel 'admin' podem deletar tarefas
exports.deleteTarefa = (req, res) => {
    const { id } = req.params;

    // Verifica se o usuário tem o papel de 'admin'
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem deletar tarefas.' });
    }

    // Remove a tarefa do banco de dados
    db.run("DELETE FROM tarefas WHERE id = ?", [id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes) {
            res.status(200).json({ message: 'Tarefa removida com sucesso!' });
        } else {
            res.status(404).json({ error: 'Tarefa não encontrada!' });
        }
    });
};