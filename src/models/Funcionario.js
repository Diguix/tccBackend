const mongoose = require('mongoose');
// const mongoosePaginate = require('mongoose-paginate')
// const bcrypt = require('bcryptjs')

//schema de Funcionario
const FuncionarioSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        uppecase: true,
    },
    matricula: {
        type: String,
        // required: true,
    },
    cpf: {
        type: String,
        required: true,
        trim: true,
    },
    cnh: {
        type: String,
        required: true,
        trim: true,
    },
    cargo: {
        type: String,
        required: true,
        uppecase: true,
    },
    email: {
        type: String,
        required: true,
        uppecase: false,
    },
    celular: {
        type: String,
        required: true,
        trim: true,
    },
    telefone: {
        type: String,
        required: true,
        trim: true,
    },
    _veiculo: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Veiculo',
        },
    ],
    updatedAt: { type: Date, default: Date.now },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Funcionario = mongoose.model('Funcionario', FuncionarioSchema);

module.exports = Funcionario;
