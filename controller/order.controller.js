
const orderModel = require("../model/order.model");
const cartModel = require("../model/card.model");

exports.getAllOrder = (req, res, next) => {

   

   if(req.session.isAdmin) {
    orderModel.getAllOrdersByAdmin().then(orders => {
        res.render("orders", {
            orders: orders,
            isAuth: req.session.userId,
            isAdmin: req.session.isAdmin,
            orderId: req.flash("resultId")
        })
    })
   } else {
    orderModel.getAllOrders(req.session.userId).then(orders => {
        res.render("orders", {
            orders: orders,
            isAuth: req.session.userId,
            isAdmin: req.session.isAdmin,
            orderId: req.flash("resultId")
        })
    })
   }
} 

exports.postVerifyAddItem = (req, res, next) => {
    orderModel.AddNewOrder({
        nameProduct: req.body.name,
        amount: +req.body.amount,
        cost: +req.body.cost,
        address: null,
        status: 'waitings',
        userId: req.session.userId,
        userEmail: req.session.email
    }).then(result => {
        if(result) {
            cartModel.deleteCardById(req.body.id).then(() => {
                console.log(result._id)
            })
            req.flash("order", result._id)
            res.redirect("/orders/verify-order")
        }
    }).catch(err => {
        console.log(err)
    })
}

exports.getVerifyOrder = (req, res, next) => {
    res.render("verify-order", {
        isAuth: req.session.userId,
        isAdmin: req.session.isAdmin
    })
}

exports.PostUpdateItem = (req, res, next) => {
    const orderid = req.flash("order")
    const timestamp = req.flash("timestamp")
    orderModel.updateOrder(orderid[0] , timestamp[0], {
        address: req.body.myAddress,
        status: 'waiting'
    }).then(resullt => {
        res.redirect("/orders")
    }).catch(err => {
        console.log(err)
    })
}


exports.postAddOrderAll = (req, res, next) => {
    cartModel.getAllCarts(req.session.userId).then(carts => {
        const orders = []
        const now = Date.now()
        for(let cart of carts) {
            const neworder = {
                nameProduct: cart.name,
                cost: +cart.price + cart.amount,
                amount: +cart.amount,
                userId: req.session.userId,
                address: null,
                status: 'waiting',
                timeStamp: now
            }
            orders.push(neworder)
        }
         orderModel.addMultiOrders(orders).then(result => {
             if(result) {
                 res.redirect("/orders/verify-order")
                 cartModel.deleteAllbyUserId(req.session.userId)
                 req.flash("timestamp", now)
             }
             
         }).catch(err => {
             console.log(err)
         })
    })
}

exports.PostUpdateItems = (req, res, next) => {
    const timestamp = req.flash("timestamp")
    orderModel.updateMultiOrders(timestamp[0] , {
        address: req.body.myAddress,
        status: 'waiting'
    }).then(resullt => {
        res.redirect("/orders")
    }).catch(err => {
        console.log(err)
    })
}