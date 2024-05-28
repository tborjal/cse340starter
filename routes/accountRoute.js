/* *****************************
* Account Routes
* Unit 4, deliver login view activity
* ********************************* */
// Needed Resources

const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')
const util = require("../utilities/")

/* *****************************
* Deliver Login View
* Unit 4, deliver login view activity
* ********************************* */

router.get("/login", utilities.handleErrors(accountController.buildLogin))

router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Process the registration data

router.post("/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)
// Process the login attempt Black
router.post("/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
  )
router.get("/", utilities.checkLogin, util.handleErrors(accountController.account))

router.get("/update", util.checkLogin, util.handleErrors(accountController.update))

router.post("/update",  regValidate.updateAccountRules(), regValidate.checkUpdateData, util.handleErrors(accountController.successUpdateData))

router.post("/change", regValidate.updatePasswordRules(), regValidate.checkUpdateData, util.handleErrors(accountController.successUpdatePassword))

router.get("/logout",  util.checkLogin, util.handleErrors(accountController.logout))
module.exports = router;

