const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const passport = require('passport');
const { isLoggedIn } = require('../middleware/check-aut');



const router = new express.Router();

router.get('/users',isLoggedIn, async (req, res) => {
    try {
        const users = await User.find({});
        const email = req.user.email;
        res.send(users,email);
    } catch (e) {
        res.status(500).send();
    }
});
router.post('/user', async (req, res) => {
    try {
        const exist = await User.find({ email: req.body.email.toLowerCase() });
        if (exist.length > 0)
            return res.status(400).send('This users has already exist')
        const password = bcrypt.hashSync(req.body.password, 10,)
        const user = new User({
            email: req.body.email,
            password
        });
        await user.save();
        res.status(201).send({ message: "user Created" })
    } catch (e) {
        res.status(400).send(e);
    }
});

router.patch('/user/:id', async (req, res) => {
    try {
        const _id = req.params.id;
        const keys = Object.keys(req.body);
        const allowed = ["email", "password"]
        const isValid = keys.every((key) => allowed.includes(key))
        if (!isValid)
            return res.status(400).send({ error: 'Actualizacion invalida' });

        const password = bcrypt.hashSync(req.body.password, 10,)
        const changes = {
            email: req.body.email.toLowerCase(),
            password
        };
        const user = await User.findByIdAndUpdate(_id, changes, { new: true, runValidators: true });
        if (!user)
            res.status(404).send();

        res.send("User updated")
    } catch (e) {
        res.status(400).send({ e: e.toString() });
    }
});


router.delete('/user/:id', async (req, res) => {
    try {
        const _id = req.params.id;
        const user = await User.findByIdAndDelete(_id);
        if (!user)
            return res.status(404).send();

        res.send('User has been delted');
    } catch (e) {
        res.status(500).send(e);
    }
});

router.post('/user/logIn' ,passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/logIn',
    failureFlash: true
}));

router.post('/user/logout',async(req,res)=>{
    req.logOut();
    res.redirect('/logIn');
})

module.exports = router;