const router = require("express").Router()

const Productcontroller = require("../controller/product.controller")

router.get("/:id", Productcontroller.getProductById)

module.exports = router