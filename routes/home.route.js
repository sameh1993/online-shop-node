const router = require("express").Router()

const authGuard = require("../views/auth/auth.guards")

const HomeController = require("../controller/home.controller")
const bodyParser = require("body-parser")

router.get("/", HomeController.getHome)

router.post("/delete", authGuard.isAdmin, bodyParser.urlencoded({extended:true}), HomeController.postDeleteItem)

module.exports = router