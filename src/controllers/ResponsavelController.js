const Responsavel = require('../models/Responsavel');
const aluno = require('../models/Aluno');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;
const jwtTTL = process.env.JWT_TTL;

function gerarToken(params = {}) {
    return jwt.sign({ params }, jwtSecret, {
        expiresIn: jwtTTL,
    });
}

module.exports = {
    /**
     * criando rota
     * req simboliza a requisicao ao servidor. ele contem todo o detalhe dessa requisicao, por exemplo, body da requisicao, responsavel, autenticacao, ip etc.
     * res é a resposta para a requisicao. ele contem toda a informacao de resposta exposta para o responsavel.
     */

    async autorizacao(req, res) {
        try {
            const { email, cpf } = req.body;
            const autenticacao = await Responsavel.findOne({ email, cpf });

            if (!autenticacao)
                return res
                    .status(401)
                    .send('Email ou Cpf ' + [autenticacao] + ' nao existem');

            // usar caso for autenticar por senha
            // if (!await bcrypt.compare(senha, autenticacao.senha))
            //     return res.status(500).send({ error: 'Senha invalida' })
            // autenticacao.senha = undefined // esconde a senha do response

            return res.send({
                autenticacao,
                token: gerarToken({ id: autenticacao.id }),
            });
        } catch (error) {
            return res
                .status(401)
                .send({ error: 'erro na validacao do login' });
        }
    },

    async list(req, res) {
        try {
            // const resp = await responsavel.find(req.params)

            const resp = await Responsavel.find().populate('_aluno');

            // app.set('etag', 'strong');

            return res.json(resp);
        } catch (error) {
            return res.status(500).send(error);
        }
    },

    async find(req, res) {
        try {
            // const responsavel = await responsavel.find(req.params.id) // busca por _id

            // buscando pela matricula
            const resp = await Responsavel.find({
                cpf: req.params.cpf,
            }).populate('_aluno');

            if (!resp)
                return res.status(404).send('responsavel nao encontrado');

            return res.json(resp);
        } catch (error) {
            return res.status(500).send(error);
        }
    },

    async creating(req, res) {
        try {
            const { cpf, email } = req.body;

            if (await Responsavel.findOne({ email: email }))
                return res.send('Email já cadastrado');

            if (await Responsavel.findOne({ cpf: cpf }))
                return res.send('CPF já cadastrado');

            // insere no banco novo responsavel
            // cria instancia do modelo Responsavel
            let responsavel_instance = new Responsavel(req.body);

            console.info('responsavel_instance  ', responsavel_instance);
            // salva nova instancia do modelo, passando um callback

            await responsavel_instance.save();
            // await responsavel_instance.save(err => {
            //     if (err) return err;
            //     // save
            // });

            const resp = await Responsavel.create(responsavel_instance);
            // const resp = await Responsavel.create(responsavel_instance, err => {
            //     if (err) return err;
            // });

            console.log(resp);
            // TODO - colocar um if para verificar se a inclusao no bancco ocorreu ok

            // res.status(200).send([req.body.nome] + '  Cadastrado!');
            // responsavel.senha = undefined   // esconde a senha criada para nao mostrar nas buscas

            // retorna o responsavel e token criado
            return res.json({
                resp,
                token: gerarToken({ id: resp._id }),
            });
        } catch (error) {
            return res.status(400);
        }
    },

    //
    async update(req, res) {
        try {
            const resp = await Responsavel.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            return res.json(resp);
        } catch (error) {
            return res.status(500).send(error);
        }
    },
    //
    async destroy(req, res) {
        try {
            const resp = await Responsavel.findByIdAndRemove(req.params.id);

            return res.send(
                'responsavel ' + [resp.nome] + ' foi excluido com sucesso'
            );
        } catch (error) {
            return res.status(500).send(error);
        }
    },
};
