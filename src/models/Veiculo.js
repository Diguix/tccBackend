const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const bcrypt = require('bcryptjs');
//schema de Veiculo
const VeiculoSchema = new mongoose.Schema({
    placa: {
        type: String,
        required: true,
        uppecase: true,
    },
    ano: {
        type: String,
        required: true,
    },
    modelo: {
        type: String,
        required: true,
        uppecase: true,
    },
    categoria: {
        type: String,
        required: true,
        uppecase: true,
    },
    status: {
        type: String,
        required: true,
        default: false
    },
    _cpfFuncionario: { type: String, required: false },
    _nomeFuncionario: { type: String, required: false },
    _cnhFuncionario: { type: String, required: false },
    _funcionario: [
        {
            type: mongoose.Schema.Types.ObjectId, // _id do funcionario atuando como FK em aluno para relacionar um com o outro
            ref: 'Funcionario', // coleçao
        },
        { type: mongoose.Schema.Types.nome, ref: 'Funcionario' },
        { type: mongoose.Schema.Types.cpf, ref: 'Funcionario' },
        { type: mongoose.Schema.Types.cnh, ref: 'Funcionario' },
    ],
    updatedAt: { type: Date, default: Date.now },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Veiculo = mongoose.model('Veiculo', VeiculoSchema);

module.exports = Veiculo;
