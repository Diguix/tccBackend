const routes = require('express').Router();
const AlunoController = require('../controllers/AlunoController');
const ProjetoController = require('../controllers/ProjetoController');
const authMiddlewares = require('../middlewares/auth');

// setando as rotas aluno
// routes.post('/aluno/auth', AlunoController.autorizacao) // autenticacao dos Alunoss
routes.get('/aluno/list', AlunoController.list); // lista todos os Alunoss
routes.get('/aluno/find/:matricula', AlunoController.find); // pesquisa Alunos
routes.post('/aluno/create', AlunoController.creating); // grava Alunos
routes.put('/aluno/update/:id', AlunoController.update); // atualiza Alunos
routes.delete('/aluno/delete/:id', AlunoController.destroy); // deleta Alunos
routes.get(
  '/aluno/validacaoAluno',
  authMiddlewares,
  ProjetoController.validacaoAluno
); // valida aluno

// routes.use(authMiddlewares);
module.exports = routes;
