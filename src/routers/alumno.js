const express = require('express');
const Alumno = require('../models/alumno');
const { isLoggedIn } = require('../middleware/check-aut');
const router = new express.Router();

router.get('/alum', isLoggedIn, async (req, res) => {

    const students = await Alumno.find({});
    const email = req.user;
    res.render('alumno', { students, email });
});

router.get('/alumnos', async (req, res) => {
    try {
        const alumnos = await Alumno.find({});
        res.send(alumnos,);
    } catch (e) {
        res.status(500).send();
    }
});

router.post('/alumno', async (req, res) => {
    try {
        const alumno = new Alumno(req.body);
        await alumno.save();
        alumno.hermano.forEach(brother => {
            asignHermano(brother, alumno._id);
        });
        res.status(201).send(alumno);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.get('/alumno/:id', async (req, res) => {
    try {
        const _id = req.params.id;
        const alumno = await Alumno.findById(_id);
        if (!alumno)
            return res.status(404).send();

        res.send(alumno)
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
});

router.get('/alumno/name/:nom&:aPat&:aMat', async (req, res) => {
    try {
        const search = {
            nombre: req.params.nom,
            a_Paterno: req.params.aPat,
            a_Materno: req.params.aMat
        };
        const alumno = await Alumno.find(search);
        if (!alumno)
            return res.status(404).send();
        res.send(alumno);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get('/alumno/name/:aPat&:aMat', async (req, res) => {
    try {
        const search = {
            a_Paterno: req.params.aPat,
            a_Materno: req.params.aMat
        };
        const alumno = await Alumno.find(search);
        if (!alumno)
            return res.status(404).send();
        res.send(alumno);
    } catch (e) {
        res.status(500).send(e);
    }
});
router.get('/alumno/name/:nom', async (req, res) => {
    try {
        const field = req.params.nom;
        const alumno = await Alumno.find({ $or: [{ nombre: field }, { a_Paterno: field }, { a_Materno: field }] });
        if (!alumno)
            return res.status(404).send();
        res.send(alumno);
    } catch (e) {
        res.status(500).send(e);
    }
});


router.patch('/alumno/:id', async (req, res) => {
    const _id = req.params.id;
    const changes = req.body;

    const keys = Object.keys(changes);
    const allowed = ["nombre", "a_Paterno", "a_Materno", "rfc", "fecha_Nacimiento", "tutor", "hermano", "grupo"];
    const isValid = keys.every((key) => allowed.includes(key));
    try {
        if (!isValid) {
            res.status(400).send({ error: "Invalid Update" });
        } else {
            const alumno = await Alumno.findByIdAndUpdate(_id, changes, { new: true, runValidators: true });
            if (!alumno)
                return res.status(404).send();

            alumno.hermano.forEach(brother => {
                asignHermano(brother, alumno._id);
            });
            res.send(alumno);
        }
    } catch (e) {
        res.status(400).send();
    }
});

router.delete('/alumno/:id', async (req, res) => {
    try {
        const _id = req.params.id;
        const alumno = await Alumno.findByIdAndDelete(_id);
        if (!alumno)
            return res.status(404).send();
        await eliminarHermano(_id);
        res.send(alumno)
    } catch (e) {
        res.status(500).send(e);
    }
});

async function asignHermano(idHermano, idAlumno) {
    try {
        const brother = await Alumno.findById(idHermano);
        var newHeramanos = brother.hermano;
        if (!newHeramanos.includes(idAlumno)) {
            newHeramanos.push(idAlumno);
            await Alumno.findByIdAndUpdate(idHermano, { hermano: newHeramanos }, { new: true, runValidators: true });
        }
    } catch (e) {
        return e;
    }
}

async function eliminarHermano(_id) {
    try {
        const hermanos = await Alumno.find({ hermano: _id })
        hermanos.forEach(async bro => {
            var newHermanos = bro.hermano.filter(broId => {
                var compare = _id.toString().localeCompare(broId);
                return compare !== 0
            });
            await Alumno.findByIdAndUpdate(bro._id,{ hermano: newHermanos });
        });
    } catch (e) {
        return e
    }
}



module.exports = router;