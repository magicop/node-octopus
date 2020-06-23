var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var clienteSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    url: { type: String, required: [true, 'El url es necesario'] },
    img: { type: String, required: false },
    activo: { type: Boolean, required: true, default: true },
});

module.exports = mongoose.model('Cliente', clienteSchema);