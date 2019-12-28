const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const alunoSchema = new Schema({
  nome: {
    type: String,
    required: true
  },
  matricula: {
    type: String,
    required: true
  },
  _cpfResponsavel: { type: String, required: true },
  _responsavel: {
    type: mongoose.Schema.Types.ObjectId, // _id do responsavel atuando como FK em aluno para relacionar um com o outro
    ref: 'Responsavel' // coleçao
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

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

const Aluno = mongoose.model('Aluno', alunoSchema);
const Responsavel = mongoose.model('Responsavel', responsavelSchema);

const connect = () => {
  mongoose.connect('mongodb://localhost:27017/teste-db', {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  });
  return { Aluno, Responsavel };
};

const Mongo = connect();

const responsavel1 = new Responsavel({
  nome: 'Aaaaaa',
  cpf: '98765432100',
  email: 'a@a',
  senha: 'kasdhjcbaosdvbajsdv',
  endereco: 'AV PASTEUR',
  tipoUsuario: 'admin',
  _aluno: []
});

// responsavel1.save();

const aluno1 = new Aluno({
  nome: 'Bbbbbb',
  _cpfResponsavel: responsavel1.get('cpf'),
  _responsavel: responsavel1._id
});

// aluno1.save();

Aluno.find()
  .populate('_responsavel')
  .exec((error, aluno) => {
    console.log(JSON.stringify(aluno, null, 2));
  });

Responsavel.find()
  .populate('_aluno')
  .exec((error, responsavel) => {
    console.log(JSON.stringify(responsavel, null, 2));
  });
