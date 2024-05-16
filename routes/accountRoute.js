/* *****************************
* Account Routes
* Unit 4, deliver login view activity
* ********************************* */
// Needed Resources
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")

/* *****************************
* Deliver Login View
* Unit 4, deliver login view activity
* ********************************* */

router.get("/login", utilities.handleErrors(accountController.buildLogin))

module.exports = router;

