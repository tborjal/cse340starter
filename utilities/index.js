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

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


module.exports = Util