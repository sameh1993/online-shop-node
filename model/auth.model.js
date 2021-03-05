const mongoose = require("mongoose")

const db_url = "mongodb+srv://samehsayed:sameh200320@cluster0.n11u1.mongodb.net/online-shop?retryWrites=true&w=majority";
// لتشفير الباسورد المستخدم
const bcrypt = require("bcrypt")

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    isAdmin: {
        type: Boolean,
        default: false
    }
})

 const user = mongoose.model('user', userSchema)


 exports.createNewUser = (username, email, password, isAdmin) => {

    return new Promise((resolve, reject)=> {
        mongoose.connect(db_url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return user.findOne({
                email: email
            })
        }).then(user => {
            if(user) {
                mongoose.disconnect()
                reject("this email is used")
            } else {
                return bcrypt.hash(password, 10)
            }
        }).then(protectPass => {
            let newUser = new user({
                username: username,
                email: email,
                password: protectPass,
                isAdmin: isAdmin
            })
            return newUser.save()
        }).then(() => {
            mongoose.disconnect()
            resolve("Done")
        }).catch(err => {
            reject(err)
        })
    })
 }


 exports.userLogin = (email, pass) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(db_url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return user.findOne({
                email: email
            })
        }).then(user => {
            if(!user) {
                reject("this email is not used")
                mongoose.disconnect()
            } else {
                bcrypt.compare(pass, user.password).then(same => {
                    if(!same) {
                        mongoose.disconnect()
                        reject("this password is incorrect")
                    } else {
                        mongoose.disconnect()
                        resolve({
                            id: user._id,
                            isAdmin: user.isAdmin,
                            email: user.email
                        })
                    }
                })
            }
        }).catch(error => {
            mongoose.disconnect()
            reject(error)
        })
    })
 }