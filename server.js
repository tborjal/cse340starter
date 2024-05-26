

/* *********************

* Require Statements ---

*************************/
const cookieParser = require ("cookie-parser")

const bodyParser = require("body-parser")

const session = require("express-session")
const pool = require('./database/')

const expressLayouts = require("express-ejs-layouts")

const express = require("express")

const env = require("dotenv").config()

const app = express()

const static = require("./routes/static")

const baseController = require("./controllers/baseController")

const inventoryRoute = require("./routes/inventoryRoute")

const accountRoute = require("./routes/accountRoute")

const utilities = require("./utilities/index")

/* *********************

* View Engine and Templates

*************************/

app.set("view engine", "ejs");

app.set("layout", "./layouts/layout"); // Specify the layout file path

app.use(expressLayouts);


/* ***********************
 * Middleware
 * ************************/

app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
}) 

app.use(cookieParser())
app.use(utilities.checkJWTToken)
/* *********************

* Routes

*************************/
//Index route
app.use(static)
// Inventory routes
app.use("/inv", inventoryRoute)
// Account Route
app.use("/account", require("./routes/accountRoute")) 
app.get("/", utilities.handleErrors(baseController.buildHome))
app.get("/", function(req, res) {

  res.render("index", { title: "Home" });

});

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})

/* *********************
* Local Server Information

* Values from .env (environment) file

*************************/

const port = process.env.PORT

const host = process.env.HOST
 
/* *********************

* Log statement to confirm server operation

*************************/

app.listen(port, host, () => {

  console.log(`app listening on ${host}:${port}`)

})