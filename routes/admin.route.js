const router = require("express").Router();

const authGuard = require("../views/auth/auth.guards")

const adminController = require("../controller/admin.controller")

const check = require("express-validator").check

const multer = require("multer");
const bodyParser = require("body-parser");

const bodyParser_mw = bodyParser.urlencoded({extended: true})


router.get("/add", authGuard.isAdmin,  adminController.getProductPage)

router.post("/add", multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "images");
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + "-" + file.originalname)
        }
    })
}).single("image"),
check("productName").notEmpty().withMessage("this field is required").not().isNumeric().withMessage("please enter a value string"),
check("price").notEmpty().withMessage("this field is required"),
check("description").notEmpty().withMessage("this field is required"),
check("category").notEmpty().withMessage("this field is required"),
check("image").custom((value, {req}) => {
    if(req.file) return true
    else throw "this field is required"
})
, adminController.postAddProduct )

router.get("/manage-orders", adminController.getManageOrder)

router.post("/manage-orders", bodyParser.urlencoded({extended:true}), adminController.postfilterOrders)

router.post("/manage-orders/update", bodyParser_mw, adminController.postUpdateOrdersByAdmin)

router.post("/manage-orders/delete", bodyParser_mw, adminController.postDeleteAllOrders)

module.exports = router