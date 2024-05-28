const jwt = require("jsonwebtoken")
require("dotenv").config()
const invModel = require("../models/inventory-model")
const Util = {}



/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id + 
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list 
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the details view HTML
* ************************************ */

Util.buildInventoryDetailsGrid = async function(data){

  let grid
  let vehicle = data[0]
  if (vehicle){
    grid = '<div id="details-page">'
    grid += '<div class="details-images"> <img src="' + vehicle.inv_image
    +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
    +' on CSE Motors"></div>'
    grid += '<div class="car-details"><h2>' + vehicle.inv_make + ' ' + vehicle.inv_model + ' Details</h2>'
    grid += '<p> <strong> Price: $</strong>' + new Intl.NumberFormat('en-US').format(vehicle.inv_price)+'</p>'
    grid += '<p><strong> Description: </strong>' + vehicle.inv_description + '</p>'
    grid += '<p><strong> Color: </strong>' + vehicle.inv_color + '</p>'
    grid += '<p><strong> Miles: </strong>' + vehicle.inv_miles.toLocaleString('en-US') + '</p></div>'
    grid += '</div>'
  }else{
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}


Util.selectAllClassification = async function (selectedClassificationId) {
  console.log("Select All Classification")
  let data = await invModel.getAllClassifications();
  let select = '<label for="classification_id">Select Classification: </label><br>';
  select += '<select id="classification_id" name="classification_id">';
  data.rows.forEach((row) => {
    select += '<option value="' + row.classification_id + '"';
    if (row.classification_id == selectedClassificationId) {
      select += ' selected';
    }
    select += '>' + row.classification_name + '</option>';
  });
  select += '</select>';
  return select;
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


Util.selectClassification = async function (selectedClassificationId) {
  let data = await invModel.getClassifications();
  let select = '<label for="classification_id">Select Classification: </label><br>';
  select += '<select id="classification_id" name="classification_id">';
  data.rows.forEach((row) => {
    select += '<option value="' + row.classification_id + '"';
    if (row.classification_id == selectedClassificationId) {
      select += ' selected';
    }
    select += '>' + row.classification_name + '</option>';
  });
  select += '</select>';
  return select;
}

Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

/* Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
} */

Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }
/* ****************************************
 *  Check Type
 * ************************************ */
Util.accountType = (req, res, next) => {
  if (res.locals.accountData.account_type === "Admin" || res.locals.accountData.account_type === "Employee") {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

Util.checkAccountType =(isLoggedIn, accountType) => {
  let managementGrid
  
  if (isLoggedIn && (accountType === "Admin" || accountType === "Employee")) {
    managementGrid = '<h2> Inventory Management </h2>'
    managementGrid += '<a id="inv-management-button" href="../../inv/" title="Inventory Management View "><h3>Manage Inventory</h3></a>'
  }else{
    managementGrid = ''
  }
  return managementGrid
}

Util.buildUnapprovedClassificationList = async function(data) { 
  if (!data || !Array.isArray(data)) {
    console.error("Invalid data passed to Util.buildUnapprovedClassificationList: ", data);
    return "";
  }
  // Set up the table labels 
  let dataTable = '<thead>'; 
  dataTable += '<tr><th>Classification Name</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>'; 
  dataTable += '</thead>'; 
  // Set up the table body 
  dataTable += '<tbody>'; 
  // Iterate over all vehicles in the array and put each in a row 
  data.forEach(function (element) { 
    dataTable += `<tr><td>${element.classification_name}</td>`; 
    dataTable += `<td><a id="approved-button" href='/inv/approved/${element.classification_id}' title='Click to Approve'>Approve</a></td>`; 
    dataTable += `<td><a id="reject-button" href='/inv/deleteClass/${element.classification_id}' title='Click to Reject'>Reject</a></td>`; 
    dataTable += `<td><input type="hidden" name="classification_id" value="${element.classification_id}"></td></tr>`
  }) 
  dataTable += '</tbody>'; 
  // Display the contents in the Inventory Management view 
  return dataTable;
}


  // Build inventory items into HTML table components and inject into DOM 
Util.buildUnapprovedInventoryList = async function(data) { 
 if (!data || !Array.isArray(data)) {
    console.error("Invalid data passed to Util.buildUnapprovedInventoryList: ", data);
    return "";
  }
  // Set up the table labels 
  let dataTable = '<thead>'; 
  dataTable += '<tr><th>Classification Name</th><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>'; 
  dataTable += '</thead>'; 
  // Set up the table body 
  dataTable += '<tbody>'; 
  // Iterate over all vehicles in the array and put each in a row 
  data.forEach(function (element) { 
   dataTable += `<tr><td>${element.classification_name}</td>`
   dataTable += `<td>${element.inv_make} ${element.inv_model}</td>`; 
   dataTable += `<td><a id="approved-button1" href='/inv/approvedInv/${element.inv_id}' title='Click to Approved'>Approved</a></td>`; 
   dataTable += `<td><a id="reject-button1" href='/inv/delete/${element.inv_id}' title='Click to Reject'>Reject</a></td>`; 
   dataTable += `<td><input type="hidden" name="classification_id" value="${element.classification_id}"></td></tr>`
  }) 
  dataTable += '</tbody>'; 
  // Display the contents in the Inventory Management view 
  return dataTable; 
 }

module.exports = Util