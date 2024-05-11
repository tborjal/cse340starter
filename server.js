

/* *********************

* Require Statements ---

*************************/

const expressLayouts = require("express-ejs-layouts")

const express = require("express")

const env = require("dotenv").config()

const app = express()

const static = require("./routes/static")

const baseController = require("./controllers/baseController")

const inventoryRoute = require("./routes/inventoryRoute")

const utilities = require("./utilities/index")
/* *********************

* View Engine and Templates

*************************/

app.set("view engine", "ejs");

app.set("layout", "./layouts/layout"); // Specify the layout file path

app.use(expressLayouts);
 
/* *********************

* Routes

*************************/

app.use(static)

//Index route
app.use("/inv", inventoryRoute)
// Inventory routes
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