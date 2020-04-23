/**
 * sera usado o populate() do mongoose para relacionar
 * o responsavel pelo aluno, onde a PK do responsavel será FK em aluno.
 *
 */

const Aluno = require('../models/Aluno');
const Responsavel = require('../models/Responsavel');
const Sequence = require('../models/Sequence');
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
        // const sequence = await Sequence.find();

        // const sequenceValue = sequence[0].get('actual');
        // const sequenceValueIncremented = sequenceValue + 1;
        // await Sequence.findOneAndUpdate(
        //     { actual: sequenceValue },
        //     { actual: sequenceValueIncremented }
        // );
        // const sequenceValueWith0s = new String(
        //     sequenceValueIncremented
        // ).padStart(7, '0');
        // const year = new Date().getFullYear();
        // const matricula = `${year}${sequenceValueWith0s}`;

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

    async list(req, res) {
        try {
            const aluno = await Aluno.find().populate('_responsavel');
            res.send(aluno);
        } catch (error) {
            res.status(500).send(error);
        }
    },

    async find(req, res) {
        try {
            // const aluno = await Aluno.findById(req.params.id) // buscando por _id
            const aluno = await Aluno.find({
                matricula: req.params.matricula,
            }).populate('_responsavel');

            if (!aluno) return res.status(404).send('Aluno nao encontrado');

            return res.json(aluno);
        } catch (error) {
            return res.status(500).send(error);
        }
    },

    async creating(req, res) {
        try {
            const { _cpfResponsavel } = req.body;

            const matricula = await generateMatricula();

            if (matricula) {
                console.log('Criando uma nova matricula >> ', matricula);
            } else {
                console.log('ERRO criando matricula');
            }

            const findALuno = await Aluno.findOne({ matricula }).exec(
                (err, result) => {
                    if (!err) {
                        console.log(
                            `Matricula ${matricula} ainda não existe. Pode continuar`
                        );
                    } else {
                        throw new Error('Matricula já existe', err);
                    }
                }
            );

            const responsavel = await Responsavel.findOne({
                cpf: _cpfResponsavel,
            });
            
            const { _id } = responsavel;

            const aluno = new Aluno({
                matricula: matricula,
                _responsavel: _id,
                ...req.body,
            });

            await aluno.save();

            const alunosArray = responsavel.get('_aluno');
            alunosArray.push(aluno._id);

            await Responsavel.findOneAndUpdate(
                {
                    cpf: _cpfResponsavel,
                },
                { _aluno: alunosArray }
            ).exec((err, result) => {
                if (!err) {
                    console.log('responsavel findOneAndUpdate', result);
                } else {
                    throw new Error('ERRO responsavel findOneAndUpdate', err);
                }
            });

            return res
                .status(200)
                .send(`Aluno ${aluno.get('nome')} criado com Sucesso!`);
            // return res.json();
            // console.info(res.json());
        } catch (err) {
            // res.status(500).send(err);
            throw new Error(err);
        }
    },

    //
    async update(req, res) {
        try {
            const aluno = await Aluno.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                }
            );
            return res.json(aluno);
        } catch (error) {
            return res.status(500).send(error);
        }
    },
    //
    async destroy(req, res) {
        try {
            const aluno = await Aluno.findByIdAndRemove(req.params.id);

            return res.send(
                'Aluno ' + [aluno.nome] + ' foi excluido com sucesso'
            );
        } catch (error) {
            return res.status(500).send(error);
        }
    },
};
