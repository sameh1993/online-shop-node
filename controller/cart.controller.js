const cartModel = require("../model/card.model")

const validationResult = require("express-validator").validationResult

exports.getCarts = (req, res,next) => {
    
    cartModel.getCartsByUserId(req.session.userId).then(carts => {
        res.render("carts", {
            isAuth: req.session.userId,
            isAdmin: req.session.isAdmin,
            carts: carts,
            amountError: req.flash("errorAmount")
        })
    }).catch(err => {
        console.log(err)
    })
}

exports.postCart = (req, res, next) => {

        if(validationResult(req).isEmpty()) {
            cartModel.addCart(req.body.id, {
                name: req.body.name,
                price: +req.body.price,
                amount: +req.body.amount,
                userId: req.session.userId,
                productId: req.body.productId,
                timeStamp: Date.now()
            }).then(() => {
                res.redirect("/carts")
            }).catch(err => {
                console.log(err)
                res.redirect("/")
            })
        } else {
            req.flash("amountError", validationResult(req).array())
            res.redirect("/")
        }
       
}


exports.postUpdateCart = (req, res, next) => {
    if(validationResult(req).isEmpty()) {
        cartModel.updateCart(req.body.id, {
            amount : req.body.amount,
            timeStamp: Date.now()
        }).then(() => {
            res.redirect("/carts")
        }).catch(err => {
            console.log(err)
        })
    } else {
        req.flash("errorAmount", validationResult(req).array())
        res.redirect("/carts")
    }
}

exports.postDelete = (req, res, next) => {
    console.log(req.body.id)
    cartModel.deleteCardById(req.body.id).then(result => {
        res.redirect("/carts")
    }).catch(err => {
        console.log(err)
    })
}

exports.postDeleteAll = (req, res, next) => {
    cartModel.deleteAllbyUserId(req.session.userId).then(result => {
        res.redirect("/")
    }).catch(err => {
        console.log(err)
        res.redirect("/carts")
    })
}

