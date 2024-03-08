function deleteService(service_id) {
    let link = '/delete-service-ajax/';
    let data = {
      service_id: service_id
    };
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-service-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            deleteRow(service_id);
            location.reload()

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
    location.reload()

    
  }
  
  function deleteRow(service_id){
      let table = document.getElementById("service-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == service_id) {
              table.deleteRow(i);
              break;
         }
      }
  }