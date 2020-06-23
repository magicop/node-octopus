var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

var Producto = require('../models/producto');
var Cliente = require('../models/cliente');
var Empresa = require('../models/empresa');
const usuario = require('../models/usuario');

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // Tipos de colección
    var tiposValidos = ['clientes', 'empresas', 'productos'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no es válida',
            errors: { message: 'Tipo de colección no es válida' }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No seleccionó nada',
            errors: { message: 'Debe seleccionar una imagen ' }
        });
    }

    // Obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombre = archivo.name.split('.');
    var extension = nombre[nombre.length - 1];

    // Solo estas extensiones aceptamos
    var extensionesValidas = ['png', 'jpg', 'jpeg']

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extensión no válida',
            errors: { message: 'Las extensiones válidas son ' + extensionesValidas.join(', ') }
        });
    }

    // Nombre de archivo personalizado
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

    // Mover el archivo del temporal a un path
    var path = `${__dirname}/../uploads/${ tipo }/${ nombreArchivo }`;
    console.log(archivo);
    console.log(path);

    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }
        subirPorTipo(tipo, id, nombreArchivo, res);
    })

});

function subirPorTipo(tipo, id, nombreArchivo, res) {
    if (tipo === 'productos') {
        Producto.findById(id, (err, producto) => {
            // var pathViejo = `${__dirname}/../uploads/productos/${producto.img}`;
            var pathViejo = './uploads/productos/' + producto.img;

            // Si existe, elimina la imágen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            producto.img = nombreArchivo;
            producto.save((err, productoActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imágen de producto actualizada',
                    producto: productoActualizado
                });
            })
        });
    }

    if (tipo === 'clientes') {
        Cliente.findById(id, (err, cliente) => {
            // var pathViejo = `${__dirname}/../uploads/productos/${producto.img}`;
            var pathViejo = './uploads/clientes/' + cliente.img;

            // Si existe, elimina la imágen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            cliente.img = nombreArchivo;
            cliente.save((err, clienteActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imágen de cliente actualizada',
                    cliente: clienteActualizado
                });
            })
        });
    }

    if (tipo === 'empresas') {
        Empresa.findById(id, (err, empresa) => {
            // var pathViejo = `${__dirname}/../uploads/productos/${producto.img}`;
            var pathViejo = './uploads/empresas/' + cliente.img;

            // Si existe, elimina la imágen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            empresa.img = nombreArchivo;
            empresa.save((err, empresaActualizada) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imágen de empresa actualizada',
                    empresa: empresaActualizada
                });
            })
        });
    }
}

module.exports = app;