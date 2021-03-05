
const authModel = require("../model/auth.model")

const validationresult = require("express-validator").validationResult

exports.getSignUp = (req, res, next) => {
    res.render("auth/signup", {
        isAuth: req.session.userId,
        isAdmin: false,
        signupError: req.flash("signupError"),
        validatorError: req.flash("validationErrors")
    })
}

exports.postSignUp = (req, res, next) => {
    // return console.log(validationresult(req).array())
    if (validationresult(req).isEmpty()) {
        authModel.createNewUser(req.body.username, req.body.email, req.body.password, req.body.isAuth).then(user => {
            res.redirect("/login")
            console.log(user)
        }).catch(err => {
            res.redirect("/signup")
            req.flash("signupError", err)
        })
    } else {
        req.flash("validationErrors", validationresult(req).array())
        res.redirect("/signup")
    }
   
}

exports.getLogin = (req, res, next) => {
    res.render("auth/signin", {
        isAuth: req.session.userId,
        isAdmin: false,
        loginError : req.flash("errorlogin"),
        fieldError : req.flash("validErrors")
    })
}

exports.postLogin = (req, res, next) => {
    if(validationresult(req).isEmpty()) {
        authModel.userLogin(req.body.emailLogin, req.body.passLogin).then(user => {
            req.session.userId = user.id
            req.session.isAdmin = user.isAdmin
            req.session.email = user.email
            res.redirect("/")
        }).catch(err => {
            req.flash('errorlogin', err)
            res.redirect("/login")
        })
    } else {
        req.flash("validErrors", validationresult(req).array())
        res.redirect("/login")
    }
    
}

exports.logOut = (req, res, next) => {
    req.session.userId = ""
    req.session.isAdmin = ""
    res.redirect("/")
}