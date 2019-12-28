const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sequenceSchema = new Schema({
  actual: Number
});

const Sequence = mongoose.model('Sequence', sequenceSchema, 'Sequence');
module.exports = Sequence;
