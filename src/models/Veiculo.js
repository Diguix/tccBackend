const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const bcrypt = require('bcryptjs')
//schema de Veiculo
const VeiculoSchema = new mongoose.Schema({
    placa: {
        type: String,
        required: true,
        uppecase: true
    },
    ano: {
        type: String,
        required: true,
        uppecase: true
    },
    modelo: {
        type: String,
        required: true,
        uppecase: true
    },
    categoria: {
        type: String,
        required: true,
        uppecase: true
    },
    _cpfFuncionario: { type: String, required: true },
    _funcionario: {
        type: mongoose.Schema.Types.ObjectId, // _id do funcionario atuando como FK em aluno para relacionar um com o outro
        ref: 'Funcionario' // coleçao 
    },
    updatedAt: { type: Date, default: Date.now },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

const Veiculo = mongoose.model('Veiculo', VeiculoSchema)

module.exports = Veiculo