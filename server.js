

/* *********************

* Require Statements

*************************/

const expressLayouts = require("express-ejs-layouts")

const express = require("express")

const env = require("dotenv").config()

const app = express()

const static = require("./routes/static")
 
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

app.get("/", function(req, res) {

  res.render("index", { title: "Home" });

});
 
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