const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildByInventoryId = async function (req, res, next) {
  const inventory_id = req.params.inventoryId
  const data = await invModel.getDetailsByInventoryId(inventory_id)
  const grid = await utilities.buildInventoryDetailsGrid(data)
  let nav = await utilities.getNav()
  const className =  data[0].inv_year + ' ' + data[0].inv_make + ' ' + data[0].inv_model
  res.render("./inventory/details", {
    title: className,
    nav,
    grid,
  })
}

invCont.buildErrorPage = async function (req, res, next){
  const inventory_id = req.params.inventoryId
  const data = await invModel.getDetailsByInventoryId(inventory_id)
  const grid = await utilities.buildInventoryDetailsGrid(data)
  res.render("./inventory/details", {
    title:" ",
    nav,
    grid,
  })
}

invCont.buildManagementView = async function(req, res, next){
  let nav = await utilities.getNav()
  let classification = await utilities.selectClassification()
  res.render("./inventory/management", {
    title: "Management",
    nav,
    errors: null,
    classification,
  })
}
invCont.buildAddClassificationView = async function(req, res, next){
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

invCont.addClassification = async function(req, res){
  const { classification_name } = req.body
  const addClassificationResult = await invModel.addClassification(classification_name)
  let classification = await utilities.selectClassification()
  let nav = await utilities.getNav()
  
  if (addClassificationResult){
    req.flash(
      "notice-green",
      `Congratulations, you\'ve entered ${classification_name}`
    )
    res.status(201).render("inventory/management", {
      title: "Add Classification",
      nav,
      classification,
      errors: null,
    })
  }else{
    req.flash("notice", "Sorry, adding classification failed.")
    req.status(501).render("inventory/add-classification",
    {
      title: "Add Classification",
      nav,
      classification,
      errors: null,
    })
  }
}

invCont.buildAddInventoryView = async function(req, res, next){
  let nav = await utilities.getNav()
  let classification = await utilities.selectAllClassification()
  console.log(classification)
  res.render("inventory/add-inventory",{
    title: "Add Inventory",
    nav,
    classification,
    errors: null,
  })
}

invCont.addInventory = async function(req, res){
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id} = req.body
    const addInventoryResult = await invModel.addInventory(
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id)

    let nav = await utilities.getNav()
    let classification = await utilities.selectClassification()

      if (addInventoryResult){
        req.flash(
          "notice-green",
          `Congratulations, you\'ve entered ${inv_year} ${inv_make} ${inv_model}`
        )
        res.status(201).render("inventory/management", {
          title: "Add Inventory",
          nav,
          classification,
          errors: null,
        })
      }else{
        req.flash("notice", "Sorry, adding inventory failed.")
        req.status(501).render("inventory/add-inventory",
        {
          title: "Add Inventory",
          nav,
          classification,
          errors: null,
      })
}}



module.exports = invCont