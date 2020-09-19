const mongoose = require('mongoose');

const Alumno = mongoose.model('Alumno', new mongoose.Schema({
    nombre:{
        type:String,
        required:true,
        trim:true
    },
    a_Paterno:{
        type:String,
        required:true,
        trim:true
    },
    a_Materno:{
        type:String,
        required:false,
        trim:true
    },
    rfc :{
        type:String,
        required:false,
        trim:true
    },
    fecha_Nacimiento:{
        type: Date,
        trim:true
    },
    tutor:{
        type:Array
    },
    hermano:[{
        type: mongoose.ObjectId, ref:'alumnos'
    }],
    grupo:{
        type:String,
        required: true,
        trim:true
    }
}));

module.exports = Alumno;