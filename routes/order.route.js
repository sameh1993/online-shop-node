const router = require("express").Router()

const authGuard = require('../views/auth/auth.guards')

const orderController = require("../controller/order.controller")

const bodyPaser = require("body-parser")

router.get("/", authGuard.isAuth, bodyPaser.urlencoded({extended:true}), orderController.getAllOrder)

router.post("/add", authGuard.isAuth, bodyPaser.urlencoded({extended:true}), orderController.postVerifyAddItem)

router.get("/verify-order", orderController.getVerifyOrder)

router.post("/", authGuard.isAuth, bodyPaser.urlencoded({extended:true}), orderController.PostUpdateItem)

router.post("/add-all", orderController.postAddOrderAll)


module.exports = router