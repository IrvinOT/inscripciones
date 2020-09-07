const express = require('express');
const Pago = require('../models/pago');
const Alumno = require('../models/alumno');
const { isLoggedIn } = require('../middleware/check-aut');
const router = new express.Router();

router.get('/pag',isLoggedIn,async (req, res) => {
    const pays = await Pago.find({});
    const email = req.user;
    res.render('pago', { pays,email });
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
        const _id = req.body.alumno;
        const alumno = await Alumno.findById(_id);
        req.body.nombre = alumno.nombre + ' ' + alumno.a_Paterno + ' ' + alumno.a_Materno;
        const pago = new Pago(req.body);

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
    const allowed = ["alumno", "referencia", "aportacion", "fecha","nota","razonEliminacion"];
    const isValid = keys.every((key) => allowed.includes(key));
    try {
        if (!isValid) {
            res.status(400).send({ error: "Invalid update" });
        } else {
            const pago = await Pago.findByIdAndUpdate(_id, changes, { new: true, runValidators: true });
            if (!pago)
                return res.status(404).send();
            res.send(pago);
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




module.exports = router;