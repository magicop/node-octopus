const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');


let app = express();
let Cliente = require('../models/cliente');


// ===========================
//  Obtener productos
// ===========================
app.get('/clientes', (req, res) => {
    // trae todos los productos
    // populate: usuario categoria
    // paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Cliente.find()
        .skip(desde)
        .populate('clientes', 'nombre')
        .exec((err, clienteDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!clienteDB) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                /*ok: true,*/
                clienteDB
            });
        })
});

// ===========================
//  Obtener un cliente por ID
// ===========================
app.get('/cliente/:id', (req, res) => {
    // populate: usuario categoria
    // paginado
    let id = req.params.id;

    Cliente.findById(id)
        .populate('clientes', 'nombre')
        .exec((err, clienteDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!clienteDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'ID no existe'
                    }
                });
            }

            res.json({
                ok: true,
                cliente: clienteDB
            });

        });

});

// ===========================
//  Buscar clientes
// ===========================
app.get('/clientes/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Cliente.find({ nombre: regex })
        .populate('clientes', 'nombre')
        .exec((err, clientes) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                clientes
            })

        })


});



// ===========================
//  Crear un nuevo cliente
// ===========================
app.post('/clientes', (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado 

    let body = req.body;

    let cliente = new Cliente({
        nombre: body.nombre,
        url: body.url,
        img: body.img,
        activo: body.activo
    });

    cliente.save((err, clienteDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            cliente: clienteDB
        });

    });

});

// ===========================
//  Actualizar un cliente
// ===========================
app.put('/clientes/:id', (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado 

    let id = req.params.id;
    let body = req.body;

    Cliente.findById(id, (err, clienteDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!clienteDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        clienteDB.nombre = body.nombre;
        clienteDB.url = body.url;
        clienteDB.img = body.img;
        clienteDB.activo = body.activo;

        clienteDB.save((err, clienteGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                cliente: clienteGuardado
            });

        });

    });


});

// ===========================
//  Desactivar un cliente
// ===========================
app.delete('/cliente/:id', (req, res) => {

    let id = req.params.id;

    Cliente.findById(id, (err, clienteDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!clienteDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID no existe'
                }
            });
        }

        clienteDB.activo = false;

        clienteDB.save((err, clienteBorrado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                cliente: clienteBorrado,
                mensaje: 'Cliente desactivado'
            });

        })

    })


});

// ===========================
//  Activar un cliente
// ===========================
app.delete('/activarCliente/:id', (req, res) => {

    let id = req.params.id;

    Cliente.findById(id, (err, clienteDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!clienteDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID no existe'
                }
            });
        }

        clienteDB.activo = true;

        clienteDB.save((err, clienteBorrado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                cliente: clienteBorrado,
                mensaje: 'Cliente activado'
            });

        })

    })


});


module.exports = app;