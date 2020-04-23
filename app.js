require('dotenv').config();
const express = require('express');
const requireDir = require('require-dir');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const alunoRouter = require('./src/routers/AlunoRouter');
const funcionarioRouter = require('./src/routers/FuncionarioRouter');
const responsavelRouter = require('./src/routers/ResponsavelRouter');
const veiculoRouter = require('./src/routers/VeiculoRouter');

const app = express();

// Para usar banco local usar NODE_ENV como local
const mongoUri =
    process.env.NODE_ENV === 'local'
        ? process.env.MONGO_URL_LOCAL
        : process.env.MONGO_URL_AWS;

const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';
const url = `http://${host}:${port}`;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose
    .connect(mongoUri, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    })
    .then(() => console.log('Conectado ao mongoDB...'))
    .catch((err) => console.error(err));

// App
app.use(express.json()); // permite o envio de formatos json para o app
app.use(express.urlencoded({ extended: true })); // permite lidar com requisicoes no padrao urlenconded
app.use(cors()); // O CORS é um pacote node.js para fornecer um middleware Connect / Express que pode ser usado para ativar o CORS com várias opções
app.use(morgan('dev')); // biblioteca de log

app.use('/', alunoRouter, funcionarioRouter, responsavelRouter, veiculoRouter);

requireDir('./src/models'); // biblioteca 'require-dir' faz o require em todos os arquivos de models automaticamente

app.listen(port, host, () => {
    console.log(`Servidor executando em ${url}`);
    // console.log(`Servidor conectado na uri ${mongoUri}`);
    if (mongoUri === 'mongodb://localhost:27017/MobilidadeEscolar') {
        console.log(`Servidor conectado em DEV`);
    } else {
        console.log(`Servidor conectado em PRD`);
    }
});
