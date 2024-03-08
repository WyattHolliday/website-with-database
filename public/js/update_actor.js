
// Get the objects we need to modify
let updateAwardForm = document.getElementById('update-actor-form-ajax');

// Modify the objects we need
updateAwardForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let input_actor_id = document.getElementById("actor_id");
    let input_fname = document.getElementById("input-actor-fname");
    let input_lname = document.getElementById("input-actor-lname")

    // Get the values from the form fields
    let actorValue = input_actor_id.value;
    let fnameValue = input_fname.value;
    let lnameValue = input_lname.value;


    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being bassed NULL for homeworld

    // if (isNaN(actorValue)) 
    // {
    //     return;
    // }


    // Put our data we want to send in a javascript object
    let data = {
        actor_id: actorValue,
        fname_id: fnameValue,
        lname_id: lnameValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-actor-ajax", true);
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
    
    let table = document.getElementById("award-table");

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
