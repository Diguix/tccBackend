const mongoose = require('mongoose')
// const mongoosePaginate = require('mongoose-paginate')
// const bcrypt = require('bcryptjs')

//schema de Funcionario
const FuncionarioSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        uppecase: true
    },
    cpf: {
        type: String,
        required: true
    },
    cnh: {
        type: String
    },
    cargo: {
        type: String,
        required: true
    },
    updated: { type: Date, default: Date.now },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

const Funcionario = mongoose.model('Funcionario', FuncionarioSchema)

module.exports = Funcionario