const express = require('express');
const app = express();
let { verificaToken, verificaRol_Admin } = require('../middlewares/auth');
const bodyParser = require('body-parser');
let Categoria = require('../models/categoria');

//Mostrar todas las categorias
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
        .sort('nombre')
        .populate('idUser', 'nombre email')
        .exec((err, categoriaDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                categoriaDB
            })
        });
});

// parse application/x-www-form-urlencoded

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Mostrar una categoria por id

app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            categoriaDB
        })
    });
    //Categoria.findByID()
});

//Crear una nueva categoria

app.post('/categoria', verificaToken, (req, res) => {
    //regresa la nueva categoria
    console.log('el body es: ', req.usuario._id);
    idUserToken = req.usuario._id;
    body = req.body;
    let categoria = new Categoria({
        nombre: body.nombre,
        descripcion: body.descripcion,
        idUser: idUserToken
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        // usuarioDB.password = null;

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });
});

app.put('/categoria/:id', verificaToken, (req, res) => {
    id = req.params.id;
    body = req.body;
    Categoria.findByIdAndUpdate(id, body, { new: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Algo falló! en put'
                }
            })
        }
        res.json({
            ok: true,
            categoriaDB
        });
    });

});

app.delete('/categoria/:id', [verificaToken, verificaRol_Admin], (req, res) => {
    //solo un administrador puede borrar
    id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaDeleted) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Algo falló! en delete'
                }
            })
        }
        res.json({
            ok: true,
            categoriaDeleted
        })
    });
});



module.exports = app;