const express = require('express');

const app = express();

app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('./producto'));
app.use(require('./clientes'));
app.use(require('./empresa'));

module.exports = app;