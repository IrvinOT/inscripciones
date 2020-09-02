
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated())
        return next();

    res.redirect('/logIn');
}

const notLoggedIn = (req, res, next) => {
    if (req.isAuthenticated())
        return res.redirect('/');
    next();

}

module.exports = {
    isLoggedIn,
    notLoggedIn
}