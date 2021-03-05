
const router = require("express").Router()

const authGuard = require("../views/auth/auth.guards")
const bodyParser = require("body-parser");
const cardController = require("../controller/cart.controller")
const check = require("express-validator").check

router.get("/", authGuard.isAuth, cardController.getCarts)

router.post("/", authGuard.isAuth,  bodyParser.urlencoded({extended:true}),
check("amount").notEmpty().withMessage("this field is required").custom((val) => {
    if(val >= 1 ) return true
    else throw "amount must be greater than 0"
}),
cardController.postCart)

router.post("/update", authGuard.isAuth,
 bodyParser.urlencoded({extended:true}),
 check("amount").isInt().withMessage("please Enter a Number"),
  cardController.postUpdateCart)

  router.post("/delete", authGuard.isAuth, bodyParser.urlencoded({extended:true}), cardController.postDelete)

  router.post("/delete-all", cardController.postDeleteAll)


module.exports = router
