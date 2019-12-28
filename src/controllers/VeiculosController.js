const Veiculo = require('../models/Veiculo');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;
const jwtTTL = process.env.JWT_TTL;

function gerarToken(params = {}) {
  return jwt.sign({ params }, jwtSecret, {
    expiresIn: jwtTTL
  });
}

module.exports = {
  /**
   * criando rota
   * req simboliza a requisicao ao servidor. ele contem todo o detalhe dessa requisicao, por exemplo, body da requisicao, usuario, autenticacao, ip etc.
   * res é a resposta para a requisicao. ele contem toda a informacao de resposta exposta para o usuario.
   */

  async list(req, res) {
    try {
      const veiculos = await Veiculo.find().populate('_funcionario');
      return res.json(veiculos);

    } catch (error) {
      return res.status(500).send(error);
    }
  },

  async find(req, res) {
    try {
      // const veiculos = await Veiculo.findById(req.params.id) // buscando por _id
      const veiculos = await Veiculo.find({
        placa: req.params.placa
      }).populate('_funcionario'); // buscando ela placa

      if (!veiculos) return res.status(404).send('Veiculo nao encontrardo');

      return res.json(veiculos);
    } catch (error) {
      return res.status(500).send(error);
    }
  },

  async creating(req, res) {
    try {
      const { placa } = req.body;

      if (await Veiculo.findOne({ placa }))
        return res.send('placa já cadastrada');

      // if (await Veiculo.findOne({ cpf }))
      //     return res.send('CPF já cadastrado')

      // insere no banco novo usuario
      const veiculo_instance = new Veiculo(req.body)

      await veiculo_instance.save((err) => {
        if (err) return err
      })

      const veiculos = await Veiculo.create(veiculo_instance, (err) => {
        if (err) return err
      });

      res.status(200).send([req.body.placa] + ' ' + ' ' + [req.body.modelo] + '  Cadastrado!')

      // esconde a senha criada para nao mostrar nas buscas
      // veiculos.senha = undefined

      // retorna o usuario e token criado
      return res.json({
        veiculos,
        token: gerarToken({ id: veiculos._id })
      });
    } catch (error) {
      return res
        .status(500)
        .send({ error: 'Nao foi possivel criar novo veiculo' });
    }
  },

  //
  async update(req, res) {
    try {
      const veiculos = await Veiculo.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      return res.json(veiculos);
    } catch (error) {
      return res.status(500).send(error);
    }
  },
  //
  async destroy(req, res) {
    try {
      const veiculos = await Veiculo.findByIdAndRemove(req.params.id);

      return res.send(
        'Veiculo ' + [veiculos.nome] + ' foi excluido com sucesso'
      );
    } catch (error) {
      return res.status(500).send(error);
    }
  }
};
