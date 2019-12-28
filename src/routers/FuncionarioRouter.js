const routes = require('express').Router();
const FuncionarioController = require('../controllers/FuncionarioController');
const ProjetoController = require('../controllers/ProjetoController');
const authMiddlewares = require('../middlewares/auth');

// setando as rotas funcionario
// routes.post('/funcionario/auth', VeiculosController.autorizacao) // autenticacao dos funcionario
routes.get('/funcionario/list', FuncionarioController.list); // lista todos os funcionario
routes.get('/funcionario/find/:cpf', FuncionarioController.find); // pesquisa funcionario
routes.post('/funcionario/create', FuncionarioController.creating); // grava funcionario
routes.put('/funcionario/update/:id', FuncionarioController.update); // atualiza funcionario
routes.delete('/funcionario/delete/:id', FuncionarioController.destroy); // deleta funcionario
routes.get(
  '/funcionario/validacaoVeiculo',
  authMiddlewares,
  ProjetoController.validacaoFuncionario
); // valida funcionario

// routes.use(authMiddlewares);
module.exports = routes;
