const Funcionario = require('../models/Funcionario');
const Veiculo = require('../models/Veiculo');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;
const jwtTTL = process.env.JWT_TTL;

function gerarToken(params = {}) {
    return jwt.sign({ params }, jwtSecret, {
        expiresIn: jwtTTL,
    });
}

const generateMatricula = async () => {
    try {
        let date = new Date().getFullYear();
        let date2 = new Date().getSeconds();
        let date3 = new Date().getMilliseconds();
        let composeMatricula = `${date}${date2}${date3}` + 1;
        let matricula = composeMatricula.toString();

        return matricula;
    } catch (err) {
        throw new Error(err);
    }
};

module.exports = {
    /**
     * criando rota
     * req simboliza a requisicao ao servidor. ele contem todo o detalhe dessa requisicao, por exemplo, body da requisicao, usuario, autenticacao, ip etc.
     * res é a resposta para a requisicao. ele contem toda a informacao de resposta exposta para o usuario.
     */
    async autorizacao(req, res) {
        try {
            const { email, cpf } = req.body;
            const autenticacao = await Funcionario.findOne({ email, cpf });

            if (!autenticacao)
                return res
                    .status(401)
                    .send('Email ou Cpf ' + [autenticacao] + ' nao existem');

            // usar caso for autenticar por senha
            // if (!await bcrypt.compare(senha, autenticacao.senha))
            //     return res.status(401).send({ error: 'Senha invalida' })
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
            const funcionario = await Funcionario.find();

            for (value in funcionario) {
                console.log(funcionario[value].cargo);
                if (value == 'Transportador') {
                    const veiculo = await Funcionario.find().populate(
                        '_veiculo'
                    );
                    res.send(veiculo);
                }
            }

            return res.json(funcionario);
        } catch (error) {
            return res.status(500).send(error);
        }
    },

    async find(req, res) {
        try {
            // const funcionario = await Funcionario.findById(req.params.id) // buscando por _id
            const funcionario = await Funcionario.find({
                cpf: req.params.cpf,
            }); // buscando por matricula

            if (!funcionario)
                return res.status(404).send('Funcionario nao encontrado');

            return res.json(funcionario);
        } catch (error) {
            return res.status(500).send(error);
        }
    },

    async creating(req, res) {
        try {
            const { cpf } = req.body;

            const matricula = await generateMatricula();
            if (matricula) {
                console.log('Criando uma nova matricula >> ', matricula);
            } else {
                console.log('ERRO criando matricula');
            }

            let fetchFunc = await Funcionario.findOne({ cpf }).exec(
                (err, result) => {
                    if (!err) {
                        console.log(
                            `CPF ${cpf} não cadastrado. Pode continuar`
                        );
                    } else {
                        // throw new Error('Matricula já existe', err);
                        return res.status(401).send('CPF já cadastrado');
                    }
                }
            );

            // insere no banco novo usuario
            let funcionario_instance = new Funcionario({
                ...req.body,
            });

            await funcionario_instance.save();
            // await funcionario_instance.save(err => {
            //     if (err) return err;
            // });

            const funcionario = await Funcionario.create(funcionario_instance);
            // const funcionario = await Funcionario.create(
            //     funcionario_instance,
            //     err => {
            //         if (err) return err;
            //     }
            // );

            console.log(funcionario);
            // TODO - colocar um if para verificar se a inclusao no bancco ocorreu ok

            // res.status(200).send([req.body.nome] + '  Cadastrado!');

            // esconde a senha criada para nao mostrar nas buscas
            // funcionario.senha = undefined

            // retorna o usuario e token criado
            return res.json({
                funcionario,
                token: gerarToken({ id: funcionario._id }),
            });
        } catch (error) {
            return res
                .status(500)
                .send({ error: 'Nao foi possivel criar novo funcionario' });
        }
    },

    //
    async update(req, res) {
        try {
            const funcionario = await Funcionario.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            return res.json(funcionario);
        } catch (error) {
            return res.status(500).send(error);
        }
    },
    //
    async destroy(req, res) {
        try {
            const funcionario = await Funcionario.findByIdAndRemove(
                req.params.id
            );

            return res.send(
                'Funcionario ' +
                    [funcionario.nome] +
                    ' foi excluido com sucesso'
            );
        } catch (error) {
            return res.status(500).send(error);
        }
    },
};
