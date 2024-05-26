const jwt = require("jsonwebtoken")
require("dotenv").config()
const accountModel = require("../models/account-model")
const utilities = require("../utilities/")
const bcrypt = require("bcryptjs")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
    })
  }
 async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
    })
  }

  /* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

       // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )
  
    if (regResult) {
      req.flash(
        "notice-green",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
      })
    }
  }

  /* ****************************************
 *  Process login request
 * ************************************ */
  async function accountLogin(req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
     req.flash("notice", "Please check your credentials and try again.")
     res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
     })
    return
    }
    try {
     if (await bcrypt.compare(account_password, accountData.account_password)) {
     delete accountData.account_password
     const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
     res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
     return res.redirect("/account/")
     } else {
      req.flash('notice', 'Incorrect password. Please try again.');
      res.status(400).render('account/login', {
        title: 'Login',
        nav,
        errors: null,
        account_email,
      });
    }
    } catch (error) {
     return new Error('Access Forbidden')
    }
   }
  
   /* ****************************************
   *  Account Management
   * ************************************ */
  
  async function account (req, res){
    let nav = await utilities.getNav()
    let isLoggedIn = res.locals.loggedin
    let accountType = res.locals.accountData.account_type
    let checkAccountType = utilities.checkAccountType(isLoggedIn, accountType)
    
    res.render("./account/account", {
      title: "Account Management",
      nav,
      accountType,
      checkAccountType,
      errors:null,
    })
  }

   /* ****************************************
 *  Update account data process
 * ************************************ */

async function update (req, res) {
  let nav = await utilities.getNav()
  res.render("./account/update",{
    title: "Edit Account",
    nav,
    errors:null,
    account_id: res.locals.accountData.account_id,
    account_firstname: res.locals.accountData.account_firstname,
    account_lastname: res.locals.accountData.account_lastname,
    account_email: res.locals.accountData.account_email,
  })
}

 /* ****************************************
 *  Update account data success 
 * ************************************ */

async function successUpdateData (req, res) {
  let nav = await utilities.getNav()
  const{ account_firstname, account_lastname, account_email, account_id } = req.body
  const updateResult = await accountModel.updateAccount(account_firstname, account_lastname, account_email, account_id)
  let updatedAccessToken = ""
  if (updateResult) {
    const updatedAccountData = await accountModel.getAccountById(account_id)
    delete updatedAccountData.account_password
    updatedAccessToken = jwt.sign(updatedAccountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 });
    res.cookie("jwt", updatedAccessToken, { httpOnly: true, maxAge: 3600 * 1000 })
    req.flash("notice-green", `Congratulations, your information has been updated.`)
    res.redirect("/account/")
  }else{
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("./account/update", {
      title: "Edit Account",
      nav,
      errors: null,
      account_firstname, 
      account_lastname, 
      account_email, 
      account_id,
    })
  }
}

 /* ****************************************
 *  Update password data success 
 * ************************************ */
async function successUpdatePassword (req, res) {
  let nav= await utilities.getNav()
  const { account_firstname, account_lastname, account_email} = req.body
  const account_password = req.body.account_password
  const account_id = res.locals.accountData.account_id
  
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("./account/update", {
      title: "Edit Account",
      nav,
      errors:null,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    })}

    const passwordUpdateResult = await accountModel.changePassword(hashedPassword, account_id)

    if (passwordUpdateResult){
      req.flash("notice", `Congratulations, your password has been updated`)
      res.redirect("/account/")
    }else{
      req.flash("notice", "Sorry, the change password failed.")
      res.status(501).render("./account/update",{
        title: "Edit Account",
        nav,
        errors:null,
        account_id,
        account_firstname,
        account_lastname,
        account_email,
      })
    }
}

  async function logout(req, res) {
  res.clearCookie('jwt');
  res.redirect('/');
}
  
  module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, account, logout, successUpdateData, successUpdatePassword, update}
