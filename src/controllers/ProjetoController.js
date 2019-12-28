const express = require('express');
const middlewares = require('../middlewares/auth');
const router = express.Router();
// router.use(middlewares)

module.exports = {
  async validacaoResponsavel(req, res) {
    const usuario = req.userId;
    console.log(usuario);
    return res.send({ ok: true, usuario });
  },

  async validacaoFuncionario(req, res) {
    const aluno = req.userId;
    console.log(aluno);
    return res.send({ ok: true, aluno });
  },

  async validacaoVeiculo(req, res) {
    const veiculo = req.userId;
    console.log(veiculo);
    return res.send({ ok: true, veiculo });
  },

  async validacaoAluno(req, res) {
    const aluno = req.userId;
    console.log(aluno);
    return res.send({ ok: true, aluno });
  }
};
