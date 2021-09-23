const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const usersRouters = require('../routers/usersRouters');
const recipesRouters = require('../routers/recipesRouters');
const loginRouters = require('../routers/loginRouters');

const app = express();

app.use(express.static(path.join(__dirname, '/uploads')));

// Não remover esse end-point, ele é necessário para o avaliador
app.get('/', (request, response) => {
  response.send();
});
app.use(bodyParser.json());
app.use('/recipes', recipesRouters);
app.use('/users', usersRouters);
app.use('/login', loginRouters);
// Não remover esse end-point, ele é necessário para o avaliador

module.exports = app;
