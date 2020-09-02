const mongoose = require('mongoose');

const Pago = mongoose.model('Pago',new mongoose.Schema({
    alumno: {
        type: mongoose.Schema.Types.ObjectId ,
        ref:'alumnos',
        required: true
    },
    nombre:{
        type:String
    },
    referencia: {
        type: String,
        required: true,
    },
    aportacion: {
        type: mongoose.Decimal128,
        required: true
    },
    fecha: {
        type: Date,
        required: false
    },
}));

module.exports = Pago;