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

const generatePlaca = async () => {
    try {
        const sequence = await Sequence.find();
        const sequenceValue = sequence[0].get('actual');
        const sequenceValueIncremented = sequenceValue + 1;
        await Sequence.findOneAndUpdate(
            { actual: sequenceValue },
            { actual: sequenceValueIncremented }
        );
        const sequenceValueWith0s = new String(
            sequenceValueIncremented
        ).padStart(7, '0');
        const year = new Date().getFullYear();
        const placa = `${year}${sequenceValueWith0s}`;

        return placa;
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
            const resp = await Veiculo.find().populate('_funcionario');
            return res.json(resp);
        } catch (error) {
            return res.status(500).send(error);
        }
    },

    async find(req, res) {
        try {
            // const veiculos = await Veiculo.findById(req.params.id) // buscando por _id
            const veiculos = await Veiculo.find({
                placa: req.params.placa,
            }).populate('_funcionario'); // buscando ela placa

            if (!veiculos)
                return res.status(404).send('Veiculo nao encontrardo');

            return res.json(veiculos);
        } catch (error) {
            return res.status(500).send(error);
        }
    },

    async creating(req, res) {
        try {
            const { placa } = req.body;

            if (await Veiculo.findOne({ placa: placa }))
                return res.send('Placa já cadastrada');

            let veiculo_instance = new Veiculo(req.body);

            await veiculo_instance.save(err => {
                if (err) return err;
            });

            const resp = await Funcionario.create(
                veiculo_instance,
                err => {
                    if (err) return err;
                }
            );

            res.status(200).send(`${req.body.placa} cadastrado com sucesso!`);
            return res.json({
                resp,
                token: gerarToken({ id: resp._id }),
            });
            // const veiculo = new Veiculo({
            //     placa: placa,
            //     ...req.body,
            //     _funcionario: funcionario._id,
            // });

            // await veiculo.save();

            // const veiculoArray = funcionario.get('_placa');
            // veiculoArray.push(veiculo._id);

            // await Funcionario.findOneAndUpdate(
            //     {
            //         cpf: req.body._cpfFuncionario,
            //     },
            //     { _veiculo: veiculoArray }
            // );

            // res.status(201).send(
            //     `Veiculo ${veiculo.get('placa')} criado com Sucesso`
            // );

            // const veiculo_instance = new Veiculo(req.body);

            // await veiculo_instance.save(err => {
            //     if (err) return err;
            // });

            // const veiculos = await Veiculo.create(veiculo_instance, err => {
            //     if (err) return err;
            // });

            // res.status(200).send(
            //     [req.body.placa] +
            //         ' ' +
            //         ' ' +
            //         [req.body.modelo] +
            //         '  Cadastrado!'
            // );

            // esconde a senha criada para nao mostrar nas buscas
            // veiculos.senha = undefined

            // retorna o usuario e token criado
            // return res.json({
            //     veiculos,
            //     token: gerarToken({ id: veiculos._id }),
            // });
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
    },
};
