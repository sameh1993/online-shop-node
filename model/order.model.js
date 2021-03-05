
const mongoose = require("mongoose")
const cartModel = require("./card.model");
const DB_url = "mongodb+srv://samehsayed:sameh200320@cluster0.n11u1.mongodb.net/online-shop?retryWrites=true&w=majority";


const orderSchema = mongoose.Schema({
    nameProduct: String,
    amount: Number,
    cost : Number,
    address: String,
    status: String,
    userId: String,
    timeStamp: Date,
    userEmail: String
})

const order = mongoose.model('order', orderSchema)


exports.getAllOrders = (userId) => {
    
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_url).then(() => {
            return order.find({userId: userId})
        }).then(result => {
            mongoose.disconnect()
            resolve(result) 
        }).catch(err => {
            mongoose.disconnect()
            reject(err)
        })
    })
}



exports.AddNewOrder = (newOrder) => {
    
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_url, { useUnifiedTopology: true, useNewUrlParser: true }).then(() => {
            const newItem = new order(newOrder)
            return newItem.save()
        }).then(result => {
            resolve(result)
            mongoose.disconnect()
        }).catch(err => {
            mongoose.disconnect()
            reject(err)
        })
    })
}

exports.updateOrder = (id, timestamp, newDate) => {
    return new Promise((resolve, reject) => {
        if(id) {
            mongoose.connect(DB_url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
                return order.updateOne({ _id: id }, newDate)
             }).then(result => {
                 mongoose.disconnect()
                 resolve(result)
             }).catch(err => {
                 mongoose.disconnect()
                 reject(err)
             })
        } else {
            mongoose.connect(DB_url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
                return order.updateMany({ timeStamp : timestamp }, newDate)
             }).then(result => {
                 mongoose.disconnect()
                 resolve(result)
             }).catch(err => {
                 mongoose.disconnect()
                 reject(err)
             })
        }
    })
}

exports.addMultiOrders = (newItems) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
           return order.insertMany(newItems, (err, result) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(result)
                }
           })
        })
    })
}

exports.updateMultiOrders = (timestamp, newDate) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return order.updateMany({timestamp: timestamp}, newDate)
        }).then(result => {
            resolve(result)
            mongoose.disconnect()
        }).catch(err => {
            reject(err)
            mongoose.disconnect()
        })
    })
}

/*#############################################################3
################## admin options ############################ */

exports.getAllOrdersByAdmin = () => {
    
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return order.find()
        }).then(result => {
            mongoose.disconnect()
            resolve(result) 
        }).catch(err => {
            mongoose.disconnect()
            reject(err)
        })
    })
}

exports.filterOrders = (date) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return order.find(date)
        }).then(result => {
            mongoose.disconnect()
            resolve(result) 
        }).catch(err => {
            mongoose.disconnect()
            reject(err)
        })
    })
}

exports.DeleteMultiOrders = (condition)=> {
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return order.deleteMany(condition)
        }).then(result => {
            resolve(result)
            mongoose.disconnect()
        }).catch(err => {
            mongoose.disconnect()
            reject(err)
        })
    })
}
