// Needed Resources 
const addClassValidate = require("../utilities/management-validation")
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const util = require("../utilities/")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:inventoryId", util.handleErrors(invController.buildByInventoryId));
router.get("/error", util.handleErrors(invController.buildErrorPage))

router.get("/", util.handleErrors(invController.buildManagementView));

router.get("/classification", util.handleErrors(invController.buildAddClassificationView))
router.post("/classification", addClassValidate.addClassificationRules(), addClassValidate.checkAddClassification,  util.handleErrors(invController.addClassification))

router.get("/inventory", util.handleErrors(invController.buildAddInventoryView))
router.post("/inventory", addClassValidate.addInventoryRules(), addClassValidate.checkAddInventory, util.handleErrors(invController.addInventory))
router.get("/getInventory/:classification_id", util.handleErrors(invController.getInventoryJSON))

router.get("/edit/:inv_id", util.handleErrors(invController.buildEditInventoryView))
router.post("/update/", addClassValidate.addInventoryRules(), addClassValidate.checkUpdateInventory, util.handleErrors(invController.updateInventory))

router.get("/delete/:inv_id", util.handleErrors(invController.buildDeleteInventoryView))
router.post("/delete/", util.handleErrors(invController.deleteInventory))

module.exports = router;