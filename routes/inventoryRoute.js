// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const util = require("../utilities/")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:inventoryId", util.handleErrors(invController.buildByInventoryId));
router.get("/error", util.handleErrors(invController.buildErrorPage))

module.exports = router;