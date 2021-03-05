
const mongoose = require("mongoose");

const DB_url = "mongodb+srv://samehsayed:sameh200320@cluster0.n11u1.mongodb.net/online-shop?retryWrites=true&w=majority";

const cartSchema = mongoose.Schema({
    name: String,
    price: Number,
    amount: Number,
    userId: String,
    productId: String,
    timeStamp: Number
})

const cart = mongoose.model("cart", cartSchema)


exports.addCart = (id, newCart) => {
    return new Promise((resolve, reject) => {

        mongoose.connect(DB_url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return cart.findOne({ name: newCart.name })
        }).then(backCart => {
            if (backCart) {
               return cart.updateOne({ _id: backCart._id }, {
                    amount: +backCart.amount + newCart.amount,
                    timeStamp: Date.now()
               }).then(result => {
                   resolve(result)
                   mongoose.disconnect()
               }).catch(err => {
                   reject(err)
                   mongoose.disconnect()
               })
                
            } else {
                let newItem = new cart(newCart)
                newItem.save().then(cart => {
                    mongoose.disconnect()
                    resolve(cart)
                }).catch(err => {
                    mongoose.disconnect()
                    reject(err)
                })
            }
        }).catch(err => {
            console.log(err)
        })


    })
}



exports.getCartsByUserId = (userId) => {
    return new Promise((reslove, reject) => {
        mongoose.connect(DB_url).then(() => {
            return cart.find({ userId: userId })
        }).then(carts => {
            mongoose.disconnect()
            reslove(carts)
        }).catch(err => {
            mongoose.disconnect()
            reject(err)
        })
    })
}

exports.getAllCarts = (userId) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_url).then(() => {
            return cart.find({userId: userId})
        }).then(carts => {
            mongoose.disconnect()
            resolve(carts)
        }).catch(err => {
            mongoose.disconnect()
            reject(err)
        })
    })
}

exports.updateCart = (cartId, newData) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_url).then(() => {
            return cart.updateOne({ _id: cartId }, newData)
        }).then(cart => {
            resolve(cart)
            mongoose.disconnect()
        }).catch(err => {
            reject(err)
            mongoose.disconnect()
        })
    })
}

exports.deleteCardById = (id) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_url).then(() => {
            return cart.deleteOne({ _id: id })
        }).then(result => {
            resolve(result)
            mongoose.disconnect()
        }).catch(err => {
            mongoose.disconnect()
            reject(err)
        })
    })
}

exports.deleteAllbyUserId = (userId) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_url).then(() => {
            return cart.deleteMany({userId: userId })
        }).then(result => {
            mongoose.disconnect()
            resolve(result)
        }).catch(err => {
            mongoose.disconnect()
            reject(err)
        })
    })
}