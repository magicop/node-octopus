const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');


let app = express();
let Empresa = require('../models/empresa');


// ===========================
//  Obtener empresa
// ===========================
app.get('/empresas', (req, res) => {
    // trae todos los productos
    // populate: usuario categoria
    // paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Empresa.find()
        .skip(desde)
        .populate('empresa', 'nombre')
        .exec((err, empresaDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!empresaDB) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                /*ok: true,*/
                empresaDB
            });
        })
});

// ===========================
//  Obtener una empresa por ID
// ===========================
app.get('/empresa/:id', (req, res) => {
    // populate: usuario categoria
    // paginado
    let id = req.params.id;

    Empresa.findById(id)
        .populate('empresa', 'nombre')
        .exec((err, empresaDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!empresaDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'ID no existe'
                    }
                });
            }

            res.json({
                ok: true,
                empresa: empresaDB
            });

        });

});

// ===========================
//  Buscar empresas
// ===========================
app.get('/empresas/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Empresa.find({ nombre: regex })
        .populate('empresa', 'nombre')
        .exec((err, empresas) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                empresas
            })

        })


});



// ===========================
//  Crear una nueva empresa
// ===========================
app.post('/empresas', (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado 

    let body = req.body;

    let empresa = new Empresa({
        nombre: body.nombre,
        direccion: body.direccion,
        telefono: body.telefono,
        telefono2: body.telefono2,
        email: body.email
    });

    empresa.save((err, empresaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            empresa: empresaDB
        });

    });

});

// ===========================
//  Actualizar una empresa
// ===========================
app.put('/empresas/:id', (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado 

    let id = req.params.id;
    let body = req.body;

    Empresa.findById(id, (err, empresaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!empresaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        empresaDB.nombre = body.nombre;
        empresaDB.direccion = body.direccion;
        empresaDB.telefono = body.telefono;
        empresaDB.telefono2 = body.telefono2;
        empresaDB.email = body.email;
        empresaDB.activo = body.activo;

        empresaDB.save((err, empresaGuardada) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                empresa: empresaGuardada
            });

        });

    });


});

// ===========================
//  Desactivar una empresa
// ===========================
app.delete('/empresa/:id', (req, res) => {

    let id = req.params.id;

    Empresa.findById(id, (err, empresaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!empresaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID no existe'
                }
            });
        }

        empresaDB.activo = false;

        empresaDB.save((err, empresaBorrada) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                empresa: empresaBorrada,
                mensaje: 'Empresa desactivada'
            });

        })

    })


});

// ===========================
//  Activar una empresa
// ===========================
app.delete('/activarEmpresa/:id', (req, res) => {

    let id = req.params.id;

    Empresa.findById(id, (err, empresaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!empresaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID no existe'
                }
            });
        }

        empresaDB.activo = true;

        empresaDB.save((err, empresaBorrada) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                empresa: empresaBorrada,
                mensaje: 'Empresa activada'
            });

        })

    })


});


module.exports = app;