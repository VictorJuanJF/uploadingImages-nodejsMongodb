const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    nombre: {
        unique: true,
        type: String,
        required: [true, 'el nombre de la categoria es necesario!']
    },
    descripcion: {
        type: String,
        required: [true, 'La descripcion es obligatoria!']
    },
    idUser: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});

module.exports = mongoose.model('Categoria', categoriaSchema);