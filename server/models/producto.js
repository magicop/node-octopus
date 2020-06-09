var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var productoSchema = new Schema({
    titulo: { type: String, required: [true, 'El titulo es necesario'] },
    descripcion: { type: String, required: [true, 'La descripcion únitario es necesaria'] },
    url: { type: String, required: [true, 'El url es necesario'] },
    img: { type: String, required: false },
    activo: { type: Boolean, required: true, default: true },
});


module.exports = mongoose.model('Producto', productoSchema);