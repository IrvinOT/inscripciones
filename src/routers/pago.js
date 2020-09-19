const express = require('express');
const Pago = require('../models/pago');
const Alumno = require('../models/alumno');
const { isLoggedIn } = require('../middleware/check-aut');
const { findById } = require('../models/pago');
const router = new express.Router();

router.get('/pag', isLoggedIn, async (req, res) => {
    const pays =ordenPorGrupo(await Pago.find({}));
    const email = req.user;
    res.render('pago', { pays, email });
});

router.get('/pagos', async (req, res) => {
    try {
        const pago = await Pago.find({});
        res.send(pago)
    } catch (e) {
        res.status(500);
    }
});

router.post('/pago', async (req, res) => {
    try {
        const data = req.body;
        const _id = data.alumno;
        if(await existPay(_id,data.referencia))
            return res.status(226).send({message:"Ya existe ese Alumno con esa referencia"});
        
        const alumno = await Alumno.findById(_id);
        data.nombre = alumno.nombre + ' ' + alumno.a_Paterno + ' ' + alumno.a_Materno;
        data.grupo = alumno.grupo;
        data.log = new Date();
        
        const pago = new Pago(data);
        await pago.save();
        res.status(201).send(pago);
    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
});

router.get('/pago/:id', async (req, res) => {
    try {
        const _id = req.params.id;
        const pago = await Pago.findById(_id);
        if (!pago)
            return res.status(404).send();
        res.send(pago);
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
});

router.patch('/pago/:id', async (req, res) => {
    const _id = req.params.id;
    const changes = req.body;

    const keys = Object.keys(changes);
    const allowed = ["alumno", "referencia", "aportacion", "fecha", "nota", "razonEliminacion"];
    const isValid = keys.every((key) => allowed.includes(key));
    try {
        if (!isValid) {
            res.status(400).send({ error: "Invalid update" });
        } else {
            const exist = await Pago.findById(_id);
            if (exist) {
                const alumno = await Alumno.findById(exist.alumno);
                if (alumno) {
                    changes.nombre = alumno.nombre + ' ' + alumno.a_Paterno + ' ' + alumno.a_Materno;;
                    changes.grupo = alumno.grupo;
                }
                const pago = await Pago.findByIdAndUpdate(_id, changes, { new: true, runValidators: true });
                res.send(pago);
            } else {
                return res.status(404).send();
            }

        }
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get('/pago/hermanos/:id&:ref', async (req, res) => {
    const search = {
        alumno: req.params.id,
        referencia: req.params.ref
    };
    try {
        const pago = await Pago.find(search);
        if (!pago)
            return res.status(404).send();
        res.send(pago);
    } catch (e) {
        res.status(400).send(e);
    }
});


router.delete('/pago/:id', async (req, res) => {
    try {
        const _id = req.params.id;
        const pago = await Pago.findByIdAndDelete(_id);
        if (!pago)
            return res.status(404).send();
        res.send(pago);
    } catch (e) {
        res.status(500).send(e);
    }
});

async function existPay(idAlumno,referencia){
   try{
     const search = {alumno:idAlumno,referencia};
      const pay = await Pago.find(search);
      if (pay.length > 0)
        return true;

    return false;
   }catch(e){
       console.log(e);
   }
}


function ordenPorGrupo(pagos){
    pagos.sort((a, b) => {
        if (a.grupo > b.grupo)
            return 1;
        if (a.grupo < b.grupo)
            return -1;
        return 0;
    });
    return pagos
}



module.exports = router;