const express = require('express');
const cors = require('cors'); 
const app = express();
const tarefaRoutes = require('./routes/tarefaRoutes');
const userRoutes = require('./routes/userRoutes');
const authMiddleware = require('./middlewares/authMiddleware');

app.use(express.json());

app.use(cors()); 

app.use('/api', userRoutes); 

app.use('/api/tarefas', authMiddleware, tarefaRoutes);

module.exports = app;