  // Get a list of items in inventory based on the classification_id 
  let classificationList = document.querySelector("#classification_id")
  classificationList.addEventListener("change", function () { 
   let classification_id = classificationList.value 
   console.log(`classification_id is: ${classification_id}`) 
   let classIdURL = "/inv/getInventory/"+classification_id 
   fetch(classIdURL) 
   .then(function (response) { 
    if (response.ok) { 
     return response.json(); 
    } 
    throw Error("Network response was not OK"); 
   }) 
   .then(function (data) { 
    console.log(data); 
    buildInventoryList(data); 
   }) 
   .catch(function (error) { 
    console.log('There was a problem: ', error.message) 
   }) 
  })
 
 
 function buildUnapprovedClassificationList (data) { 

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
  function buildUnapprovedInventoryList (data) { 
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
  