const express = require('express');
const app = express();
const tarefaRoutes = require('./routes/tarefaRoutes');

app.use(express.json());
app.use('/api', tarefaRoutes);

module.exports = app;