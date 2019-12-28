const routes = require('express').Router();
const VeiculosController = require('../controllers/VeiculosController');
const ProjetoController = require('../controllers/ProjetoController');
const authMiddlewares = require('../middlewares/auth');

// setando as rotas veiculo
// routes.post('/veiculos/auth', VeiculosController.autorizacao) // autenticacao dos veiculos
routes.get('/veiculos/list', VeiculosController.list); // lista todos os veiculos
routes.get('/veiculos/find/:placa', VeiculosController.find); // pesquisa Veiculos
routes.post('/veiculos/create', VeiculosController.creating); // grava Veiculos
routes.put('/veiculos/update/:id', VeiculosController.update); // atualiza Veiculos
routes.delete('/veiculos/delete/:id', VeiculosController.destroy); // deleta Veiculos
routes.get(
  '/veiculos/validacaoVeiculo',
  authMiddlewares,
  ProjetoController.validacaoVeiculo
); // valida veiculos

// routes.use(authMiddlewares);
module.exports = routes;
