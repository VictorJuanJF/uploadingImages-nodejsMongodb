const express = require('express');
const app = express();
const _ = require('underscore');
const bodyParser = require('body-parser');
const Usuario = require('../models/usuario');
const { verificaToken, verificaRol_Admin } = require('../middlewares/auth');

// parse application/x-www-form-urlencoded

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get('/usuario', verificaToken, function(req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'id nombre email estado')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.count({ estado: true }, (err, count) => {
                res.json({
                    ok: true,
                    count,
                    usuarios
                })

            });

        });
});

app.post('/usuario', [verificaToken, verificaRol_Admin], (req, res) => {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: body.password,
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        // usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });


});

app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);


    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            Ok: true,
            usuario: userDB
        });
    });


});

app.delete('/usuario/:id', (req, res) => {
    let id = req.params.id;
    let estado = new Boolean(false);
    Usuario.findByIdAndUpdate(id, { estado }, { new: true, runValidators: true }, (err, deletedUser) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!deletedUser) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'No existe el usuario que dijiste'
                }
            });
        }
        res.json({
            ok: true,
            deletedUser
        });
    });
});


module.exports = app;