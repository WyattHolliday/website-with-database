function deleteAward(award_id) {
    let link = '/delete-award-ajax/';
    let data = {
      award_id: award_id
    };
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-award-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            deleteRow(award_id);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
    
  }
  
  function deleteRow(award_id){
      let table = document.getElementById("award-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == award_id) {
              table.deleteRow(i);
              break;
         }
      }
  }