const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const alunoSchema = new Schema({
    nome: {
        type: String,
        required: true,
    },
    matricula: {
        type: String,
        // required: true,
    },
    _cpfResponsavel: { type: String, required: true },
    _responsavel: [
        {
            type: mongoose.Schema.Types.ObjectId, // _id do responsavel atuando como FK em aluno para relacionar um com o outro
            ref: 'Responsavel', // coleçao
        },
        { type: mongoose.Schema.Types.nome, ref: 'Responsavel' },
    ],
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Aluno = mongoose.model('Aluno', alunoSchema);
module.exports = Aluno;
