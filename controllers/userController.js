const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/database');

// Cadastro de usuário
exports.registerUser = (req, res) => {
  const { username, password, role } = req.body;

  // Hash da senha
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ error: err.message });

    // Insere o usuário no banco
    db.run(
      "INSERT INTO usuarios (username, password, role) VALUES (?, ?, ?)",
      [username, hashedPassword, role],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Erro ao criar usuário' });
        }
        res.status(201).json({ message: 'Usuário registrado com sucesso!' });
      }
    );
  });
};

// Login de usuário
exports.loginUser = (req, res) => {
  const { username, password } = req.body;

  // Busca o usuário no banco
  db.get("SELECT * FROM usuarios WHERE username = ?", [username], (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: 'Usuário ou senha inválidos' });
    }

    // Compara a senha criptografada
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (!isMatch || err) {
        return res.status(401).json({ error: 'Usuário ou senha inválidos' });
      }

      // Gera o token JWT
      const token = jwt.sign({ id: user.id, role: user.role }, 'chave-secreta', { expiresIn: '1h' });
      res.status(200).json({ token });
    });
  });
};

exports.getUsers = (req, res) => {
  db.all("SELECT * FROM usuarios", (err, users) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
    res.status(200).json(users);
  });
};

exports.getUserById = (req, res) => {
  const { id } = req.params;

  db.get("SELECT * FROM usuarios WHERE id = ?", [id], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.status(200).json(user);
  });
}

exports.updateUser = (req, res) => {
  const { id } = req.params;
  const { username, password, role } = req.body;
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ error: err.message });

    db.run(
      "UPDATE usuarios SET username = ?, password = ?, role = ? WHERE id = ?",
      [username, hashedPassword, role, id],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Erro ao atualizar usuário' });
        }
        if (this.changes) {
          return res.status(200).json({ message: 'Usuário atualizado com sucesso' });
        }
        res.status(404).json({ error: 'Usuário não encontrado' });
      }
    );
  });
};

exports.deleteUser = (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM usuarios WHERE id = ?", [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Erro ao deletar usuário' });
    }
    if (this.changes) {
      return res.status(200).json({ message: 'Usuário deletado com sucesso' });
    }
    res.status(404).json({ error: 'Usuário não encontrado' });
  });
};