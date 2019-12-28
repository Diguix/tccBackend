const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

//schema de Responsavel
const responsavelSchema = new Schema({
  nome: {
    type: String,
    required: [true, 'Insira o nome'],
    uppecase: true
  },
  cpf: {
    type: String,
    required: [true, 'Insira o CPF ou use o formato valido'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Insira o e email'],
    lowercase: true,
    trim: true
  },
  senha: {
    type: String,
    required: [true, 'Insira a senha'],
    select: false,
    trim: true
  },
  endereco: {
    rua: {
      type: String,
      required: true,
      uppecase: true
    },
    numero: {
      type: Number,
      required: true,
      uppecase: true
    },
    bairro: {
      type: String,
      required: true,
      uppecase: true
    },
    cidade: {
      type: String,
      required: true,
      uppecase: true
    },
    estado: {
      type: String,
      required: true,
      uppecase: true
    }
  },
  telefone: {
    type: String,
    trim: true
  },
  celular: {
    type: String,
    required: [true, 'Insira o numero do celular ou use o formato valido'],
    trim: true
  },
  tipoUsuario: {
    type: String,
    required: true,
    trim: true
  },
  _aluno: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Aluno'
    }
  ],
  updatedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

responsavelSchema.pre('save', async function(next) {
  const hash = await bcrypt.hash(this.senha, 10);

  this.senha = hash;

  next();
});

const Responsavel = mongoose.model('Responsavel', responsavelSchema);

module.exports = Responsavel;
