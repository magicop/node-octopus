var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var empresaSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    direccion: { type: String, required: [true, 'La descripcion es necesaria'] },
    telefono: { type: String, required: [true, 'El telefono es necesario'] },
    telefono2: { type: String, required: [true, 'El telefono2 es necesario'] },
    email: { type: String, required: [true, 'El email es necesario'] },
    activo: { type: Boolean, required: true, default: true }
});


module.exports = mongoose.model('Empresa', empresaSchema);