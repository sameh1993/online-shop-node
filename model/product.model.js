const mongoose = require("mongoose");

const DB_url = "mongodb+srv://samehsayed:sameh200320@cluster0.n11u1.mongodb.net/online-shop?retryWrites=true&w=majority";

const productSchema = mongoose.Schema({
    name : String,
    description: String,
    price: Number,
    category: String,
    img: String
})

// build structure for collection product
const product = mongoose.model("product", productSchema)

exports.getAllProducts = () => {

    // connect database
    // get products
    // disconnect

    return new Promise((resolve, reject) => {
        mongoose.connect(DB_url, { useUnifiedTopology: true, useNewUrlParser: true }).then(() => {
            return product.find()
        }).then((products) => {
            mongoose.disconnect()
            resolve(products)
        }).catch(error => {
            reject(error)
            mongoose.disconnect()
        })
    })
} 

exports.getProductsByCategory = (category) => {

    // connect database
    // get products
    // disconnect

    return new Promise((resolve, reject) => {
        mongoose.connect(DB_url).then(() => {
            return product.find({
                category: category
            }).sort({ price:1})
        }).then((products) => {
            mongoose.disconnect()
            resolve(products)
        }).catch(error => {
            mongoose.disconnect()
            reject(error)
        })
    })
}


exports.getProductById = (id) => {
    
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() =>{
            return product.findById(id)
        }).then(product => {
            mongoose.disconnect()
            resolve(product)
        })
        .catch(err => {
            mongoose.disconnect()
            reject(err)
        })
    })
}


/*###########################################################################
#############################  Admin Options ################################ */


exports.addNewProduct = (newData) =>{
    return new Promise((resolve, reject) => {
       mongoose.connect(DB_url, { useNewUrlParser: true }).then(() => {
            return product.findOne({name: newData.name})
       }).then(result => {
           if(result) {
               req.flash("msg", "this product is added exactly")
               mongoose.disconnect()
           } else {
               const newProduct = new product(newData)
               newProduct.save().then(product => {
                    resolve(product)
                    mongoose.disconnect()
               }).catch(err => {
                   reject(err)
                   mongoose.disconnect()
               })
           }
       })
    })
}


exports.deleteProduct = (id) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_url).then(() => {
            return product.deleteOne({_id: id})
        }).then(result => {
            mongoose.disconnect()
            resolve(result)
        }).catch(err => {
            mongoose.disconnect()
            reject(err)
        })
    })
}