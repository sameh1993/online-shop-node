const validationResult = require("express-validator").validationResult

const productModel = require("../model/product.model");
const orderModel  = require("../model/order.model")


exports.getProductPage = (req,res,next) => {
    res.render("add-product", {
        isAuth: req.session.userId,
        isAdmin: req.session.isAdmin,
        formError: req.flash("formProductError"),
        msg: req.flash("msg")
    })
}

exports.postAddProduct = (req,res, next) => {
    if(validationResult(req).isEmpty()) {
        return productModel.addNewProduct({
            name: req.body.productName,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            img: req.file.filename
        }).then(() => {
            res.redirect("/admin/add")
        }).catch(err => {
            res.redirect("/")
            console.log(err)
        })
    } else {
        req.flash("formProductError", validationResult(req).array())
        res.redirect("/admin/add")
    }
}

exports.getDeleteItem = (req, res, next) => {
    productModel.deleteProduct(req.body.id)
}


exports.getManageOrder = (req, res, next) => {
    orderModel.getAllOrdersByAdmin().then(orders => {
        res.render("mange-orders", {
            isAuth: req.session.userId,
            isAdmin: req.session.isAdmin,
            orders: orders
        })
    })
}

exports.postfilterOrders = (req, res, next) => {

    let dataStatus = req.body.status;
    let dataEmail = req.body.email;

    if(dataEmail && dataStatus === 'all') {
        orderModel.filterOrders({userEmail: dataEmail }).then(result => {
            res.render("mange-orders", {
                isAuth: req.session.userId,
                isAdmin: req.session.isAdmin,
                orders: result
            })
        })
    } else if (!dataEmail && dataStatus === 'all') {
        res.redirect("/admin/manage-orders")
    } else if (!dataEmail && dataStatus !== 'all') {
        orderModel.filterOrders({status: dataStatus }).then(result => {
            res.render("mange-orders", {
                isAuth: req.session.userId,
                isAdmin: req.session.isAdmin,
                orders: result
            })
        })
    }
    else {
        orderModel.filterOrders({ status: dataStatus, userEmail: dataEmail }).then(result => {
            res.render("mange-orders", {
                isAuth: req.session.userId,
                isAdmin: req.session.isAdmin,
                orders: result
            })
        })
    }

}

exports.postUpdateOrdersByAdmin = (req, res, next) => {
    console.log(req.body.id, req.body.status)
    orderModel.updateOrder(req.body.id, "", {
        status: req.body.status
    }).then(result => {
        res.redirect("/admin/manage-orders")
    }).catch(err => {
        res.redirect("/admin/manage-orders")
        console.log(err)
    })
}

exports.postDeleteAllOrders = (req, res, next) => {
    orderModel.DeleteMultiOrders({ status: 'completed' }).then(result => {
        res.redirect("/admin/manage-orders")
    }).catch(err => {
        console.log(err)
    })
}