const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

async function getAllClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

async function getDetailsByInventoryId(inventory_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE inv_id = $1`,
      [inventory_id]
    )
    return data.rows
  } catch (error) {
    console.error("getinventorybyid error " + error)
  }
}

async function addClassification(classification_name){
  try{
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
      return await pool.query(sql, [classification_name])
  } catch (error) {
    return error.message
  }
}

async function checkExistingClassification(classification_name){
  try{
    const sql = "SELECT * FROM classification WHERE classification_name = $1"
    const classficationName = await pool.query(sql, [classification_name])
    return classficationName.rowCount
  }catch (error) {
    return error.message
  }
}

async function addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id){
  try{
    const sql = "INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
    return await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id])
  } catch (error) {
    return error.message
  }

}
async function updateInventory(
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Delete Inventory Item
 * ************************** */
async function deleteInventory(inv_id) {
  try {
    const sql = 'DELETE FROM inventory WHERE inv_id = $1'
    const data = await pool.query(sql, [inv_id])
  return data
  } catch (error) {
    new Error("Delete Inventory Error")
  }
}

async function getUnapprovedClassifications() {
  try{
    const sql = "SELECT * FROM public.classification WHERE classification_approved = false";
    const data = await pool.query(sql);
    return data.rows;
  }catch (error){
    new Error("Unapproved Classification Error")
  }
}

async function getUnapprovedInventory() {
  try{
    const sql = "SELECT * FROM public.inventory AS i JOIN public.classification AS c ON i.classification_id = c.classification_id   WHERE inv_approved = false AND classification_approved = true ORDER BY c.classification_name";
    const data = await pool.query(sql);
    return data.rows;
  }catch (error){
    new Error("Unapproved Inventory Error")
  }
}

async function approvedClassification(account_id, classification_id) {
  try {
    const sql = "UPDATE public.classification SET classification_approved = true, account_id = $1, classification_approval_date = current_timestamp WHERE classification_id = $2";
    const data = await pool.query(sql, [account_id, classification_id]);
    return data.rowCount;
  } catch (error) {
    console.error("Error updating classification: ", error);
    throw error; // Re-throw the error to be caught by the error handler
  }
}

async function getDetailsByClassificationId(classification_id){
  try{
    const sql = "SELECT * FROM classification WHERE classification_id = $1 AND classification_approved = false"
    const classficationData = await pool.query(sql, [classification_id])
    return classficationData.rows
  }catch (error) {
    return error.message
  }
}

async function deleteClassification(classification_id){
  try {
    const sql = 'DELETE FROM classification WHERE classification_id = $1'
    const data = await pool.query(sql, [classification_id])
  return data
  } catch (error) {
    new Error("Delete Inventory Error")
  }
}

async function getUnapprovedInventoryById(inv_id) {
  try{
    const sql = "SELECT * FROM public.inventory AS i JOIN public.classification AS c ON i.classification_id = c.classification_id WHERE inv_id = $1";
    const data = await pool.query(sql, [inv_id]);
    return data.rows[0];
  }catch (error){
    new Error("Unapproved Inventory Error")
  }
}

async function approvedInventory(account_id, inv_id) {
  try {
    const sql = "UPDATE public.inventory SET inv_approved = true, account_id = $1, inv_approved_date = current_timestamp WHERE inv_id = $2";
    const data = await pool.query(sql, [account_id, inv_id]);
    return data.rowCount;
  } catch (error) {
    console.error("Error updating inventory: ", error);
    throw error;
  }
}


module.exports = {getClassifications,
   getInventoryByClassificationId,  
   getDetailsByInventoryId, 
   getAllClassifications, 
   addInventory, 
   checkExistingClassification, 
   addClassification, 
   deleteInventory, 
   updateInventory, 
   getUnapprovedInventory,
   approvedClassification, 
   getDetailsByClassificationId, 
   deleteClassification, 
   getUnapprovedInventoryById, 
   approvedInventory,
  getUnapprovedClassifications}
