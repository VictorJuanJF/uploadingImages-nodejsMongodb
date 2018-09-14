const express = require('express');
const app = express();
const { verificaToken } = require('../middlewares/auth');
const Producto = require('../models/producto');
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Obtener los productos

app.get('/productos', (req, res) => {
    let limite = req.query.limite || 5;
    Producto.find({ disponible: true })
        .limit(Number(limite))
        .populate('categoria usuario', 'nombre')
        .exec((err, productosDB) => {
            if (err) {
                return json.status(400).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                productosDB
            });
        });

});

// Obtener producto por id

app.get('/productos/:id', (req, res) => {
    let id = req.params.id;
    Producto.findById(id, (err, productoDB) => {
            if (err) {
                return json.status(400).json({
                    ok: false,
                    err
                })
            }
            if (productoDB.disponible == false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El producto ya no existe prro!'
                    }
                })
            }
            res.json({
                ok: true,
                productoDB
            });
        })
        .populate('categoria usuario', 'nombre');

});
//Crear producto
app.post('/productos', verificaToken, (req, res) => {
    body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            productoDB
        })
    });

});
//Actualizar producto
app.put('/productos/:id', (req, res) => {
    let id = req.params.id;
    let producto = {
        nombre: req.body.nombre,
        precioUni: req.body.precioUni,
        descripcion: req.body.descripcion
    }
    Producto.findByIdAndUpdate(id, producto, { new: true }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            productoDB
        })
    });

});
//Borrar un producto
app.delete('/productos/:id', (req, res) => {
    let id = req.params.id;
    let estado = {
        disponible: false
    }
    Producto.findByIdAndUpdate(id, estado, { new: true }, (err, deletedProduct) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            deletedProduct
        })
    });

});

//Buscar productos
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');
    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productoDB
            })
        });
});


module.exports = app;