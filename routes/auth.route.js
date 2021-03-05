const router = require("express").Router();

const bodyParser = require("body-parser")

const bodyParser_Mw = bodyParser.urlencoded({extended: true})

const authController = require("../controller/auth.controller");

const authGuards = require("../views/auth/auth.guards")

/***
 *  express-validator [ middleware for forms ]
 *  npm install --save express-validator
 *  it is object contain many function help to form validation 
 */

const check = require("express-validator").check



router.get("/signup", authGuards.notAuth, authController.getSignUp)

router.post("/signup",bodyParser_Mw,
check("username").notEmpty().withMessage("username is required"),
check("email").notEmpty().withMessage("Email is required").isEmail().withMessage("enter a valid email"),
check("password").isLength({min: 6}).withMessage('must be not at least 6 char'),
check("confirmPass").custom((val, {req}) => {
    if (val === req.body.password) return true
    else throw "password is not equal password"
}),
authController.postSignUp)

router.get("/login", authGuards.notAuth,  authController.getLogin)

router.post("/login", bodyParser_Mw,
check("emailLogin").notEmpty().withMessage("email field is required").isEmail().withMessage("enter a valid email"),
check("passLogin").notEmpty().withMessage("password field is required"),
authController.postLogin)

router.post("/logout", authGuards.isAuth, authController.logOut)


module.exports = router