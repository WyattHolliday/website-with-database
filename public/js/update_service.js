
// Get the objects we need to modify
let updateServiceForm = document.getElementById('update-service-form-ajax');

// Modify the objects we need
updateServiceForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let input_service_id = document.getElementById("service_id");
    let input_service = document.getElementById("input-service-name");
    let input_cost = document.getElementById("input-service-cost")

    // Get the values from the form fields
    let serviceIDValue = input_service_id.value;
    let serviceValue = input_service.value;
    let costValue = input_cost.value;

    console.log(serviceIDValue ,serviceValue, costValue)

    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being bassed NULL for homeworld

    // if (isNaN(actorValue)) 
    // {
    //     return;
    // }


    // Put our data we want to send in a javascript object
    let data = {
        service_id: serviceIDValue,
        service_name_id: serviceValue,
        cost_id: costValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-service-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, award_title_Value);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
    location.reload()

})


function updateRow(data, award_id){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("service-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == award_id) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let td = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign homeworld to our value we updated to
            td.innerHTML = parsedData[0].award_title; 
       }
    }

}
