const Veiculo = require('../models/Veiculo');
const Funcionario = require('../models/Funcionario');
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
            const veiculo = await Veiculo.find().populate('_funcionario');
            return res.json(veiculo);
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
            const { placa, _cpfFuncionario } = req.body;

            // vetifica se existe algum cpf atrelado em algum veiculo
            // const findCpf = await Veiculo.findOne({
            //     _cpfFuncionario: _cpfFuncionario,
            // });

            // verifica se o veiculo ja existe
            await Veiculo.find({
                placa: placa,
            });

            const motorista = await Funcionario.find({
                cpf: _cpfFuncionario,
            });

            const { _id, cpf } = motorista;

            console.log('PASSEI 2');

            let veiculo_instance = new Veiculo({
                _cpfFuncionario: cpf,
                _funcionario: _id,
                ...req.body,
            });
            console.log('veiculo_instance ===>', veiculo_instance);

            console.log('PASSEI 3');
            await veiculo_instance.save();
            console.log('PASSEI 3.2');

            const veiculoArray = veiculo_instance.get('_funcionario');
            veiculoArray.push(veiculo_instance);
            console.log('PASSEI 3.3');

            const veiculo_update = await Veiculo.findOneAndUpdate(
                {
                    _cpfFuncionario: cpf,
                },
                {
                    _funcionario: _id,
                },
                {
                    new: true,
                }
            );
            console.log('PASSEI 3.4');

            if (veiculo_update) {
                console.log('veiculo_update ===>', veiculo_update);
            } else {
                console.log('ERRO veiculo findOneAndUpdate');
            }

            console.log('PASSEI 4');

            const update_funcionario = await Funcionario.findOneAndUpdate(
                {
                    cpf: _cpfFuncionario,
                },
                { _veiculo: veiculo_instance },
                { new: true }
            );
            console.log('update_funcionario', update_funcionario);

            return res.send('Sucesso!');
        } catch (error) {
            return res
                .status(500)
                .send({ error: 'Nao foi possivel criar novo funcionario' });
        }
    },

    //
    async update(req, res) {
        try {
            const { _cpfFuncionario } = req.body;
            const { id } = req.params;

            // busca o motorista para atualizar o array de funcionario
            const motorista = await Funcionario.find({
                cpf: _cpfFuncionario,
            });

            console.log('motorista', motorista[0].cpf);

            const veiculos = await Veiculo.findByIdAndUpdate(id, req.body, {
                new: true,
            });

            const veiculoArray = veiculos.get('_funcionario');
            veiculoArray.unshift(motorista[0]);

            console.log('veiculoArray', veiculoArray);
            console.log('motorista[0]', motorista[0]);
            const update_veiculo = await Veiculo.findOneAndUpdate(
                {
                    _cpfFuncionario: motorista[0].cpf,
                },
                {
                    _funcionario: veiculoArray,
                },
                {
                    new: true,
                }
            );

            console.log(update_veiculo);

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
