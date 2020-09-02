if(process.env.NODE_ENV !== 'production') 
    require('dotenv').config()

const express = require ('express');
const session = require('express-session');
const hbs = require('hbs');
const path = require('path');
const passport = require('passport');
const flash = require('express-flash');
const initialize = require('./middleware/passport-config');
const {isLoggedIn,notLoggedIn} = require('./middleware/check-aut');

require('./db/mongoose');

const userRoute = require('./routers/user');
const alumnoRoute = require('./routers/alumno');
const pagoRoute = require('./routers/pago');


const app = express();
const port = process.env.PORT || 3000;

//paths
const publicPath = path.join(__dirname,'../public');
const viewPath = path.join(__dirname,'../templates/views');
const partialPath = path.join(__dirname,'../templates/parcials');
const modalPath = path.join(__dirname,'../templates/modal');

app.set('view engine','hbs');
app.set('views',viewPath);
hbs.registerPartials(partialPath);
hbs.registerPartials(modalPath);

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(flash())
app.use(session({
    secret : process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(publicPath));

app.use(userRoute);
app.use(alumnoRoute);
app.use(pagoRoute);

initialize(passport)

app.get('',isLoggedIn,(req,res)=>{
    res.redirect('/pag');
});

app.get('/logIn',notLoggedIn,(req,res)=>{
    res.render('logIn')
})
app.listen(port,()=>{
    console.log('Server is up on port '+port);
});