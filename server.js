const express = require("express");
const app = express();
const path = require("path")

app.use(express.static(path.join(__dirname, "assets")))
app.use(express.static(path.join(__dirname, "images")))


/**
 *  how to use  session to save data in browser
 *  npm install --save express-session connect-mongodb-sesion
 */

var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);

const DB_Url = "mongodb+srv://samehsayed:sameh200320@cluster0.n11u1.mongodb.net/online-shop?retryWrites=true&w=majority";

var store = new MongoDBStore({
    uri: DB_Url,
    collection: 'mySessions'
  });
   
  // Catch errors
  store.on('error', function(error) {
    console.log(error);
  });
   
  app.use(require('express-session')({
    secret: 'This is a secret',
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    store: store,
    // Boilerplate options, see:
    // * https://www.npmjs.com/package/express-session#resave
    // * https://www.npmjs.com/package/express-session#saveuninitialized
    resave: true,
    saveUninitialized: true
  }));

  /***
   *  use connect flash
   *  npm install --save connect-flash
   *   it is middleware . it created as function in requist object
   *    allow me to to control on saved session flash
   */

const flash = require("connect-flash");
app.use(flash())




app.set("view engine", "ejs")
app.set("views", "views")

// start Home routes
const HomeRouter = require("./routes/home.route")
app.use("/", HomeRouter)

// start Product routes
const ProductRouter = require("./routes/product.route")
app.use("/product", ProductRouter)


// start authentication Page
const AuthRouter = require("./routes/auth.route");
app.use("/", AuthRouter)

// start card route
const CartRouter = require("./routes/cart.route")
app.use("/carts", CartRouter)

// start card route
const orderRouter = require("./routes/order.route")
app.use("/orders", orderRouter)

// start card route
const adminRouter = require("./routes/admin.route")
app.use("/admin", adminRouter)

app.use((req, res, next) => {
  res.status = 404;
  res.render("404page", {
    isAdmin: req.session.isAdmin,
    isAuth: req.session.userId
  })
})

const port = process.env.PORT || 2021

app.listen(port, ()  => {
    console.log("server started on port " + port)
})

