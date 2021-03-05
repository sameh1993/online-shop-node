

const ProductsModel = require("../model/product.model")

exports.getProductById = (req, res, next) => {

    let Id = req.params.id;

    ProductsModel.getProductById(Id).then(product => {
        res.render("product", {
            product: product,
            isAuth: req.session.userId,
            isAdmin: req.session.isAdmin
        })
    })
}