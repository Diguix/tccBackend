const routes = require('express').Router();
const ResponsavelController = require('../controllers/ResponsavelController');
const ProjetoController = require('../controllers/ProjetoController');
const authMiddlewares = require('../middlewares/auth');

// setando as rotas responsavel
routes.post('/responsavel/auth', ResponsavelController.autorizacao); // autenticacao dos responsavel
routes.get('/responsavel/list', ResponsavelController.list); // lista todos os responsavel
routes.get('/responsavel/find/:cpf', ResponsavelController.find); // pesquisa responsavel
routes.post('/responsavel/create', ResponsavelController.creating); // grava responsavel
routes.put('/responsavel/update/:id', ResponsavelController.update); // atualiza responsavel
routes.delete('/responsavel/delete/:id', ResponsavelController.destroy); // deleta responsavel
routes.get(
  '/responsavel/validacaoUsuario',
  authMiddlewares,
  ProjetoController.validacaoResponsavel
); // valida responsavel

// routes.use(authMiddlewares);
module.exports = routes;
