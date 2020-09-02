
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

function intitialize(passport) {
    const authenticationUser = async (email, password, done) => {
        try {
            const message = 'Correo o contraseña invalido';
            const user = await User.findOne({ email: email.toLowerCase() });
            if (!user)
                return done(null, false, { message });
            const isPassword = bcrypt.compareSync(password, user.password)

            if (!isPassword)
                return done(null, false, { message });
                
            return done(null, user);
        } catch (e) {
            return done(e);
        }
    }
    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticationUser));
    passport.serializeUser((user, done) => done(null,user.id));
    passport.deserializeUser((id, done) => done(null, () => User.findById(id)));

}

module.exports = intitialize;