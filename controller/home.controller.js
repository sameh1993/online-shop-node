const ProductsModel = require("../model/product.model")

const validationResult = require("express-validator").validationResult

exports.getHome = (req, res, next) => {

    // ProductsModel.getAllProducts().then(products => {
    //     res.render("index", {
    //         products: products
    //     })
    // })

    let filterCategory = req.query.category;
    let ProductPromise



    if (filterCategory && filterCategory !== 'all') ProductPromise = ProductsModel.getProductsByCategory
    else ProductPromise = ProductsModel.getAllProducts

    ProductPromise(filterCategory).then((products) => {
        res.render("index", {
            products: products,
            isAuth: req.session.userId,
            isAdmin: req.session.isAdmin,
            cartsError: req.flash("amountError")
        })
    }).catch(err => {
        console.log(err)
    })
}


exports.postDeleteItem = (req, res, next) => {
    ProductsModel.deleteProduct(req.body.id).then(result => {
        res.redirect("/")
    }).catch(err => {
        console.log(err)
        res.redirect("/")
    })
}